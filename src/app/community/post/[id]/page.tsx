'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, ThumbsUp, Heart, Send } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface Post {
  id: string;
  content: string;
  channel: string;
  isAnnouncement: boolean;
  createdAt: string;
  authorName: string;
  authorDisplayName: string | null;
}

interface Comment {
  id: string;
  content: string;
  createdAt: string;
  authorName: string;
  authorDisplayName: string | null;
}

export default function PostDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [sending, setSending] = useState(false);

  useEffect(() => {
    fetch(`/api/community/posts?limit=100`).then(r => r.json()).then((posts: Post[]) => {
      const found = posts.find((p: Post) => p.id === id);
      if (found) setPost(found);
    });
    fetch(`/api/community/posts/${id}/comments`).then(r => r.json()).then(setComments).catch(() => {});
  }, [id]);

  async function handleComment(e: React.FormEvent) {
    e.preventDefault();
    if (!newComment.trim()) return;
    setSending(true);
    try {
      const res = await fetch(`/api/community/posts/${id}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: newComment }),
      });
      if (res.ok) {
        setNewComment('');
        const updated = await fetch(`/api/community/posts/${id}/comments`).then(r => r.json());
        setComments(updated);
      }
    } finally {
      setSending(false);
    }
  }

  if (!post) return <div className="min-h-screen bg-stone-50 flex items-center justify-center"><p className="text-(--text-muted)">Loading...</p></div>;

  return (
    <div className="min-h-screen bg-stone-50">
      <div className="max-w-2xl mx-auto px-(--container-padding) py-8">
        <Link href="/community" className="inline-flex items-center gap-2 text-sm text-gold-400 hover:text-gold-500 mb-6">
          <ArrowLeft className="w-4 h-4" /> Back to feed
        </Link>

        {/* Post */}
        <div className="bg-white rounded-xl p-6 border border-stone-200 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-dusk-100 flex items-center justify-center text-sm font-bold text-dusk-600">
              {(post.authorDisplayName || post.authorName).charAt(0).toUpperCase()}
            </div>
            <div>
              <span className="font-semibold text-(--text-primary)">{post.authorDisplayName || post.authorName}</span>
              <span className="text-xs text-(--text-muted) ml-2">{formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}</span>
            </div>
          </div>
          <p className="text-(--text-primary) whitespace-pre-wrap mb-4">{post.content}</p>
          <div className="flex items-center gap-4 pt-3 border-t border-stone-100">
            <button className="flex items-center gap-1 text-xs text-(--text-muted) hover:text-gold-400 transition-colors">
              <ThumbsUp className="w-3.5 h-3.5" /> Like
            </button>
            <button className="flex items-center gap-1 text-xs text-(--text-muted) hover:text-gold-400 transition-colors">
              <Heart className="w-3.5 h-3.5" /> Heart
            </button>
          </div>
        </div>

        {/* Comments */}
        <div className="space-y-3 mb-6">
          <h3 className="text-sm font-semibold text-(--text-primary)">Comments ({comments.length})</h3>
          {comments.length === 0 ? (
            <p className="text-sm text-(--text-muted)">No comments yet. Be the first!</p>
          ) : (
            comments.map(c => (
              <div key={c.id} className="bg-white rounded-lg p-4 border border-stone-200">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-semibold text-(--text-primary)">{c.authorDisplayName || c.authorName}</span>
                  <span className="text-xs text-(--text-muted)">{formatDistanceToNow(new Date(c.createdAt), { addSuffix: true })}</span>
                </div>
                <p className="text-sm text-(--text-secondary)">{c.content}</p>
              </div>
            ))
          )}
        </div>

        {/* Add comment */}
        <form onSubmit={handleComment} className="flex gap-2">
          <input value={newComment} onChange={e => setNewComment(e.target.value)} placeholder="Write a comment..."
            className="flex-1 px-4 py-2.5 rounded-lg border border-stone-200 bg-white text-(--text-primary) placeholder:text-(--text-muted) focus:outline-none focus:border-gold-400" />
          <button type="submit" disabled={sending || !newComment.trim()}
            className="px-4 py-2.5 rounded-lg bg-gold-400 text-white hover:bg-gold-500 transition-colors disabled:opacity-60">
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
