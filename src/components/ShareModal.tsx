import { useEffect, useState } from 'react';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  shareUrl: string;
};

export function ShareModal({ isOpen, onClose, shareUrl }: Props) {
  const [copied, setCopied] = useState(false);
  useEffect(() => {
    if (!isOpen) setCopied(false);
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="w-[90%] md:w-[420px] bg-neutral-900 rounded-2xl p-5">
        <h3 className="text-base font-semibold mb-3">Share Reel</h3>
        <div className="flex gap-2">
          <input className="flex-1 bg-neutral-800 rounded-lg px-3 py-2 text-sm" value={shareUrl} readOnly />
          <button
            className="px-3 py-2 rounded-lg bg-white text-black text-sm font-medium"
            onClick={async () => {
              try {
                await navigator.clipboard.writeText(shareUrl);
                setCopied(true);
              } catch {
                setCopied(false);
              }
            }}
          >
            {copied ? 'Copied' : 'Copy'}
          </button>
        </div>
        <div className="text-xs text-white/50 mt-2">This is a fake share for demo purposes.</div>
        <div className="mt-4 text-right">
          <button className="text-sm text-white/80 hover:text-white" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}


