// Pieces several pages repeat: the three ways to stay and the six things anyone can book.
import type {Door} from './types.ts';

export const units = (meta = 'From [rate] a night'): Door[] => [
  {to: 'villas', media: {photo: 'villa-living', alt: 'Living room of a villa, timber ceiling and doors open to the garden'}, title: 'The Villas', meta, text: 'Sleeps [x]. Walls, a door that shuts, the most space and the most shelter when it rains.', action: 'See the villas'},
  {to: 'treehouse', media: {photo: 'treehouse', alt: 'The Treehouse on its stone trunk, level with the forest canopy', focus: '50% 40%'}, title: 'The Treehouse', meta, text: 'Sleeps [x]. One unit, built up into the canopy. It books out first, every season.', action: 'See the treehouse'},
  {to: 'glamping-tents', media: {photo: 'tent', alt: 'A glamping tent on its platform, with a path through the garden'}, title: 'Glamping Tents', meta, text: 'Sleeps [x]. Canvas, a real bed, a private bathroom, forest on three sides.', action: 'See the glamping tents'}
];

export const otherUnits = (current: string) => units('Four nights or more, [offer]').filter(item => item.to !== current);

/** The three ways to stay, each saying who it suits best (this replaced a side-by-side table). */
const bestFor = ['Best for couples, four nights or more, and rain.', 'Best for one couple who want the best view on the property.', 'Best for anyone who wants to hear the forest all night.'];
export const unitsCompared = (): Door[] => units().map((door, index) => ({...door, text: `${door.text} ${bestFor[index]}`}));

export const experiences: Door[] = [
  {to: 'frequency-experience', media: {photo: 'dome-mars', alt: 'Guests lying under a projection of Mars inside the Dome', focus: '50% 30%'}, title: 'The Frequency Experience', text: '[x] minutes in the Dome.'},
  {to: 'arenal-after-dark', media: {photo: 'site:e8e1d1c262ffea471760', alt: 'The Frequency Dome under the Milky Way'}, title: 'Arenal After Dark', text: 'The volcano, the land and the Dome at night, with dinner.'},
  {to: 'day-and-half-day', media: {photo: 'pool-mountains', alt: 'A guest in the infinity pool looking toward the mountains'}, title: 'The Day and the Half Day', text: 'The property, the pool, the river and lunch.'},
  {to: 'for-two', media: {photo: 'dinner-two', alt: 'Two people at a table above the forest as the sun goes down'}, title: 'For Two', text: 'A private session, dinner and [inclusion].'},
  {to: 'horses-and-the-river', media: {photo: 'river-horse', alt: 'A guest swimming beside a horse in the river'}, title: 'Horses and the River', text: '[x] hours on the land, at first light or late afternoon.'},
  {to: 'the-vessyl-presents', media: {photo: 'dome-gong', alt: 'A lit gong and crystal bowls on the floor of the Dome'}, title: 'The Vessyl Presents', text: 'Whoever is playing, in the Dome. [price], or free to guests.'}
];

export const unitFacts: [string, string][] = [
  ['Sleeps', '[x] adults, [x] with the extra bed'],
  ['Beds', '[Configuration]'],
  ['Bathroom', 'Private, [indoor or outdoor shower]'],
  ['Size', '[x] square metres'],
  ['View', '[Volcano, forest or river, by unit]'],
  ['Outdoor', '[Terrace, hammock, plunge pool]'],
  ['Climate', '[Fans, air conditioning, cross ventilation]'],
  ['Wifi', 'Throughout'],
  ['Breakfast', 'Included'],
  ['Children', '[Policy]'],
  ['Pets', '[Policy]'],
  ['Minimum stay', '[x] nights in high season']
];
