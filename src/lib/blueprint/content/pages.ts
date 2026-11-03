// The eighteen Blueprint pages. Meaning and facts follow the approved Figma pages; layout,
// wording, photographs and film are this edition's own. Bracketed text such as [x] or [rate]
// marks a fact the owner has not supplied yet and must stay visible as a placeholder.
import type {Media, PageContent} from './types.ts';
import {experiences, otherUnits, unitFacts, units, unitsCompared} from './shared.ts';

const book = (label = 'Check availability') => ({label, to: 'booking', primary: true});

/** A page's opening picture, for the menu and the next-page block: its hero, or the pool for the home page. */
// i18n: ["A guest in the infinity pool facing Arenal Volcano"]
export const opening = (slug: string): Media => {
  const hero = content[slug].blocks.find(block => block.type === 'hero');
  return hero && hero.type === 'hero' ? hero.media : {loop: 'pool', alt: 'A guest in the infinity pool facing Arenal Volcano'};
};

export const content: Record<string, PageContent> = {
  '': {
    title: 'The Vessyl',
    description: 'A hotel on 118 acres above Arenal, Costa Rica, built around a dome made for sound.',
    // Told in places: the pool at first light, a minute of film, the Dome, the table at dusk.
    // Between them, sheets carry the words. The storyboard is docs/blueprint-home.md.
    blocks: [
      {type: 'stage', place: 'arrival'},
      {type: 'invite', tone: 'paper', title: 'Just come curious.\nThe rest is between you and The Vessyl.',
        body: 'A dome made for sound, a river and fourteen places to sleep, on 118 acres of forest above Arenal, Costa Rica.',
        actions: [book(), {label: 'Book an experience', to: 'experiences'}]},
      {type: 'places', tone: 'paper', title: 'A hotel built around a dome made for sound',
        body: 'Fourteen units sit apart from one another across 118 acres, so getting from your bed to dinner is a walk through forest rather than a hallway.',
        items: [
          {media: {photo: 'dome-mars', alt: 'Mars projected across the Dome ceiling above the guests', focus: '50% 30%'}, caption: 'The Frequency Dome', to: 'the-frequency-dome'},
          {media: {photo: 'river-horse', alt: 'A guest swimming beside a horse in the river'}, caption: 'The river, with the horses', to: 'horses-and-the-river'},
          {media: {photo: 'lr-hearth-smoke', alt: 'Guests watching smoke rise from the Harmonic Hearth'}, caption: 'The Harmonic Hearth', to: 'the-harmonic-hearth'},
          {media: {photo: 'horses-road', alt: 'Horses walking the road through the property'}, caption: 'Riding the land', to: 'horses-and-the-land'}
        ]},
      {type: 'stay', tone: 'paper', title: 'Fourteen units, no two the same',
        body: ['Six villas, one treehouse and seven glamping tents, placed so that each one faces something different. Choose by the view, by how much privacy you want, and by how far you feel like walking to dinner.'],
        actions: [{label: 'See where you will sleep', to: 'where-you-sleep'}],
        items: [
          {to: 'villas', media: {photo: 'villa-living', alt: 'Living room of a villa, timber ceiling and doors open to the garden'}, title: 'Six villas', text: 'Walls, a door that shuts, the most space and the most shelter when it rains.', action: 'See the villas'},
          {to: 'treehouse', media: {loop: 'treehouse', alt: 'The Treehouse on its stone trunk, filmed from the air', focus: '62% 50%'}, title: 'One treehouse', text: 'Built up into the canopy. It books out first, every season.', action: 'See the treehouse'},
          {to: 'glamping-tents', media: {photo: 'tent', alt: 'A glamping tent on its platform, with a path through the garden'}, title: 'Seven glamping tents', text: 'Canvas, a real bed, a private bathroom, forest on three sides.', action: 'See the glamping tents'}
        ]},
      {type: 'stage', place: 'film', caption: 'A minute on the land'},
      {type: 'doors', tone: 'paper', rail: true, title: 'You do not have to stay here to come here',
        body: ['Six things you can book online, with a date and a card, whether you are staying with us or at a hotel in town.'],
        items: experiences, actions: [{label: 'Book an experience', to: 'experiences'}]},
      {type: 'stage', place: 'sound'},
      {type: 'projection', tone: 'night', title: 'Sound you stand inside',
        states: [
          {media: {photo: 'dome-mars', alt: 'Mars projected across the Dome ceiling above the guests', focus: '50% 24%'}, text: 'The Frequency Dome sits at the high point of the property. It is the reason this place exists.'},
          {media: {photo: 'dome-waves', alt: 'Blue waves of light moving across the Dome ceiling', focus: '50% 22%'}, text: 'Sound arrives through the floor as much as through the air, so you feel the low end in your chest before you have decided what you think of it.'},
          {media: {photo: 'dome-blue', alt: 'Guests lying under blankets inside the Dome, the ceiling lit blue', focus: '50% 30%'}, text: 'Overhead, the whole ceiling is a projection. Sessions run most days, and you do not have to be staying here to sit in one.'}
        ],
        actions: [{label: 'Explore the Dome', to: 'the-frequency-dome'}, {label: 'What a session is like', to: 'frequency-experience'}]},
      {type: 'doors', tone: 'night', wide: true, items: [
        {to: 'pending:retreat', media: {photo: 'dome-circle', alt: 'A group sitting in a circle on the floor of the Dome'}, title: 'Take the whole property',
          text: 'Thirty-three guests, fourteen units, the Dome, the kitchen and 118 acres, with nobody else on the land. Most groups stay three to five days.', action: 'Plan a retreat'},
        {to: 'pending:visit', media: {photo: 'site:9772fed083830cf825f9', alt: 'Arenal Volcano above the rainforest, seen from the pool'}, title: 'Where you actually are',
          text: 'Arenal is a volcano, a lake, hot springs, waterfalls and a town called La Fortuna at the foot of all of it. Most people fly into San José and drive [hours].', action: 'Plan your visit'}
      ]},
      {type: 'stage', place: 'table'},
      {type: 'split', tone: 'night', flip: true, media: {photo: 'table-chef', alt: 'Dinner served at a table on the terrace'},
        title: 'You find out what is for dinner when you sit down',
        body: ['The kitchen cooks what came out of the garden that morning and what arrived from the valley that afternoon, so the menu is written late and it changes every night.', 'You eat at a long table with whoever else is here. If you would rather not, tell us and we will seat you on your own, and nobody will make it strange.'],
        actions: [{label: 'Reserve a table', to: 'pending:table'}]},
      {type: 'voices', tone: 'night', media: {photo: 'site:475782777018244eff8a', alt: 'Josh Stanley, the founder, in the garden'},
        founder: 'The Vessyl was designed and is run by Josh Stanley, who lives on the property.',
        quote: ['The Vessyl is a sanctuary on the edge of the Arenal volcano, where nature, sound, and sensory experience are composed with intention.', 'It is less a place you visit than a set of conditions, carefully made, for feeling like yourself again.'],
        by: 'Robert Patterson', role: 'Journalist', press: 'Written about in',
        actions: [{label: 'About Josh', to: 'pending:josh'}]}
    ]
  },

  'where-you-sleep': {
    title: 'Where you sleep',
    description: 'Six villas, one treehouse and seven glamping tents, spread across 118 acres in Arenal.',
    blocks: [
      {type: 'hero', tone: 'paper', media: {loop: 'house', alt: 'The main house, its pool and the Dome from the air, surrounded by forest', focus: '58% 50%'},
        title: 'Fourteen units, spread across 118 acres',
        lede: 'Nothing here is stacked. Your view, your walk to dinner and the sound outside your door all change depending on which one you book. Here is the honest version of each.'},
      {type: 'doors', tone: 'paper', title: 'Three ways to stay', items: unitsCompared()},
      {type: 'split', tone: 'paper', media: {photo: 'pool-towel', alt: 'A Vessyl towel on a lounger'},
        body: ['Every unit includes breakfast, wifi, bath products, and the run of the property: the pool, the river and the trails.', 'Sessions in the Dome and experiences are booked separately and can be added when you check out.']},
      {type: 'map', tone: 'paper', media: {photo: 'site:0b6f7938d784334e4a7e', alt: 'Aerial map of the property'}, title: 'Where everything is',
        body: ['The units are spread out on purpose. The map shows how far each one sits from the pool, the kitchen and the Dome.'],
        items: ['The Villas', 'The Pool', 'El Rancho', 'The Frequency Dome', 'The Harmonic Hearth', 'The Treehouse', 'Glamping Tents']},
      {type: 'split', tone: 'paper', flip: true, media: {photo: 'villa-detail', alt: 'Coffee, a copper bracelet and a banana leaf on a villa table'},
        title: 'Cannot decide?',
        body: ['Book a tent for the first night and a villa for the rest, or write to us. We know which unit is quiet in the rain and which one gets the morning light, and we will tell you straight.'],
        actions: [book()]}
    ]
  },

  villas: {
    title: 'The Villas',
    description: 'Six villas at The Vessyl, each facing something different, each far enough from the next that you will not hear anyone.',
    blocks: [
      {type: 'hero', tone: 'paper', media: {loop: 'villas', alt: 'A villa living room with a timber ceiling and doors to the garden'},
        title: 'The Villas', lede: 'Six villas, each facing something different, each far enough from the next that you will not hear anyone.'},
      {type: 'split', tone: 'paper', media: {photo: 'villa-bed', alt: 'A villa bedroom with a view into the trees'},
        title: 'The most enclosed way to stay here',
        body: ['Walls, a door you can shut, a proper bathroom, room to spread out, and an outdoor space you can sit in without being seen. [The build: materials, the timber, the glass, who made them.]', 'No two face the same direction, so tell us whether you want to wake up to the volcano or to the forest and we will put you in the right one.']},
      {type: 'facts', tone: 'paper', title: 'From [rate] a night', body: ['[x] night minimum in high season. Breakfast included, taxes shown at checkout.'], actions: [book('Book a villa')], items: unitFacts,
        media: {photo: 'villa-window', alt: 'A dresser beside a window onto the forest'}},
      {type: 'gallery', tone: 'paper', items: [
        {photo: 'villa-kitchen', alt: 'A villa kitchen in timber and white plaster'},
        {photo: 'villa-suite', alt: 'A suite seating area'},
        {photo: 'villa-bath', alt: 'A villa bathroom with a timber vanity'},
        {photo: 'villa-shower', alt: 'A stone walk-in shower'},
        {photo: 'site:14b7b4c25a37fe7fd2f3', alt: 'A villa living room with sliding barn doors'},
        {photo: 'villa-detail', alt: 'Coffee, a copper bracelet and a banana leaf on a villa table'}]},
      {type: 'split', tone: 'paper', flip: true, media: {photo: 'site:2b61d0b9909a48665218', alt: 'The villa pool under a timber pavilion'},
        title: 'Getting around',
        body: ['The villas are [x] minutes on foot from the kitchen and [x] from the Dome. The pool is [x]. The river is [x] downhill, and the walk back up is real, so take the trail slowly in the afternoon heat.', 'These suit couples who want a door that locks and a bathroom two people can use at once, two friends travelling together, families with [age range] in [the specific villa], and anyone staying four nights or more, which is the point where the extra space starts to matter.']},
      {type: 'doors', tone: 'paper', wide: true, title: 'Other ways to stay', items: otherUnits('villas')}
    ]
  },

  treehouse: {
    title: 'The Treehouse',
    description: 'One unit at The Vessyl, built into the canopy. There is not another one.',
    blocks: [
      {type: 'hero', tone: 'paper', media: {loop: 'treehouse', alt: 'The Treehouse on its stone trunk, filmed from the air', focus: '62% 50%'},
        title: 'The Treehouse', lede: 'One unit, built into the canopy. There is not another one.'},
      {type: 'split', tone: 'paper', media: {photo: 'site:21e5409013ca53f27943', alt: 'The Treehouse deck above the forest'},
        title: 'Level with the tops of the trees',
        body: ['You climb [x] steps to reach it and then you are level with the tops of the trees. [What it is built from, how it is anchored, who built it.]', 'The windows are [description], which means the forest is in the room with you: the light, the noise at four in the morning, the smell after rain. People book this one for the view and remember it for the sound.']},
      {type: 'facts', tone: 'paper', title: 'From [rate] a night', body: ['[x] night minimum in high season. Breakfast included, taxes shown at checkout.'], actions: [book('Book the Treehouse')], items: unitFacts,
        media: {photo: 'treehouse-inside', alt: 'Inside the Treehouse: the trunk, a spiral stair and warm timber walls'}},
      {type: 'notes', tone: 'paper', title: 'Two honest things before you book it', media: {photo: 'site:38bd44acd09f7a1caa67', alt: 'The Treehouse among the trees'}, items: [
        {title: 'The stairs', text: 'There are [x] steps and no other way up, so if stairs are difficult this is not the unit for you, and we will happily put you in a villa instead.'},
        {title: 'The rain', text: 'It is the loudest place on the property in heavy rain, which most guests end up describing as the best part. If you are a light sleeper, take that seriously.'},
        {title: 'The season', text: 'It is the first unit to go in every season. If your dates matter more than the unit, book early or ask us to tell you when it opens up.'}]},
      {type: 'doors', tone: 'paper', wide: true, title: 'Other ways to stay', items: otherUnits('treehouse')}
    ]
  },

  'glamping-tents': {
    title: 'Glamping Tents',
    description: 'Seven glamping tents at The Vessyl: real beds, private bathrooms and forest on three sides.',
    blocks: [
      {type: 'hero', tone: 'paper', media: {loop: 'tents', alt: 'The glamping tents among the trees, filmed from the air'},
        title: 'Glamping Tents', lede: 'Seven tents, real beds, private bathrooms, and forest on three sides.'},
      {type: 'split', tone: 'paper', media: {photo: 'site:0ef67cbaf17027aee6cb', alt: 'Inside a tent: a made bed, timber floor and canvas walls'},
        title: 'Not a tent you crawl into',
        body: ['These are canvas, on [platforms], with [bed] inside and a bathroom of your own. You stand up, you unpack, and at night the only thing between you and the valley is a wall you can hear through.', 'That is the reason to book one.']},
      {type: 'facts', tone: 'paper', title: 'From [rate] a night', body: ['[x] night minimum in high season. Breakfast included, taxes shown at checkout.'], actions: [book('Book a tent')], items: unitFacts,
        media: {photo: 'tent-2', alt: 'A tent among palms and ferns'}},
      {type: 'gallery', tone: 'paper', items: [
        {photo: 'tent', alt: 'A glamping tent on its platform, the path curving through the garden'},
        {photo: 'site:ee15d395b3c7cb628797', alt: 'A tent with its doors open to the deck'},
        {photo: 'site:1cf43cba02fcc0f90ae8', alt: 'A tent raised on stilts among the trees'}]},
      {type: 'notes', tone: 'paper', title: 'Getting around', media: {photo: 'lr-path', alt: 'The path between the tents'}, items: [
        {text: 'The tents sit [x] from the kitchen and [x] from the Dome, and [which ones] are closest to the river. [Which tents are most private, and which are the easiest walk.]'},
        {title: 'In the green season', text: 'Between May and November it rains hard most afternoons. The tents are built for it and they stay dry. They are not quiet in it. Guests who love this place love it for exactly that reason, and guests who want silence should book a villa.'}]},
      {type: 'doors', tone: 'paper', wide: true, title: 'Other ways to stay', items: otherUnits('glamping-tents')}
    ]
  },

  'rates-and-offers': {
    title: 'Rates and offers',
    description: 'What is open at The Vessyl, and what it costs. Booking directly is always the cheapest way to stay.',
    blocks: [
      {type: 'hero', tone: 'paper', media: {loop: 'rates', alt: 'A guest at the edge of the infinity pool, mountains beyond'},
        title: 'What is open, and what it costs',
        lede: 'Booking here directly is always the cheapest way to stay, and it is the only way to add an experience or a table at dinner to the same reservation.'},
      {type: 'doors', tone: 'paper', title: 'Offers', items: [
        {to: 'booking', media: {photo: 'villa-bed', alt: 'A villa bedroom'}, title: 'Stay longer', meta: 'Four nights or more, [starting rate]', text: 'The land takes a day to get used to, and most people say the third day is when they stop checking their phone.', action: 'Check availability'},
        {to: 'booking', media: {photo: 'lr-bamboo', alt: 'Bamboo in the rain'}, title: 'Green season', meta: 'May to November, [rate] a night', text: 'It rains in the afternoon and stops. The river runs full, everything is loud and growing, and there are far fewer people in the valley.', action: 'Check availability'},
        {to: 'booking', media: {photo: 'dinner-above', alt: 'Dinner for two seen from above'}, title: 'Couples', meta: 'From [rate] a night', text: 'Which includes [inclusions] and a session in the Dome for two.', action: 'Check availability'},
        {to: 'booking', media: {photo: 'dome-mats', alt: 'Mats laid out in a star inside the Dome'}, title: 'The Dome, with your room', meta: '[offer]', text: 'Add any experience to your stay at [offer] rather than the walk-up rate.', action: 'Check availability'},
        {to: 'booking', media: {photo: 'tent-2', alt: 'A glamping tent'}, title: 'Last-minute', meta: '[offer]', text: 'For the room nobody took, inside [x] days.', action: 'Check availability'}]},
      {type: 'split', tone: 'paper', flip: true, media: {photo: 'drinks', alt: 'Pineapple drinks on the table'},
        body: ['Every rate includes breakfast, wifi and the run of the property.', 'Taxes are shown before you pay. Cancellation terms are on each rate at checkout and written out in full in our policies.'],
        actions: [book()]},
      {type: 'doors', tone: 'paper', title: 'Where you sleep', items: units()}
    ]
  },

  experiences: {
    title: 'Experiences',
    description: 'Six things you can book at The Vessyl with a date and a card, whether or not you are staying.',
    blocks: [
      {type: 'hero', tone: 'paper', media: {loop: 'sessions', alt: 'A lit gong and crystal bowls on the floor of the Dome', focus: '60% 50%'},
        title: 'You do not have to stay here to come here',
        lede: 'Six things you can book with a date and a card. If you are staying in La Fortuna, or anywhere in Arenal, you are [minutes] away. Arrive, do the thing, eat if you want to, and drive back down.'},
      {type: 'doors', tone: 'paper', title: 'Six ways in', body: ['Everything below runs on a set schedule with a real number of places. When a time says it is full, it is full.'], items: experiences, actions: [book('Book an experience')]},
      {type: 'split', tone: 'paper', media: {photo: 'lr-boulders', alt: 'Boulders and a fire bowl in the garden by the Dome'},
        title: 'Staying with us?', body: ['Add any of these to your reservation at checkout for [offer].'], actions: [book()]},
      {type: 'doors', tone: 'paper', title: 'Where you sleep', items: units()}
    ]
  },

  'day-and-half-day': {
    title: 'The Day and the Half Day',
    description: 'Spend the day at The Vessyl without staying the night: the pool, the river, the trails and lunch.',
    blocks: [
      {type: 'hero', tone: 'paper', media: {loop: 'day', alt: 'The pool with its waterfall'},
        title: 'Spend the day here without staying the night',
        lede: 'You get the property: the pool, the river, the trails, a lounger nobody will move you off, lunch from the kitchen, and a session in the Dome if you add one.'},
      {type: 'facts', tone: 'paper', title: 'Half day [price]. Full day [price].',
        body: ['The half day runs [start] to [end] and includes [inclusions] and lunch. The full day runs [start] to [end] and includes everything above plus [inclusions], and you can stay for dinner if you book a table.', 'Free cancellation up to [hours] before. After that we charge in full, because the kitchen has already shopped.'],
        actions: [book('Book a day here')],
        items: [['Half day', '[Start] to [end]'], ['Full day', '[Start] to [end]'], ['Maximum', '[x] people a day'], ['Children', '[age], [price]'], ['Cancellation', 'Free up to [hours] before']],
        media: {photo: 'plate-prawns', alt: 'Prawns and a mango drink at lunch'}},
      {type: 'split', tone: 'paper', flip: true, media: {photo: 'waterfall', alt: 'A guest in the pool beneath the waterfall'},
        body: ['Bring a swimsuit, shoes you do not mind getting muddy, and something warm for the end of the afternoon.', 'Everything else is here.']},
      {type: 'doors', tone: 'paper', wide: true, title: 'Choose your day',
        body: ['It is the simplest way to see whether you want to come back and sleep here.', 'Maximum [x] people a day, because the property is small and we would rather it stayed that way.'],
        items: [
          {to: 'booking', media: {photo: 'pool-front', alt: 'A guest at the edge of the infinity pool'}, title: 'Half Day', meta: '[price]', text: 'Runs [start] to [end]. It includes [inclusions] and lunch.', action: 'Book a half day'},
          {to: 'booking', media: {photo: 'table-lunch', alt: 'Lunch on the terrace'}, title: 'Full Day', meta: '[offer]', text: 'Runs [start] to [end]. It includes everything above plus [inclusions], and you can stay for dinner if you book a table.', action: 'Book a full day'}]},
      {type: 'gallery', tone: 'paper', items: [
        {photo: 'pool-talk', alt: 'Three guests talking in the pool'},
        {photo: 'table-chef', alt: 'The chef at a table on the terrace'},
        {photo: 'drinks', alt: 'Pineapple drinks on the table'},
        {photo: 'pool-towel', alt: 'A Vessyl towel on a lounger'},
        {photo: 'dessert', alt: 'A chocolate sphere on a nest of sugar'},
        {photo: 'pool-mountains', alt: 'A guest in the infinity pool, mountains in cloud beyond'}]}
    ]
  },

  'frequency-experience': {
    title: 'The Frequency Experience',
    description: '[x] minutes on the floor of the Frequency Dome, with sound run live.',
    blocks: [
      {type: 'hero', tone: 'petrol', media: {loop: 'inside', alt: 'The Dome from inside: a forest projected overhead, musicians on the floor'},
        title: '[x] minutes in the Dome',
        lede: 'You lie down on the floor of the Dome. The lights go low.'},
      {type: 'split', tone: 'petrol', media: {photo: 'site:a809581c17907f4e45ea', alt: 'Guests lying under a painted projection'},
        body: ['For the next [x] minutes sound moves through the room and through the floor, so the low end arrives in your body before it arrives in your ears.', 'Someone is running it live, watching the room, not pressing play on a file.']},
      {type: 'facts', tone: 'petrol', title: '[Price] a person', body: ['[price] for guests staying with us.'], actions: [book('Book a session')],
        items: [['Sessions', '[days and times]'], ['Capacity', '[x] people at a time'], ['Duration', '[x] minutes door to door'], ['Afterwards', '[x] minutes of tea']],
        media: {photo: 'dome-mats', alt: 'Mats laid out in a star inside the Dome'}},
      {type: 'split', tone: 'petrol', flip: true, media: {photo: 'lr-candles', alt: 'Mats and small candles in the dark Dome'},
        title: 'Into the Dome',
        body: ['You keep your clothes on. There is water, and there are blankets, and you can leave at any point without explaining yourself. Nobody will talk to you about your chakras.', 'We are not going to tell you what this will do for you. People come out of it quiet, and most of them sit outside for a while before they say anything. What that was worth is yours to decide.']},
      {type: 'gallery', tone: 'petrol', items: [
        {photo: 'dome-waves', alt: 'Blue waves projected across the Dome ceiling'},
        {photo: 'dome-headphones', alt: 'Headphones on a cushion'},
        {photo: 'dome-mars', alt: 'Guests lying under a projection of Mars inside the Dome'},
        {photo: 'site:c57023868faffbc61972', alt: 'Mats and headphones in a star on the Dome floor'}]},
      {type: 'notes', tone: 'petrol', title: 'Before you book', media: {photo: 'tuning-fork', alt: 'A tuning fork held to a guest’s collarbone'}, items: [
        {text: 'If you are pregnant, have a pacemaker or another implanted device, or have a history of seizures, write to us first. There are a few things we will ask you to check with a doctor, and a few we will say no to, and we would rather say it now than at the door.'}],
        actions: [book('Book a session')]}
    ]
  },

  'arenal-after-dark': {
    title: 'Arenal After Dark',
    description: 'The volcano, the land and the Dome at night, with dinner at the long table.',
    blocks: [
      {type: 'hero', tone: 'night', media: {loop: 'stars', alt: 'The Dome at dusk as the Milky Way comes out'},
        title: 'The valley is better at night, and almost nobody sees it',
        lede: 'You arrive as the light goes. [Inclusion: a walk, a drink, the land at dusk.] You eat what the kitchen cooked that day, at the long table. Then the Dome, lit from inside, and [what happens there that evening].'},
      {type: 'facts', tone: 'night', title: '[Price] a person',
        body: ['Transport from La Fortuna, [price] return, if you would rather not drive the road back down in the dark. We recommend this.', 'Bring a layer. It drops [x] degrees once the sun goes.'],
        actions: [book('Book an evening')],
        items: [['When', '[Start] to [end], [days]'], ['People', '[x]'], ['Included', 'Dinner and [inclusions]'], ['Drinks', '[Included or extra]'], ['Transport', '[Price] return from La Fortuna']],
        media: {photo: 'site:217d8eafeb5342a6cc73', alt: 'The long table laid for dinner under lanterns'}},
      {type: 'split', tone: 'night', flip: true, media: {photo: 'site:46c02cfc7ce0c5cd9c65', alt: 'The Dome at night, the path to it lit by small lights'},
        title: 'Lit from inside',
        body: ['On a clear night the volcano is black against the sky and the valley below is a scatter of lights. On a cloudy night you hear more than you see, and that is its own thing.']},
      {type: 'gallery', tone: 'night', items: [
        {photo: 'lr-silhouette', alt: 'A silhouette with chimes against a projection'},
        {photo: 'lr-fire', alt: 'Fire on hot stones'},
        {photo: 'dome-gong', alt: 'A lit gong in the Dome'},
        {photo: 'lr-dome-red', alt: 'A figure in red walking past the Dome'}]}
    ]
  },

  'for-two': {
    title: 'For Two',
    description: 'A private session in the Dome and dinner, for two people and nobody else.',
    blocks: [
      {type: 'hero', tone: 'forest', media: {loop: 'evening', alt: 'Two people at a table above the forest at sunset'},
        title: 'An evening built for two people and nobody else',
        lede: 'A private session in the Dome, just the two of you and whoever is running it. Then dinner, [where and how it is set]. Then [inclusion].'},
      {type: 'split', tone: 'forest', media: {photo: 'dinner-above', alt: 'The table from above, the forest around it'},
        body: ['It is not a spa package and there are no rose petals. It is a few hours where nobody needs anything from you, in a place where the loudest thing is the forest.']},
      {type: 'steps', tone: 'forest', title: 'How the evening goes', items: [
        {title: 'Dusk', text: 'You arrive as the light goes.', media: {photo: 'lantern', alt: 'A lantern and incense on a timber shelf'}},
        {title: 'The Dome', text: 'A private session in the Dome, just the two of you.', media: {photo: 'dome-waves', alt: 'Blue waves projected across the Dome'}},
        {title: 'Dinner', text: 'Dinner is included, set [where and how it is set].', media: {photo: 'plate-fish', alt: 'Fish with herbs on a woven placemat'}}]},
      {type: 'facts', tone: 'forest', title: '[Price] for two',
        body: ['Dinner, the session and [inclusions] are included.', 'If you are proposing, tell us when you book. We will not announce anything or bring out a cake. We will just make sure the room is right and that nobody walks through.'],
        actions: [book('Book for two')], items: [['Who', 'Two people'], ['Includes', 'Private Dome session, dinner, [inclusion]']],
        media: {photo: 'dessert', alt: 'A chocolate sphere on a nest of sugar'}},
      {type: 'doors', tone: 'paper', title: 'Stay the night', items: units()}
    ]
  },

  'horses-and-the-river': {
    title: 'Horses and the River',
    description: 'A ride across the land and down to the river at first light or late afternoon.',
    blocks: [
      {type: 'hero', tone: 'paper', media: {loop: 'river', alt: 'A guest swimming with a horse in the river'},
        title: '[x] hours on the land, at the two hours that are worth getting up for',
        lede: 'You ride out from the stables across the property and down toward the river.'},
      {type: 'split', tone: 'paper', media: {photo: 'river-ride', alt: 'Riding in the river'},
        body: ['[What the route covers: the pasture, the forest edge, the water crossing, the view back up to the Dome.]', 'Enrique Molina, whose family has worked with horses in La Fortuna for generations, rides with you and will tell you what you are looking at if you ask.']},
      {type: 'facts', tone: 'paper', title: '[Price] a person',
        body: ['[price] for guests staying with us.', 'Long trousers and closed shoes. Helmets are here. If it has rained hard, [what changes about the route].'],
        actions: [book('Book a ride')],
        items: [['Riders', '[x] maximum'], ['Duration', '[x] hours'], ['First light', '[Time]'], ['Late afternoon', '[Time]'], ['Weight limit', '[x]']],
        media: {photo: 'river-jump', alt: 'A guest jumping from a horse into the river'}},
      {type: 'split', tone: 'paper', flip: true, media: {photo: 'horses-bonding', alt: 'A guest standing with a horse in the covered arena'},
        title: 'The horse responds to what you are actually doing',
        body: ['The horses are [description: breed, temperament, how they are kept]. Beginners are fine.', 'If you have never been on a horse, say so when you book and we will put you on [the horse] and keep the pace slow.']},
      {type: 'gallery', tone: 'paper', items: [
        {photo: 'site:ea5d3eb36b2031e294f0', alt: 'A guest with a white horse in the river'},
        {photo: 'site:55161e7692315fc7eac4', alt: 'Two riders crossing the river'},
        {photo: 'site:bb39a8510ce86bcd65fd', alt: 'A saddled horse resting by the trail'},
        {photo: 'river-horse', alt: 'A guest swimming beside a horse in the river'},
        {photo: 'lr-horses-hands', alt: 'A guest with her hands on a white horse'},
        {photo: 'horses-stable', alt: 'A horse looking out of its stall'}]}
    ]
  },

  'the-vessyl-presents': {
    title: 'The Vessyl Presents',
    description: 'Musicians, films, talks and nights without a name yet, in the Frequency Dome.',
    blocks: [
      {type: 'hero', tone: 'night', media: {loop: 'violin', alt: 'A violinist playing under a projection of the northern lights'},
        title: 'Whoever is playing, in the best room we have',
        lede: 'Musicians, films, talks, and nights that do not have a name yet. The Dome is a good room, so people say yes to playing in it, and the audience is [x] people sitting on the floor rather than four hundred standing in the dark.'},
      {type: 'events', tone: 'night', title: 'What is coming up', action: book('Book'), media: {photo: 'site:df44479df6d2cfd7b1f9', alt: 'A musician at the handpan, lit amber'}, items: [
        {date: '[Date]', name: '[Artist or event]', line: '[One line on who they are]', price: '[Price], free to guests'},
        {date: '[Date]', name: '[Artist or event]', line: '[One line on who they are]', price: '[Price], free to guests'},
        {date: '[Date]', name: '[Artist or event]', line: '[One line on who they are]', price: '[Price], free to guests'},
        {date: '[Date]', name: '[Artist or event]', line: '[One line on who they are]', price: '[Price], free to guests'}]},
      {type: 'film', tone: 'night', film: 'events', grow: true, title: 'Nights in the Dome', body: 'Live sets, the studio and the room they are played in.'},
      {type: 'split', tone: 'night', media: {photo: 'lr-flute', alt: 'A musician playing flute at the keyboard'},
        body: ['If you make something and you want to make it here, write to [address]. We have [what we can offer: the room, the system, somewhere to sleep], and we are interested.']},
      {type: 'gallery', tone: 'night', items: [
        {photo: 'lr-chimes', alt: 'A performer raising metal chimes'},
        {photo: 'site:2d21c7985bf17587473c', alt: 'A musician among gongs and lights'},
        {photo: 'dome-gong', alt: 'A lit gong in the Dome'},
        {photo: 'lr-silhouette', alt: 'A silhouette with chimes against a projection'}]}
    ]
  },

  'the-frequency-dome': {
    title: 'The Frequency Dome',
    description: 'The room The Vessyl was built around: spatial sound, a floor you feel it through, and a sky overhead.',
    blocks: [
      {type: 'hero', tone: 'petrol', media: {loop: 'dome', alt: 'Moving toward the Dome through the garden'},
        title: 'The Dome is the reason this place exists',
        lede: 'Josh built it first and built the hotel around it.'},
      {type: 'projection', tone: 'petrol', title: 'Geometry, not mysticism',
        states: [
          {media: {photo: 'site:0f2aa684aaf3a01050d0', alt: 'Guests lying under a marbled projection'}, text: 'It is a geodesic dome, [x] feet across, built on a platform above the river. Inside there is no furniture.'},
          {media: {photo: 'site:c57023868faffbc61972', alt: 'Mats and headphones in a star on the Dome floor'}, text: 'There is a floor you lie down on, a sound system tuned to the shape of the room, and a ceiling that opens.'},
          {media: {photo: 'dome-blue', alt: 'Guests under blankets in the blue-lit Dome'}, text: 'In a rectangular room, sound hits flat walls and bounces back at you in hard reflections. In a dome, the curve sends everything toward the center. You are lying in the place where it all arrives at once.'}
        ],
        actions: [{label: 'Book the Frequency Experience', to: 'frequency-experience'}, {label: 'See what is on', to: 'the-vessyl-presents'}]},
      {type: 'facts', tone: 'petrol', title: 'Open by reservation', body: ['You do not need a room. Sessions and performances are listed on the booking page with times and prices.'],
        actions: [book('Book a Dome session')],
        items: [['Diameter', '[x] feet across'], ['Acoustics', 'George Augspurger'], ['Sound', 'Spatial audio by Kling & Freitag and IOSONO'], ['Floor', 'Vibro-tactile, 24 transducers by Clark Synthesis'], ['Projection', 'The Elumenati'], ['Ceiling', 'It opens']],
        media: {photo: 'dome-scales', alt: 'The copper scales of the Dome, close up'}},
      {type: 'steps', tone: 'petrol', numbered: false, title: 'Three things happen in there, mostly', items: [
        {title: 'Sound sessions', text: 'You lie on the floor for [x] minutes while someone plays live instruments and runs tracks through the system. Low frequencies you feel in your chest. No talking, no instruction, nothing you have to do correctly. Most people fall asleep at some point and that is fine.', media: {photo: 'dome-mars', alt: 'Guests lying under a projection of Mars inside the Dome'}},
        {title: 'Movement and breath', text: 'Morning sessions, usually [x] minutes, [x] people maximum. Mats on the floor, facilitator in the room with you.', media: {photo: 'dome-mats', alt: 'Mats laid out in a star inside the Dome'}},
        {title: 'Performance', text: 'When a musician is on the property, the Dome is where they play. The audience sits on the floor. There is no stage.', media: {photo: 'dome-gong', alt: 'Gong and crystal bowls set for a performance'}}]},
      {type: 'gallery', tone: 'petrol', items: [
        {photo: 'dome-garden', alt: 'The Dome in its garden of boulders and agave'},
        {photo: 'lr-dome-above', alt: 'The Dome from above, in the forest'},
        {photo: 'lr-dome-red', alt: 'A figure in red walking past the Dome'},
        {photo: 'dome-sky', alt: 'The Dome against the sky'},
        {photo: 'dome-waves', alt: 'Blue waves projected across the Dome ceiling'},
        {photo: 'dome-headphones', alt: 'Headphones on a cushion'}]},
      {type: 'notes', tone: 'petrol', title: 'Things worth knowing', media: {photo: 'agave-dome', alt: 'Agave against the Dome’s copper scales'}, items: [
        {title: 'The floor', text: 'You lie on the floor. There are mats, bolsters and blankets, and if the floor does not work for your body, tell us when you book and we will set up a chair or a raised platform. Go barefoot or in socks.'},
        {title: 'The volume', text: 'It gets loud enough that you feel it. If that is not for you, say so and we will seat you further out.'},
        {title: 'Your health', text: 'If you have epilepsy, a pacemaker, an implanted medical device, or you are in the first trimester of pregnancy, talk to your doctor before you book a sound session. Low-frequency sound and strobing light are not safe for everyone. We will refund you in full if you book and then decide against it.'}],
        actions: [book('Book a Dome session')]}
    ]
  },

  'the-harmonic-hearth': {
    title: 'The Harmonic Hearth',
    description: 'The temazcal at The Vessyl: heat, cold, and low sound you feel through the bench.',
    blocks: [
      {type: 'hero', tone: 'forest', media: {loop: 'hearth', alt: 'Steam rising from hot stones inside the Hearth'},
        title: 'The heat, the cold, and the sound you feel through the bench',
        lede: 'The Hearth is a round room with heated stone in it, a sauna on one side and a cold plunge on the other.'},
      {type: 'split', tone: 'forest', media: {photo: 'hearth-grounds', alt: 'The Hearth grounds by day'},
        body: ['Transducers are built into the benches and the structure, so a low note arrives in your back before you hear it.', 'Most of a session is going between the heat and the cold, and most people are quiet in there without being told to be. It is a five-minute walk from the villas and about [x] minutes from the tents, downhill one way.']},
      {type: 'facts', tone: 'forest', title: 'Sessions run [x] minutes', body: ['Booked, not dropped in on, because the room holds [x] people. Bring swimwear. Towels are here.'], actions: [book('Book a session')],
        items: [['Length', '[x] minutes'], ['Room', '[x] people at once'], ['Bring', 'Swimwear'], ['Walk', 'Five minutes from the villas']],
        media: {photo: 'lr-hearth-door', alt: 'A figure in the Hearth doorway'}},
      {type: 'steps', tone: 'forest', title: 'Heat first, then cold, then sound', items: [
        {title: 'Heat', text: 'The stone holds it and the room sits at [x] degrees. A session runs [x] minutes and you can step outside whenever you want.', media: {photo: 'lr-hearth-fire', alt: 'Stoking the fire that heats the stones'}},
        {title: 'Cold', text: 'The plunge sits at [x] degrees. A minute in it is a long minute, and then you go back to the heat.', media: {photo: 'site:38d41a06235457c76910', alt: 'A guest in the cold plunge'}},
        {title: 'Sound', text: 'Through the benches rather than at you. The same low frequencies the Dome works with, felt instead of heard.', media: {photo: 'site:59adbe80393e61e87dcf', alt: 'Inside the Hearth: the stone pit and the round bench'}},
        {title: 'Together', text: 'When a group books it: heat and cold in a set order, [x] rounds, run by somebody on staff. It takes [x] people at once.', media: {photo: 'lr-hearth-crowd', alt: 'A group waiting outside the temazcal in the smoke'}}]},
      {type: 'nightfall', tone: 'night', media: {photo: 'lr-hearth-smoke', alt: 'Smoke over the temazcal and people gathered at dusk'},
        title: 'A minute in it is a long minute',
        body: ['The heat and the cold alternate, which is the whole point of it and is more than most people expect the first time.'],
        aside: {photo: 'lr-fire-2', alt: 'Embers under the stones'}},
      {type: 'gallery', tone: 'night', items: [
        {photo: 'lr-showers-dusk', alt: 'The outdoor showers at dusk'},
        {photo: 'lr-meditation', alt: 'A guest sitting quietly in the timber pavilion'},
        {photo: 'lr-fire', alt: 'Fire on hot stones'},
        {photo: 'lr-bamboo', alt: 'Bamboo in the rain'},
        {photo: 'lr-boulders', alt: 'Boulders and a fire bowl in the garden by the Dome'},
        {photo: 'lr-table-mist', alt: 'A table laid for breakfast, mist over the valley beyond'}]},
      {type: 'notes', tone: 'night', title: 'Before you book', media: {photo: 'lr-shower', alt: 'A guest under an outdoor shower'}, items: [
        {text: 'If you are pregnant, have a heart condition, or take medication for blood pressure, talk to your doctor before you book.'}], actions: [book('Book a session')]}
    ]
  },

  'sound-and-movement': {
    title: 'Sound and movement',
    description: 'Every session run at The Vessyl, on the schedule and one to one.',
    blocks: [
      {type: 'hero', tone: 'paper', media: {loop: 'listening', alt: 'Headphones on a cushion in the Dome'},
        title: 'Everything we run that is not a meal or a horse',
        lede: 'This is the full list of sessions on the property. Some run on a schedule, some you book for yourself, and some only happen when a particular facilitator is here.'},
      {type: 'table', tone: 'paper', title: 'What runs every week', body: ['The week’s schedule is posted at the Hearth and sent to your room the night you arrive.'],
        head: ['Session', 'When', 'Where', 'Length and price'],
        rows: [['Morning movement', '[x] to [x], daily', 'Dome floor, or the platform if the weather is good', '[x] minutes. Included for guests'], ['Evening sound', '[x], [x] nights a week', 'The Dome', '[x] minutes. Included for guests, [x] for day visitors'], ['Breathwork', '[x] mornings a week', 'The Dome', '[x] minutes. Not every day, because it is a lot to do daily']],
        media: {photo: 'site:c57023868faffbc61972', alt: 'Mats and headphones in a star on the Dome floor'}},
      {type: 'doors', tone: 'paper', title: 'Private sessions', body: ['Book these at the Hearth or email us before you arrive. One day of notice is usually enough, two in high season.'], items: [
        {to: 'pending:private', media: {photo: 'massage-canopy', alt: 'A massage on the terrace above the forest'}, title: 'Massage', text: '[x] or [x] minutes, in your unit or in the treatment space. [x].'},
        {to: 'pending:private', media: {photo: 'tingsha', alt: 'Tingsha cymbals on a Vessyl towel'}, title: 'Private sound session', text: 'In the Dome, [x] minutes, one or two people. [x].'},
        {to: 'pending:private', media: {photo: 'lr-meditation', alt: 'A guest sitting quietly in the timber pavilion'}, title: 'Private movement or breath', text: '[x] minutes. [x].'}]},
      {type: 'split', tone: 'paper', media: {photo: 'tuning-fork', alt: 'A tuning fork held to a guest’s collarbone'},
        title: 'It matters who is in the room',
        body: ['Facilitators are named on the schedule. Some live here. Some come for a season. Breathwork and meditation are led by Dylan Baird, vibrational yoga by Ashley Marie, and readings by Svetlana Parmar.', 'If you are coming for a specific person, email us first and we will tell you whether they are here that week.'],
        actions: [book('Book a session'), {label: 'The people here', to: 'pending:people'}]},
      {type: 'notes', tone: 'paper', title: 'What we do not do', media: {photo: 'massage-ritual', alt: 'A ritual table with stones, a leaf and incense'}, items: [
        {text: 'We do not diagnose anything, treat anything, or tell you that a session will fix a condition. Nobody here is a doctor. If you are being treated for something, keep doing that, and talk to the person treating you before you add anything on top of it.'}]}
    ]
  },

  'horses-and-the-land': {
    title: 'Horses and the land',
    description: '118 acres from the ridge to the river, the horses that live on them, and the trails between.',
    blocks: [
      {type: 'hero', tone: 'paper', media: {loop: 'pasture', alt: 'Two horses walking down the gravel road'},
        title: '118 acres, [x] horses, and a river at the bottom of it',
        lede: 'The property runs from the ridge down to the water. Most of it is not built on and will not be.'},
      {type: 'split', tone: 'paper', media: {photo: 'horses-stable', alt: 'A horse looking out of its stall'},
        body: ['There are [x] miles of trail through it, a swimming hole where the river slows, and [x] horses in the field behind the Hearth.']},
      {type: 'facts', tone: 'paper', title: 'Rides are [price] a person', body: ['[price] for guests staying with us. First light or late afternoon.'], actions: [book('Book a ride')],
        items: [['Acres', '118'], ['Horses', '[x], and they live here'], ['Trail', '[x] miles, marked'], ['Birds', '[x] species recorded']],
        media: {photo: 'horses-bonding-8', alt: 'A horse in the covered arena'}},
      {type: 'doors', tone: 'paper', title: 'They live here. They are not shipped in for rides and trucked out again.',
        body: ['Weight limit is [x] pounds. Closed-toe shoes, long trousers. Helmets are here and you wear one.'], items: [
        {to: 'booking', media: {photo: 'lr-horses-hands', alt: 'A guest with her hands on a white horse'}, title: 'Groundwork', text: '[x] minutes, no riding. You are in the field with a horse, learning to move it and let it move you. People who have never touched a horse do this and so do people who grew up on them.', action: 'Book groundwork'},
        {to: 'booking', media: {photo: 'site:bb39a8510ce86bcd65fd', alt: 'A saddled horse on the trail'}, title: 'Trail ride', text: '[x] hours, down toward the river and back up. Walk and trot. You need to be able to mount, sit a trot, and stay on for two hours. If you have not ridden, do the groundwork first or ask for the short ride instead.', action: 'Book a trail ride'},
        {to: 'booking', media: {photo: 'horses-arena', alt: 'A guest leading a horse in the arena'}, title: 'Short ride', text: '[x] minutes, on the flat near the Hearth. Fine for beginners and for children over [x].', action: 'Book a short ride'}]},
      {type: 'split', tone: 'paper', flip: true, media: {photo: 'site:2d6cd4f369c0c94cdc29', alt: 'A guest and a horse in the river'},
        title: 'Cold, deep enough to swim in, and nobody watching it',
        body: ['The swimming hole is a [x]-minute walk down from the Hearth. It is cold. It is deep enough to swim in through most of the year and shallow enough to stand up in.', 'There is nobody watching it, so you swim at your own risk, and after heavy rain the current gets strong enough that we close it. Ask at the Hearth before you go down.'],
        actions: [{label: 'Ask at the Hearth', to: 'pending:hearth'}]},
      {type: 'split', tone: 'paper', media: {photo: 'lr-guan', alt: 'A crested guan on a branch'},
        title: 'From a flat twenty-minute loop to a climb that takes most of the morning',
        body: ['[x] miles, marked. A map is in your unit. Phone signal cuts out in parts of the valley, so tell someone at the Hearth which way you are going.', 'Birds are the reason most people are quiet out there. [x] species have been recorded on the property. There is a list in the room and binoculars at the Hearth.'],
        actions: [book('Book a ride')]},
      {type: 'gallery', tone: 'paper', items: [
        {photo: 'lr-horse-bw', alt: 'A horse’s head in black and white'},
        {photo: 'lr-circle', alt: 'A circle of chairs in the arena, horses beside it'},
        {photo: 'horses-sign', alt: 'A sign reading No Perfect People Allowed'},
        {photo: 'lr-cows', alt: 'Cattle in the long grass'},
        {photo: 'horses-bonding', alt: 'A guest standing with a horse in the covered arena'},
        {photo: 'river-jump', alt: 'A guest jumping from a horse into the river'}]}
    ]
  },

  'the-recording-studio': {
    title: 'The recording studio',
    description: 'A working recording studio at The Vessyl, booked by the day or the week.',
    blocks: [
      {type: 'hero', tone: 'night', media: {loop: 'studio', alt: 'The mixing desk, chimes at the studio window and crystal tubes'},
        title: 'A working room, not an amenity',
        lede: 'There is a studio on the property. It is not a prop. Musicians come here to make records and some of them have.'},
      {type: 'facts', tone: 'night', title: 'By the day or the week',
        body: ['With or without an engineer, and usually alongside rooms for whoever you bring. Rates depend on how long you are here and how many people are coming.'],
        actions: [{label: 'Email about the studio', to: 'pending:studio', primary: true}],
        items: [['Console', '[To supply]'], ['Monitors', '[To supply]'], ['Mic locker', '[To supply]'], ['Instruments', '[To supply]'], ['Live room', '[x] square metres'], ['The Dome as live room', 'By arrangement'], ['Engineer', 'With or without'], ['Rooms', 'For whoever you bring']],
        media: {photo: 'site:7bdd0284db793a2b6023', alt: 'The studio control room with a rug and monitors'}},
      {type: 'split', tone: 'night', media: {photo: 'site:83827942c44678a4b546', alt: 'A musician at the desk, lit amber'},
        title: 'The Dome as a live room',
        body: ['Whether that is a good idea depends entirely on what you are recording, and the engineer will tell you honestly.', 'When a musician is on the property, the Dome is where they play, and it can be tracked in.']},
      {type: 'split', tone: 'night', flip: true, media: {photo: 'lr-chimes', alt: 'A performer raising metal chimes'},
        title: 'Tell us what you are making',
        body: ['The studio is booked by the day or the week, with or without an engineer, and usually alongside rooms for whoever you bring. Rates depend on how long you are here and how many people are coming, so email us and tell us what you are making.'],
        actions: [{label: 'Email about the studio', to: 'pending:studio'}]}
    ]
  }
};
