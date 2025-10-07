import { useEffect, useRef, useState } from 'react';
import type { Reel } from '../types/reels';
import { useIntersection } from '../hooks/useIntersection';
import { useReelsStore } from '../store/reelsStore';
import { HeartFilled, HeartOutline, CommentIcon, ShareIcon } from './Icons';

type Props = {
  reel: Reel;
  onOpenComments: () => void;
  onShare: () => void;
};

export function ReelItem({ reel, onOpenComments, onShare }: Props) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const { ref, isIntersecting } = useIntersection<HTMLDivElement>({ threshold: 0.75 });
  const { toggleLike, likedIds } = useReelsStore();
  const [isReady, setIsReady] = useState(false);
  const isLiked = likedIds.has(reel.id);

  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;
    if (isIntersecting && isReady) {
      void el.play().catch(() => {/* ignore autoplay issues */ });
    } else {
      el.pause();
    }
  }, [isIntersecting, isReady]);

  return (
    <section
      ref={ref}
      className="snap-start w-full py-[20px_0px] h-[700px] w-full relative flex items-center justify-center bg-black"
    >
      <video
        ref={videoRef}
        src={reel.videoUrl}
        className="h-full w-full object-cover"
        playsInline
        muted
        loop
        onCanPlay={() => setIsReady(true)}
      />

      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute left-4 bottom-24 md:bottom-10 text-left space-y-1 pointer-events-auto">
          <div className='flex items-center gap-[12px] mb-[14px]'>
            <div className='w-[30px] h-[30px] rounded-[50%] bg-gray-500'></div>
            <div className="font-semibold">{reel.username}</div>
            <button className="border-[1px] border-solid border-gray-200 rounded-[5px] p-[0px_5px] text-[14px]"> Subscribe </button>
          </div>
          <div className="text-sm text-white/90 max-w-[70%] whitespace-pre-wrap">{reel.caption}</div>
        </div>

        <div className="absolute right-3 bottom-24 md:bottom-10 flex flex-col items-center gap-5 pointer-events-auto">
          <button
            aria-label="Like"
            onClick={() => void toggleLike(reel.id)}
            className="flex flex-col items-center gap-1"
          >
            {isLiked ? (
              <HeartFilled className="h-8 w-8 text-red-500" />
            ) : (
              <HeartOutline className="h-8 w-8" />
            )}
            <span className="text-xs">{reel.likes}</span>
          </button>

          <button aria-label="Comments" onClick={onOpenComments} className="flex flex-col items-center gap-1">
            <CommentIcon className="h-8 w-8" />
            <span className="text-xs">{reel.comments.length}</span>
          </button>

          <button aria-label="Share" onClick={onShare} className="flex flex-col items-center gap-1">
            <ShareIcon className="h-8 w-8" />
            <span className="text-xs">{reel.shares}</span>
          </button>
        </div>
      </div>
    </section>
  );
}


