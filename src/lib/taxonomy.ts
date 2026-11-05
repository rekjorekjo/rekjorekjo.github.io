import type { CollectionEntry } from 'astro:content';
import { withBase } from './paths';
import { categoryRoute, collectCategoryPaths, collectTags, tagSlug } from './taxonomy-core';

type Post = CollectionEntry<'posts'>;
export type CategoryPath = string[];

/** Hexo-compatible ordered category paths; legacy `category` remains supported. */
export function categoryPaths(post: Post): CategoryPath[] {
  const value = post.data.categories;
  if (value?.length) {
    if (Array.isArray(value[0])) return value as string[][];
    return [value as string[]];
  }
  return [[post.data.category || '未分类']];
}

export function primaryCategory(post: Post): CategoryPath {
  return categoryPaths(post)[0];
}

export function categoryLabel(path: CategoryPath): string {
  return path.join(' / ');
}

export function categoryUrl(path: CategoryPath): string {
  return withBase(`categories/${categoryRoute(path)}/`);
}

export function tagUrl(tag: string): string {
  return withBase(`tags/${tagSlug(tag)}/`);
}

export function categoryContains(post: Post, prefix: CategoryPath): boolean {
  return categoryPaths(post).some(path =>
    path.length >= prefix.length && prefix.every((segment, i) => path[i] === segment),
  );
}

export function allCategoryPaths(posts: Post[]): CategoryPath[] {
  return collectCategoryPaths(posts.flatMap(categoryPaths));
}

export function allTags(posts: Post[]): { name: string; slug: string; count: number }[] {
  return collectTags(posts.map(post => post.data.tags));
}
