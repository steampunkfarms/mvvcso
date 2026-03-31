'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { MessageCircle, Cloud, Mountain, Search, Calendar, Megaphone, Plus, Heart, ThumbsUp, Star, HelpCircle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface Post {
  id: string;
  content: string;
  photosJson: string | null;
  channel: string;
  isPinned: boolean;
  isAnnouncement: boolean;
  createdAt: string;
  authorName: string;
  authorDisplayName: string | null;
  authorAvatar: string | null;
  authorId: string;
}

const channels = [
  { id: 'general', label: 'General', icon: MessageCircle },
  { id: 'weather', label: 'Weather & Outages', icon: Cloud },
  { id: 'trail_reports', label: 'Trail Reports', icon: Mountain },
  { id: 'lost_found', label: 'Lost & Found', icon: Search },
  { id: 'events', label: 'Events', icon: Calendar },
  { id: 'announcements', label: 'Announcements', icon: Megaphone },
];

export default function CommunityPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [channel, setChannel] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const params = new URLSearchParams();
    if (channel) params.set('channel', channel);
    fetch(`/api/community/posts?${params}`)
      .then(r => r.json())
      .then(setPosts)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [channel]);

  return (
    <div className="min-h-screen bg-stone-50">
      <div className="max-w-(--container-max) mx-auto px-(--container-padding) py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-(--text-primary)">Ranchita Commons</h1>
          <Link href="/community/new"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gold-400 text-white text-sm font-semibold hover:bg-gold-500 transition-colors">
            <Plus className="w-4 h-4" /> New Post
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Channel sidebar */}
          <div className="bg-white rounded-xl border border-stone-200 p-4 h-fit">
            <h3 className="text-sm font-semibold text-(--text-muted) uppercase tracking-wider mb-3">Channels</h3>
            <button onClick={() => setChannel(null)}
              className={`flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm transition-colors ${!channel ? 'bg-gold-400 text-white' : 'text-(--text-secondary) hover:bg-stone-100'}`}>
              <MessageCircle className="w-4 h-4" /> All Posts
            </button>
            {channels.map(ch => {
              const Icon = ch.icon;
              return (
                <button key={ch.id} onClick={() => setChannel(ch.id)}
                  className={`flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm transition-colors ${channel === ch.id ? 'bg-gold-400 text-white' : 'text-(--text-secondary) hover:bg-stone-100'}`}>
                  <Icon className="w-4 h-4" /> {ch.label}
                </button>
              );
            })}
          </div>

          {/* Feed */}
          <div className="lg:col-span-3 space-y-4">
            {loading ? (
              <p className="text-center text-(--text-muted) py-12">Loading...</p>
            ) : posts.length === 0 ? (
              <div className="bg-white rounded-xl p-12 border border-stone-200 text-center">
                <p className="text-(--text-muted)">No posts yet. Be the first to share!</p>
              </div>
            ) : (
              posts.map(post => (
                <div key={post.id} className={`bg-white rounded-xl p-5 border ${post.isAnnouncement ? 'border-gold-400 ring-1 ring-gold-200' : 'border-stone-200'}`}>
                  {post.isAnnouncement && (
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-gold-600 bg-gold-50 px-2 py-0.5 rounded mb-2">
                      <Megaphone className="w-3 h-3" /> Announcement
                    </span>
                  )}
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 rounded-full bg-terra-100 flex items-center justify-center text-xs font-bold text-stone-700">
                      {(post.authorDisplayName || post.authorName).charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <span className="text-sm font-semibold text-(--text-primary)">{post.authorDisplayName || post.authorName}</span>
                      <span className="text-xs text-(--text-muted) ml-2">
                        {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
                      </span>
                    </div>
                    <span className="text-xs text-stone-600 bg-terra-50 px-2 py-0.5 rounded ml-auto capitalize">
                      {post.channel.replace('_', ' ')}
                    </span>
                  </div>
                  <p className="text-sm text-(--text-primary) whitespace-pre-wrap mb-3">{post.content}</p>

                  {/* Reaction bar placeholder */}
                  <div className="flex items-center gap-4 pt-2 border-t border-stone-100">
                    <button className="flex items-center gap-1 text-xs text-(--text-muted) hover:text-gold-400 transition-colors">
                      <ThumbsUp className="w-3.5 h-3.5" /> Like
                    </button>
                    <button className="flex items-center gap-1 text-xs text-(--text-muted) hover:text-gold-400 transition-colors">
                      <Heart className="w-3.5 h-3.5" /> Heart
                    </button>
                    <Link href={`/community/post/${post.id}`} className="flex items-center gap-1 text-xs text-(--text-muted) hover:text-gold-400 transition-colors ml-auto">
                      <MessageCircle className="w-3.5 h-3.5" /> Comments
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
