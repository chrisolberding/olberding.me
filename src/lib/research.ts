import { getCollection } from 'astro:content';
import { buildTree, entryToSlug, type NavNode } from './research-tree';

export type { NavNode };
export { entryToSlug };

export async function getResearchTree(): Promise<NavNode[]> {
  const entries = await getCollection('research');
  return buildTree(
    entries.map((e) => ({ id: e.id, title: e.data.title, order: e.data.order })),
  );
}
