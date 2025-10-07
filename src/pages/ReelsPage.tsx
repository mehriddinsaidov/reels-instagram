import { useEffect, useMemo, useState } from 'react';
import { usePaginatedReels } from '../hooks/usePaginatedReels';
import { useReelsStore } from '../store/reelsStore';
import { ReelItem } from '../components/ReelItem';
import { CommentsModal } from '../components/CommentsModal';
import { ShareModal } from '../components/ShareModal';

export default function ReelsPage() {
  const { items, loadNextPage, isLoading, total } = usePaginatedReels();
  const { addComment, addReply } = useReelsStore();
  const [activeReelId, setActiveReelId] = useState<string | null>(null);
  const [isCommentsOpen, setIsCommentsOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const nearBottom = window.innerHeight + window.scrollY >= document.body.offsetHeight - 200;
      if (nearBottom && !isLoading) void loadNextPage();
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [isLoading, loadNextPage]);

  const shareUrl = useMemo(() => {
    return activeReelId ? `${location.origin}/reel/${activeReelId}` : location.origin;
  }, [activeReelId]);

  return (
    <div className="h-full w-full bg-black text-white">
      <div id='scroll' className="h-full w-full overflow-y-auto snap-y snap-mandatory scroll-smooth">
        {items.map((reel) => (
          <ReelItem
            key={reel.id}
            reel={reel}
            onOpenComments={() => {
              setActiveReelId(reel.id);
              setIsCommentsOpen(true);
            }}
            onShare={() => {
              setActiveReelId(reel.id);
              setIsShareOpen(true);
            }}
          />
        ))}

        {isLoading && (
          <div className="h-[100dvh] flex items-center justify-center text-white/60">Loading…</div>
        )}
        {total !== null && items.length >= total && (
          <div className="h-[40dvh] flex items-center justify-center text-white/40 text-sm">No more reels</div>
        )}
      </div>

      <CommentsModal
        isOpen={isCommentsOpen}
        onClose={() => setIsCommentsOpen(false)}
        comments={items.find((r) => r.id === activeReelId)?.comments ?? []}
        onAddComment={(text) => {
          if (!activeReelId) return;
          void addComment(activeReelId, { text, username: 'you', userId: 'you' });
        }}
        onAddReply={(commentId, text) => {
          if (!activeReelId) return;
          void addReply(activeReelId, commentId, { text, username: 'you', userId: 'you' });
        }}
      />

      <ShareModal isOpen={isShareOpen} onClose={() => setIsShareOpen(false)} shareUrl={shareUrl} />
    </div>
  );
}


