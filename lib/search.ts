import type { Story } from './model';

export function normalizeSearch(text: string) {
  return text
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[’‘]/g, "'")
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim();
}

export function searchStories(
  stories: Story[],
  query: string,
  category = 'All',
) {
  const needle = normalizeSearch(query);
  return stories.filter(
    (s) =>
      (category === 'All' || s.category === category) &&
      normalizeSearch(
        `${s.id} ${s.title} ${s.headline} ${s.subtitle} ${s.year} ${s.coverage} ${s.searchText || ''}`,
      ).includes(needle),
  );
}
