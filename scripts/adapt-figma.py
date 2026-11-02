#!/usr/bin/env python3
"""Turn Figma's rendered JSX into a semantic, edition-neutral body fragment.

Usage: python3 scripts/adapt-figma.py RAW_HTML PAGE_INDEX OUTPUT_HTML
Only Python's standard library is required. Source nodes are read, never edited.
"""
from __future__ import annotations

import html
import json
import re
import sys
from html.parser import HTMLParser
from pathlib import Path


class Node:
    def __init__(self, tag="", attrs=None, children=None):
        self.tag = tag
        self.attrs = dict(attrs or {})
        self.children = list(children or [])

    def text(self):
        return clean(" ".join(c.text() if isinstance(c, Node) else c for c in self.children))

    def walk(self):
        yield self
        for child in self.children:
            if isinstance(child, Node):
                yield from child.walk()

    def elements(self):
        return [c for c in self.children if isinstance(c, Node)]

    @property
    def name(self):
        return self.attrs.get("data-name", "")

    @property
    def classes(self):
        return self.attrs.get("class", "")


class Parser(HTMLParser):
    VOID = {"area", "base", "br", "col", "embed", "hr", "img", "input", "link", "meta", "param", "source", "track", "wbr"}

    def __init__(self, source):
        super().__init__(convert_charrefs=True)
        self.root = Node("root")
        self.stack = [self.root]
        self.feed(source)

    def handle_starttag(self, tag, attrs):
        node = Node(tag, attrs)
        self.stack[-1].children.append(node)
        if tag not in self.VOID:
            self.stack.append(node)

    def handle_startendtag(self, tag, attrs):
        self.stack[-1].children.append(Node(tag, attrs))

    def handle_endtag(self, tag):
        for i in range(len(self.stack) - 1, 0, -1):
            if self.stack[i].tag == tag:
                del self.stack[i:]
                break

    def handle_data(self, data):
        self.stack[-1].children.append(data)


def clean(s):
    return re.sub(r"\s+", " ", s.replace("\u200b", "").replace("\xa0", " ")).strip()


def esc(s):
    return html.escape(str(s), quote=True)


def element(tag, contents="", **attrs):
    attr = "".join(" " + key.replace("_", "-") + ('="' + esc(value) + '"' if value is not None else "") for key, value in attrs.items())
    return f"<{tag}{attr}>{contents}</{tag}>"


def source_attrs(node):
    return {k.replace("-", "_"): node.attrs[k] for k in ("data-name", "data-node-id") if k in node.attrs}


def group_actions(parts):
    """Preserve the source's adjacent primary/link-button row as a real group."""
    output, pending = [], []
    for part in parts + [""]:
        if part.startswith(("<a ", "<button ")):
            pending.append(part)
        else:
            if pending:
                output.append(element("div", "".join(pending), data_part="actions"))
                pending = []
            if part:
                output.append(part)
    return output


CORRECTIONS = (
    ("STAY WE US", "STAY WITH US"),
    ("the frecuency dome", "the frequency dome"),
    ("May to NOvember", "May to November"),
    ("From [rate] a nigh", "From [rate] a night"),
    ("the lights goes", "the light goes"),
    ("book tHE TREEHOUSE", "Book the Treehouse"),
    ("for guest staying with us", "for guests staying with us"),
    ("best time to visiting us", "best time to visit us"),
    ("Whatsap Contact", "WhatsApp Contact"),
    ("Adress Info", "Address Info"),
)


class Adapter:
    def __init__(self, page_index):
        self.index = int(page_index)
        self.h1_done = False
        self.gallery_index = 0
        data_path = Path(__file__).resolve().parent.parent / "src/data/pages.json"
        self.pages = json.loads(data_path.read_text())
        self.page = next(p for p in self.pages if int(p["index"]) == self.index)
        self.routes = {clean(p["name"]).lower().rstrip("."): p["slug"] for p in self.pages}
        self.routes.update({
            "the villas": "villas", "villas": "villas", "the treehouse": "treehouse", "treehouse": "treehouse",
            "glamping": "glamping-tents", "glamping tents": "glamping-tents", "the glamping tents": "glamping-tents",
            "the frequency experience": "frequency-experience", "frequency experience": "frequency-experience",
            "the day and the half day": "day-and-half-day", "for two": "for-two",
            "the vessyl presents": "the-vessyl-presents", "horses and the river": "horses-and-the-river",
        })

    def corrected(self, text, context=""):
        for before, after in CORRECTIONS:
            # Avoid changing the already-correct 'night' into 'nightt'.
            if before.endswith("a nigh"):
                text = re.sub(re.escape(before) + r"(?!t)", after, text)
            else:
                text = text.replace(before, after)
        if text.lower() == "about the villas" and self.index != 3:
            text = {4: "About the Treehouse", 5: "About the tents", 11: "About the experience", 12: "About the ride"}.get(self.index, text)
        if self.index == 5:
            text = re.sub(r"(?i)book this villa", "Book a tent", text)
            text = text.replace("The Villas Gallery", "Glamping Tents Gallery")
        if self.index == 8 and context == "card":
            text = text.replace("Four nights or more, [offer]", "[offer]")
        return text

    def action(self, label, node, context=""):
        label = self.corrected(clean(label), context)
        if not label:
            return ""
        lower = label.lower().rstrip(".")
        route = None
        if lower == "check availability":
            url = "__BOOKING_URL__"
        elif lower == "book an experience":
            url = "__EDITION_ROOT__/experiences/"
        elif lower in {"see where you will sleep", "where you sleep"}:
            # The Home Dome section contains a pasted room CTA.
            if context == "dome":
                label, route = "Explore the Dome", "frequency-experience"
            else:
                route = "where-you-sleep"
            url = ""
        elif lower in {"what the dome is", "explore the dome"}:
            route, url = "frequency-experience", ""
        elif lower in {"book this villa", "book the treehouse", "book a tent", "book the glamping tents"}:
            url = "__BOOKING_URL__"
        elif lower.startswith("see "):
            route = self.routes.get(lower.removeprefix("see "))
            url = ""
        else:
            route = self.routes.get(lower)
            url = ""
        attrs = source_attrs(node)
        attrs.update({"class": "current-action", "data_part": "action"})
        if route is not None:
            url = "__EDITION_ROOT__/" + route.strip("/") + "/"
        # Experience dates/prices/integration are unprovided. A button can expose
        # the pending status accessibly without pretending a booking succeeded.
        if url:
            attrs["href"] = url
            return element("a", esc(label), **attrs)
        attrs.update({"type": "button", "data_pending_link": "", "aria_label": label + " — destination not supplied"})
        return element("button", esc(label), **attrs)

    def atoms(self, root, heading="h2", context="", skip=None):
        out = []
        skip = set(skip or [])

        def visit(node):
            if node.name in skip or node.tag in {"img", "svg", "script", "style", "link", "template"}:
                return
            text = node.text()
            if not text:
                return
            if node.name in {"Menu", "Footer", "Newsletter", "Language", "Menu right", "Menu Hamburger"}:
                return
            if node.name in {"CTA", "Small CTA"} or node.name.startswith("Link arrow button"):
                out.append(self.action(text, node, context))
                return
            if node.name == "Person info":
                parts = [element("p", esc(c.text()), data_part="author-name" if i == 0 else "author-role", **source_attrs(c)) for i, c in enumerate(node.elements()) if c.text()]
                out.append(element("div", "".join(parts), data_part="attribution"))
                return
            cls = node.classes
            if "Telugu" in cls:
                if len(text) > 300 and node.tag == "div" and any(c.tag == "p" for c in node.elements()):
                    for child in node.elements():
                        if child.text():
                            out.append(element("p", esc(self.corrected(child.text(), context)), data_part="paragraph", **{"class": "display-prose"}))
                    return
                attrs = source_attrs(node)
                attrs.update({"class": "c-heading", "data_part": "heading"})
                out.append(element(heading, esc(self.corrected(text, context)), **attrs))
                return
            if "Roboto" in cls and node.tag == "div":
                children = node.elements()
                # Generated paragraphs often encode fixed desktop line breaks,
                # not separate paragraphs (e.g. 'with dinner' on its own line).
                if children and all(c.tag == "p" and c.text() for c in children) and not any(c.tag == "br" for c in node.walk()):
                    out.append(element("p", esc(self.corrected(text, context)), data_part="paragraph", **source_attrs(node)))
                    return
            if node.tag == "p" or ("Roboto" in cls and not any(x.tag == "p" for x in node.elements())):
                if text.upper() in {"CHECK AVAILABILITY", "BOOK AN EXPERIENCE"}:
                    out.append(self.action(text, node, context))
                    return
                attrs = source_attrs(node)
                kind = "eyebrow" if ("uppercase" in cls and "tracking-" in cls) else "highlight" if "font-semibold" in cls and "text-[20px]" in cls else "paragraph"
                attrs["data_part"] = kind
                if re.search(r"text-\[(?:22|24)px\]", cls):
                    attrs["class"] = "current-lede"
                out.append(element("p", esc(self.corrected(text, context)), **attrs))
                return
            for child in node.elements():
                visit(child)

        visit(root)
        return group_actions(out)

    def copy(self, node, heading="h2", context="", part="copy", skip=None):
        return element("div", "\n".join(self.atoms(node, heading, context, skip)), data_part=part)

    def image_nodes(self, node, photo_only=True):
        return [n for n in node.walk() if n.tag == "img" and n.attrs.get("src") and
                (not photo_only or not re.search(r"\.svg(?:[?#]|$)", n.attrs["src"], re.I))]

    def image(self, node, part="media", title="", aspect="landscape", gallery=False):
        images = self.image_nodes(node)
        if not images:
            return ""
        img = images[0]
        attrs = {"src": img.attrs["src"], "alt": title or img.attrs.get("alt", ""),
                 "loading": "eager" if part == "hero-image" else "lazy", "decoding": "async"}
        if part == "hero-image":
            attrs["fetchpriority"] = "high"
        # Source has one true photograph per gallery; do not fabricate slides.
        if gallery:
            attrs["data_gallery_image"] = ""
        picture = "<img" + "".join(" " + k.replace("_", "-") + '="' + esc(v) + '"' for k, v in attrs.items()) + ">"
        return element("figure", picture, data_part=part, data_aspect=aspect)

    def section(self, node, role, body, **attrs):
        values = source_attrs(node)
        values.update({"data_role": role})
        values.update(attrs)
        return element("section", body, **values)

    def hero(self, node, photo=False):
        headings = "h1" if not self.h1_done else "h2"
        self.h1_done = True
        atoms = self.atoms(node, headings)
        # Text-only labels in the source can be before their display heading.
        body = element("div", "\n".join(atoms), data_part="hero-copy" if photo else "copy")
        if photo:
            body = self.image(node, "hero-image", self.page["name"]) + body
        return self.section(node, "photo-hero" if photo else "text-hero", body)

    def cards(self, node):
        card_names = {"Cards", "Room Card", "50 card"}
        cards = []

        def gather(n):
            if n.name in card_names:
                cards.append(n)
            else:
                for child in n.elements():
                    gather(child)
        gather(node)
        if not cards:
            return self.section(node, "copy", self.copy(node))
        articles = []
        for card in cards:
            title = next((n.text() for n in card.walk() if "Telugu" in n.classes), "")
            body = self.image(card, title=title)
            contents = self.copy(card, "h3", "card")
            # The supplied experience tiles have no separate CTA text. Their
            # actual title is the link; room tiles keep their explicit link.
            route = self.routes.get(title.lower().rstrip(". "))
            if route and not any(n.name == "CTA" or n.name.startswith("Link arrow button") for n in card.walk()):
                contents = re.sub(r"(<h3\b[^>]*>)(.*?)(</h3>)", lambda m: m[1] + '<a href="__EDITION_ROOT__/' + route + '/">' + m[2] + '</a>' + m[3], contents, count=1)
            body += contents
            articles.append(element("article", body, data_part="card", **source_attrs(card)))
        tone = "beige" if "f5ebe7" in node.classes or "brown" in node.classes else "white"
        return self.section(node, "cards", element("div", "\n".join(articles), data_part="card-grid"), data_columns=str(min(3, len(cards))), data_tone=tone)

    def split(self, node):
        children = node.elements()
        # A single source wrapper is structural, not a separate content column.
        if len(children) == 1 and not self.image_nodes(node):
            children = children[0].elements()
        parts = []
        for child in children:
            if child.name == "Menu":
                continue
            has_photo = bool(self.image_nodes(child))
            has_copy = bool(self.atoms(child))
            if has_photo and not has_copy:
                parts.append(self.image(child, title=self.page["name"], aspect="portrait"))
            elif has_copy:
                attrs = {"data_part": "rate" if "f5ebe7" in child.classes else "copy"}
                parts.append(element("div", "\n".join(self.atoms(child)), **attrs))
        if not parts:
            parts = [self.copy(node)]
        layout = "image-first" if parts and 'data-part="media"' in parts[0] else "copy-first"
        return self.section(node, "split", "\n".join(parts), data_layout=layout, data_variant="description" if "Description" in node.name else "editorial")

    def overlay(self, node, gallery=False):
        self.gallery_index += int(gallery)
        attrs = {"data_gallery": str(self.gallery_index), "aria_label": self.page["name"] + " gallery"} if gallery else {}
        body = self.image(node, title=self.page["name"], gallery=gallery)
        atoms = self.atoms(node, "h2", "dome" if self.index == 1 and "Dome" in node.text() else "")
        if atoms:
            body += element("div", "\n".join(atoms), data_part="copy")
        if gallery:
            body += element("button", "View gallery", type="button", data_gallery_open="", data_part="gallery-open", aria_label="Open " + self.page["name"] + " gallery")
        return self.section(node, "gallery" if gallery and not atoms else "overlay", body, **attrs)

    def facts(self, node):
        if node.name == "Amenities":
            pairs = []
            groups = [n for n in node.walk() if len(n.elements()) >= 2 and all(c.tag == "p" for c in n.elements())]
            for labels, values in zip(groups[::2], groups[1::2]):
                for label, value in zip(labels.elements(), values.elements()):
                    pairs.append(element("div", element("dt", esc(self.corrected(label.text())), data_part="eyebrow") + element("dd", esc(self.corrected(value.text()))), data_part="fact"))
            return self.section(node, "amenities", element("dl", "".join(pairs), data_part="facts"))
        items = [n for n in node.walk() if n.name == "Quote Content"]
        if not items:
            items = node.elements()
        facts = []
        for i, item in enumerate(items):
            content = "\n".join(self.atoms(item, "h3"))
            if self.index == 11 and node.name.lower() == "3 col info":
                replacement = {1: "Dinner is included.", 2: "A private session in the Dome, just the two of you."}.get(i)
                if replacement:
                    content = content.replace("You arrive as the light goes.", replacement)
            facts.append(element("div", content, data_part="fact"))
        return self.section(node, "facts", element("div", "".join(facts), data_part="facts"))

    def comparison(self, node):
        # Rows are represented in Figma as flex groups with the same number of
        # paragraph cells. Preserve those groups and expose an actual table.
        rows = []
        for n in node.walk():
            children = n.elements()
            if len(children) >= 3 and all(c.tag == "p" for c in children):
                rows.append([self.corrected(c.text()) for c in children])
        title = ""
        if rows:
            header = element("thead", element("tr", "".join(element("th", esc(t), scope="col") for t in rows[0])))
            body = element("tbody", "".join(element("tr", "".join(element("td", esc(t), data_label=rows[0][i] if i < len(rows[0]) else "") for i, t in enumerate(row))) for row in rows[1:]))
            contents = title + element("div", element("table", header + body), data_part="table-scroll", tabindex="0", role="region", aria_label="Room comparison")
        else:
            contents = self.copy(node)
        return self.section(node, "comparison", contents)

    def events(self, node):
        # Event data remains editorial placeholders. No working checkout is
        # claimed; each Book control is explicitly pending.
        content = []
        children = node.elements()
        if len(children) > 1 and children[0].tag == "p":
            content.extend(self.atoms(children[0]))
            children = children[1].elements()
        for child in children:
            if any("Telugu" in n.classes for n in child.walk()) and not any(n.name == "CTA" for n in child.walk()):
                content.append(self.copy(child))
            else:
                content.append(element("article", "\n".join(self.atoms(child, "h3")), data_part="event"))
        return self.section(node, "events", "\n".join(content))

    def map(self, node):
        # Use the supplied aerial photograph and labels, not a geocoded location
        # or an invented interactive map.
        labels = [n.text() for n in node.walk() if n.tag == "p" and n.text()]
        body = self.image(node, title="The Vessyl property aerial map")
        body += element("ul", "".join(element("li", esc(x)) for x in labels), data_part="map-key")
        return self.section(node, "map", body)

    def generic(self, node):
        role = "quote" if node.name == "Quote" else "callout" if node.name == "Callout" else "copy"
        if "Seen" in node.name or node.name.startswith("Symbol"):
            role = "logos" if "Seen" in node.name else "introduction"
        if role == "logos":
            imgs = self.image_nodes(node, False)
            body = element("div", "".join('<img src="' + esc(n.attrs["src"]) + '" alt="Press publication logo" loading="lazy">' for n in imgs), data_part="artwork")
            return self.section(node, role, body)
        if role == "callout":
            body = self.image(node, title=self.page["name"], aspect="portrait") + self.copy(node)
            return self.section(node, role, element("div", body, data_part="callout-panel"))
        body = self.copy(node)
        if self.image_nodes(node):
            body += self.image(node, title=self.page["name"])
        # Preserve purposeful symbol/press artwork omitted by photograph-only
        # image collection, without retaining invisible mask scaffolding.
        if role in {"logos", "introduction", "callout", "quote"}:
            svgs = self.image_nodes(node, False)
            svgs = [x for x in svgs if re.search(r"\.svg(?:[?#]|$)", x.attrs["src"], re.I)]
            if svgs:
                art = "".join('<img src="' + esc(n.attrs["src"]) + '" alt="" loading="lazy">' for n in svgs)
                body = element("div", art, data_part="artwork", aria_hidden="true") + body
        tone = "beige" if "f5ebe7" in node.classes else "white"
        return self.section(node, role, body, data_tone=tone)

    def adapt(self, source):
        tree = Parser(source).root
        roots = [n for n in tree.elements() if n.tag not in {"link", "meta", "style"}]
        if not roots:
            raise ValueError("No rendered page root")
        root = roots[0]
        sections = next((n for n in root.walk() if n.name == "Sections"), None)
        if sections is None:
            sections = root
            while len(sections.elements()) == 1:
                sections = sections.elements()[0]
        candidates = sections.elements()
        expanded = []
        for n in candidates:
            if not n.name and any(c.name in {"Menu", "Hero text only"} for c in n.elements()):
                expanded.extend(n.elements())
            else:
                expanded.append(n)
        output = ["<!--SITE_HEADER-->"]
        for node in expanded:
            name = node.name
            if name == "Menu":
                continue
            if name in {"Footer", "Newsletter"}:
                output.append("<!--SITE_" + name.upper() + "-->")
            elif name in {"Hero", "Hero Section"}:
                output.append(self.hero(node, True))
            elif name == "Hero text only":
                output.append(self.hero(node))
            elif "Rooms cards" in name or "Card Grid" in name or name == "Price and offers":
                output.append(self.cards(node))
            elif name.lower() == "rooms comparison":
                output.append(self.comparison(node))
            elif name == "Map":
                output.append(self.map(node))
            elif name in {"Amenities", "included", "3 Col info", "3 col info"}:
                output.append(self.facts(node))
            elif name == "Table":
                output.append(self.events(node))
            elif "Slider with overlay" in name or "Galery slider" in name:
                output.append(self.overlay(node, True))
            elif "Overlay panel" in name:
                output.append(self.overlay(node))
            elif "Section -" in name or "Description and info" in name:
                output.append(self.split(node))
            else:
                output.append(self.generic(node))
        result = "\n".join(output)
        # No content source is discarded silently: every bracketed source token
        # must still occur after excluding the shell nodes owned by the parent.
        if not self.h1_done:
            raise ValueError("Source page has no recognized hero heading")
        return result + "\n"


def main():
    if len(sys.argv) != 4:
        raise SystemExit(__doc__.strip())
    source, index, destination = sys.argv[1:]
    output = Adapter(index).adapt(Path(source).read_text())
    Path(destination).parent.mkdir(parents=True, exist_ok=True)
    Path(destination).write_text(output)


if __name__ == "__main__":
    main()
