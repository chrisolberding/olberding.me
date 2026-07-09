import { test, expect } from '@playwright/test';
import {
  buildTree,
  entryToSlug,
  stripOrderPrefix,
  prettify,
} from '../src/lib/research-tree';

test('stripOrderPrefix removes NN- / NN_ ordering prefixes', () => {
  expect(stripOrderPrefix('01-aeo')).toEqual({ clean: 'aeo', order: 1 });
  expect(stripOrderPrefix('10_notes')).toEqual({ clean: 'notes', order: 10 });
  expect(stripOrderPrefix('aeo')).toEqual({ clean: 'aeo', order: null });
});

test('prettify title-cases slug segments', () => {
  expect(prettify('aeo-measurement_standard')).toBe('Aeo Measurement Standard');
});

test('entryToSlug strips prefixes and folds index to parent', () => {
  expect(entryToSlug('market/01-aeo')).toBe('market/aeo');
  expect(entryToSlug('market/index')).toBe('market');
  expect(entryToSlug('index')).toBe('');
});

test('buildTree produces an ordered, nested tree and omits the root index', () => {
  const nodes = buildTree([
    { id: 'index', title: 'Home' },
    { id: '02-seo-audit', title: 'SEO Audit' },
    { id: '01-aeo-standard', title: 'AEO Standard' },
    { id: 'market/deep-dive', title: 'Deep Dive' },
    { id: 'market/index', title: 'Market' },
  ]);
  expect(nodes.map((n) => n.slug)).toEqual(['aeo-standard', 'seo-audit', 'market']);
  const market = nodes.find((n) => n.slug === 'market')!;
  expect(market.hasPage).toBe(true);
  expect(market.title).toBe('Market');
  expect(market.children.map((c) => c.slug)).toEqual(['market/deep-dive']);
});

test('buildTree synthesizes a non-navigable label for folders without an index', () => {
  const nodes = buildTree([{ id: 'research-notes/one', title: 'One' }]);
  expect(nodes[0].slug).toBe('research-notes');
  expect(nodes[0].hasPage).toBe(false);
  expect(nodes[0].title).toBe('Research Notes');
  expect(nodes[0].children[0].slug).toBe('research-notes/one');
});
