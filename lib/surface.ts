/** The root is the collection; story and web URLs remain independent entrances. */
export function readSurface(search: string): 'home' | 'story' | 'web' {
  const params = new URLSearchParams(search);
  if (params.get('view') === 'web') return 'web';
  return params.get('story') ? 'story' : 'home';
}
