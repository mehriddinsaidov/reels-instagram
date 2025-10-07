import type { Reel } from '../types/reels';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:5175';

export type FetchReelsParams = {
  page: number;
  limit: number;
};

export async function fetchReels({ page, limit }: FetchReelsParams): Promise<{ items: Reel[]; total: number; }> {
  const url = new URL('/reels', API_BASE_URL);
  url.searchParams.set('_page', String(page));
  url.searchParams.set('_limit', String(limit));

  const response = await fetch(url.toString());
  if (!response.ok) {
    throw new Error(`Failed to fetch reels: ${response.status}`);
  }

  const items = await response.json();
  const total = Number(response.headers.get('X-Total-Count') ?? items.length);
  return { items, total };
}

export async function likeReel(id: string, likes: number): Promise<void> {
  const url = new URL(`/reels/${id}`, API_BASE_URL);
  const response = await fetch(url.toString(), {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ likes }),
  });
  if (!response.ok) throw new Error('Failed to like reel');
}

export async function addComment(reelId: string, comment: Omit<Reel['comments'][number], 'id' | 'createdAt'>): Promise<Reel> {
  const url = new URL(`/reels/${reelId}`, API_BASE_URL);
  const current = await (await fetch(url.toString())).json();
  const next = {
    ...current,
    comments: [
      ...current.comments,
      { id: crypto.randomUUID(), createdAt: new Date().toISOString(), ...comment },
    ],
  };
  const response = await fetch(url.toString(), {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(next),
  });
  if (!response.ok) throw new Error('Failed to add comment');
  return await response.json();
}

export async function addReply(reelId: string, commentId: string, reply: Omit<Reel['comments'][number]['replies'][number], 'id' | 'createdAt'>): Promise<Reel> {
  const url = new URL(`/reels/${reelId}`, API_BASE_URL);
  const current: Reel = await (await fetch(url.toString())).json();
  const updatedComments = current.comments.map((c) => {
    if (c.id !== commentId) return c;
    const existingReplies = c.replies ?? [];
    return {
      ...c,
      replies: [
        ...existingReplies,
        { id: crypto.randomUUID(), createdAt: new Date().toISOString(), ...reply },
      ],
    };
  });
  const next = { ...current, comments: updatedComments };
  const response = await fetch(url.toString(), {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(next),
  });
  if (!response.ok) throw new Error('Failed to add reply');
  return await response.json();
}


