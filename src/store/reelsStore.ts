import { create } from 'zustand';
import type { Reel, Comment, Reply } from '../types/reels';
import { fetchReels, likeReel, addComment as apiAddComment, addReply as apiAddReply } from '../services/api';

type ReelsState = {
  items: Reel[];
  page: number;
  limit: number;
  total: number | null;
  isLoading: boolean;
  error: string | null;
  likedIds: Set<string>;
  loadNextPage: () => Promise<void>;
  toggleLike: (id: string) => Promise<void>;
  addComment: (reelId: string, comment: Omit<Comment, 'id' | 'createdAt'>) => Promise<void>;
  addReply: (reelId: string, commentId: string, reply: Omit<Reply, 'id' | 'createdAt'>) => Promise<void>;
  reset: () => void;
};

export const useReelsStore = create<ReelsState>((set, get) => ({
  items: [],
  page: 1,
  limit: 3,
  total: null,
  isLoading: false,
  error: null,
  likedIds: new Set<string>(),

  async loadNextPage() {
    const { isLoading, total, items, page, limit } = get();
    if (isLoading) return;
    if (total !== null && items.length >= total) return;
    set({ isLoading: true, error: null });
    try {
      const { items: newItems, total: newTotal } = await fetchReels({ page, limit });
      set({
        items: [...items, ...newItems],
        page: page + 1,
        total: newTotal,
        isLoading: false,
      });
    } catch (e: any) {
      set({ isLoading: false, error: e.message ?? 'Failed to load reels' });
    }
  },

  async toggleLike(id: string) {
    const { items, likedIds } = get();
    const isLiked = likedIds.has(id);
    const delta = isLiked ? -1 : 1;
    const updated = items.map((r) => (r.id === id ? { ...r, likes: Math.max(0, r.likes + delta) } : r));
    const newLiked = new Set(likedIds);
    if (isLiked) newLiked.delete(id); else newLiked.add(id);
    set({ items: updated, likedIds: newLiked });
    try {
      const current = updated.find((r) => r.id === id)!;
      await likeReel(id, current.likes);
    } catch {
      set({ items, likedIds });
    }
  },

  async addComment(reelId, comment) {
    const { items } = get();
    try {
      const updated = await apiAddComment(reelId, comment);
      set({ items: items.map((r) => (r.id === reelId ? updated : r)) });
    } catch (e) {
      console.error(e)
    }
  },

  async addReply(reelId, commentId, reply) {
    const { items } = get();
    try {
      const updated = await apiAddReply(reelId, commentId, reply);
      set({ items: items.map((r) => (r.id === reelId ? updated : r)) });
    } catch (e) {
      console.error(e)
    }
  },

  reset() {
    set({ items: [], page: 1, total: null, isLoading: false, error: null });
  },
}));


