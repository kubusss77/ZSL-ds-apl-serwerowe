export const photos = [];

const initTags = [
  '#newmusic',
  '#music',
  '#hiphop',
  '#rap',
  '#artist',
  '#producer',
  '#rapper',
  '#musician',
  '#spotify',
  '#singer',
  '#love',
  '#soundcloud',
  '#beats',
];

export const tags = initTags.map((t, i) => ({ id: i, name: t, popularity: Math.floor(Math.random * 1000) }));
let tagIds = initTags.length;
export const newTagId = () => ++tagIds;

export const rawTags = () => tags.map((t) => t.name);
