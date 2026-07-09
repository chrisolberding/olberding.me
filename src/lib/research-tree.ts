// Pure, framework-agnostic tree builder for the /research artifact viewer.
// Deliberately imports nothing from astro:content so it can be unit-tested directly.

export interface RawEntry {
  /** Collection entry id: path under research/ without extension, e.g. "market/01-aeo". */
  id: string;
  title?: string;
  order?: number;
}

export interface NavNode {
  title: string;
  /** Clean route slug (order prefixes stripped). "" = the /research landing page. */
  slug: string;
  order: number;
  /** True when a real page exists at this slug (vs. a synthesized folder label). */
  hasPage: boolean;
  children: NavNode[];
}

const ORDER_PREFIX = /^(\d+)[-_.]/;
const INDEX_NAMES = new Set(['index', 'readme']);

export function stripOrderPrefix(segment: string): { clean: string; order: number | null } {
  const m = segment.match(ORDER_PREFIX);
  if (!m) return { clean: segment, order: null };
  return { clean: segment.slice(m[0].length), order: Number(m[1]) };
}

export function prettify(segment: string): string {
  return segment
    .split(/[-_\s]+/)
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

export function entryToSlug(id: string): string {
  const parts = id.split('/').map((p) => stripOrderPrefix(p).clean);
  if (INDEX_NAMES.has(parts[parts.length - 1].toLowerCase())) parts.pop();
  return parts.join('/');
}

export function buildTree(entries: RawEntry[]): NavNode[] {
  const root: NavNode = { title: 'Research', slug: '', order: -Infinity, hasPage: false, children: [] };
  const folders = new Map<string, NavNode>();
  folders.set('', root);

  function ensureFolder(parts: string[]): NavNode {
    let path = '';
    let node = root;
    for (const part of parts) {
      path = path ? `${path}/${part}` : part;
      let child = folders.get(path);
      if (!child) {
        child = { title: prettify(part), slug: path, order: Infinity, hasPage: false, children: [] };
        folders.set(path, child);
        node.children.push(child);
      }
      node = child;
    }
    return node;
  }

  for (const entry of entries) {
    const rawParts = entry.id.split('/');
    const cleanParts = rawParts.map((p) => stripOrderPrefix(p).clean);
    const leafRaw = rawParts[rawParts.length - 1];
    const leafClean = cleanParts[cleanParts.length - 1];
    const prefixOrder = stripOrderPrefix(leafRaw).order;
    const order = entry.order ?? prefixOrder ?? Infinity;

    if (INDEX_NAMES.has(leafClean.toLowerCase())) {
      const folderParts = cleanParts.slice(0, -1);
      const node = ensureFolder(folderParts);
      node.hasPage = true;
      if (entry.title) node.title = entry.title;
      else if (folderParts.length) node.title = prettify(folderParts[folderParts.length - 1]);
      if (entry.order != null || prefixOrder != null) node.order = order;
    } else {
      const parent = ensureFolder(cleanParts.slice(0, -1));
      parent.children.push({
        title: entry.title ?? prettify(leafClean),
        slug: cleanParts.join('/'),
        order,
        hasPage: true,
        children: [],
      });
    }
  }

  sortNodes(root.children);
  return root.children;
}

function sortNodes(nodes: NavNode[]): void {
  nodes.sort((a, b) => a.order - b.order || a.title.localeCompare(b.title));
  for (const n of nodes) sortNodes(n.children);
}

/** Depth-first list of navigable pages, for prev/next if needed later. */
export function flatten(nodes: NavNode[]): NavNode[] {
  const out: NavNode[] = [];
  for (const n of nodes) {
    if (n.hasPage) out.push(n);
    out.push(...flatten(n.children));
  }
  return out;
}
