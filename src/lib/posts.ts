import { getCollection } from 'astro:content';

/** One publication policy for listings and generated article routes. */
export async function getPosts() {
  const posts = await getCollection('posts', ({ data }) => import.meta.env.DEV || !data.draft);
  return posts.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf() || a.id.localeCompare(b.id, 'en'));
}
