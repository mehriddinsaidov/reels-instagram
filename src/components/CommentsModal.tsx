import { useState } from 'react';
import type { Comment } from '../types/reels';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  comments: Comment[];
  onAddComment: (text: string) => void;
  onAddReply: (commentId: string, text: string) => void;
};

export function CommentsModal({ isOpen, onClose, comments, onAddComment, onAddReply }: Props) {
  const [text, setText] = useState('');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/60">
      <div className="w-full md:w-[480px] max-h-[85vh] bg-neutral-900 rounded-t-2xl md:rounded-2xl overflow-hidden flex flex-col">
        <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
          <h3 className="text-base font-semibold">Comments</h3>
          <button onClick={onClose} className="text-sm text-white/70 hover:text-white">Close</button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {comments.length === 0 && (
            <p className="text-white/60 text-sm">No comments yet. Be the first to comment.</p>
          )}
          {comments.map((c) => (
            <div key={c.id} className="space-y-2">
              <div className="flex gap-3">
                <div className="h-8 w-8 rounded-full bg-white/20 flex items-center justify-center text-xs">{c.username[0]?.toUpperCase()}</div>
                <div>
                  <div className="text-sm"><span className="font-semibold mr-2">{c.username}</span>{c.text}</div>
                  <div className="text-xs text-white/40">{new Date(c.createdAt).toLocaleString()}</div>
                  <ReplyInput onSubmit={(t) => onAddReply(c.id, t)} />
                </div>
              </div>
              {c.replies && c.replies.length > 0 && (
                <div className="ml-11 space-y-2">
                  {c.replies?.map((r) => (
                    <div key={r.id} className="flex gap-3">
                      <div className="h-7 w-7 rounded-full bg-white/20 flex items-center justify-center text-[10px]">{r.username[0]?.toUpperCase()}</div>
                      <div>
                        <div className="text-sm"><span className="font-semibold mr-2">{r.username}</span>{r.text}</div>
                        <div className="text-xs text-white/40">{new Date(r.createdAt).toLocaleString()}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        <form
          className="flex gap-2 p-3 border-t border-white/10"
          onSubmit={(e) => {
            e.preventDefault();
            const value = text.trim();
            if (!value) return;
            onAddComment(value);
            setText('');
          }}
        >
          <input
            className="flex-1 bg-neutral-800 rounded-xl px-3 py-2 text-sm outline-none placeholder:text-white/40"
            placeholder="Add a comment..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <button className="text-sm px-3 py-2 rounded-xl bg-white text-black font-medium">Post</button>
        </form>
      </div>
    </div>
  );
}

function ReplyInput({ onSubmit }: { onSubmit: (text: string) => void }) {
  const [reply, setReply] = useState('');
  return (
    <form
      className="mt-2 flex gap-2"
      onSubmit={(e) => {
        e.preventDefault();
        const value = reply.trim();
        if (!value) return;
        onSubmit(value);
        setReply('');
      }}
    >
      <input
        className="flex-1 bg-neutral-800 rounded-lg px-3 py-1.5 text-sm outline-none placeholder:text-white/40"
        placeholder="Reply..."
        value={reply}
        onChange={(e) => setReply(e.target.value)}
      />
      <button className="text-xs px-2 py-1.5 rounded-lg bg-white text-black font-medium">Reply</button>
    </form>
  );
}


