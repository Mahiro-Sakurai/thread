'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

type Thread = {
  id: string;
  title: string;
  tags: { name: string }[];
  createdAt: string;
  _count: { messages: number };
};

export default function Home() {
  const [threads, setThreads] = useState<Thread[]>([]);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<'latest' | 'popular'>('latest');
  const router = useRouter();

  useEffect(() => {
    fetch('/api/thread')
      .then((res) => res.json())
      .then(setThreads);
  }, []);

  const tagMap = threads.reduce((acc: Record<string, number>, thread) => {
    for (const tag of thread.tags) {
      acc[tag.name] = (acc[tag.name] || 0) + 1;
    }
    return acc;
  }, {});

  const filtered = threads
    .filter((t) => t.title.includes(search))
    .sort((a, b) => {
      if (sortBy === 'latest') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      } else {
        return b._count.messages - a._count.messages;
      }
    });

  const handleThreadClick = (id: string) => {
    router.push(`/thread/${id}`);
  };

  const handleTagClick = (tag: string) => {
    router.push(`/tag/${encodeURIComponent(tag)}`);
  };

  return (
    <main className="w-1/2 sm:w-full md:max-w-2xl md:mx-auto p-4 space-y-6">
      <h1 className="text-2xl font-bold">掲示板一覧</h1>

      <a href="/newthread" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 inline-block">
        スレッドを作成
      </a>
      <div className="flex gap-2 items-center">
        <input
          type="text"
          placeholder="スレッド検索"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border px-3 py-2 rounded w-full"
        />
      </div>



      <div className="flex gap-4 text-sm">
        <button
          onClick={() => setSortBy('latest')}
          className={sortBy === 'latest' ? 'underline font-bold' : ''}
        >
          新着順
        </button>
        <button
          onClick={() => setSortBy('popular')}
          className={sortBy === 'popular' ? 'underline font-bold' : ''}
        >
          人気順
        </button>
      </div>

      <div className="text-sm text-gray-700">
        タグで絞り込む：
        <div className="flex gap-2 flex-wrap mt-2">
          {Object.entries(tagMap).map(([tag, count]) => (
            <button
              key={tag}
              onClick={() => handleTagClick(tag)}
              className="bg-gray-200 px-2 py-1 rounded hover:bg-gray-300"
            >
              {tag} ({count})
            </button>
          ))}
        </div>
      </div>

      <ul className="space-y-4">
        {filtered.map((thread) => (
          <li
            key={thread.id}
            onClick={() => handleThreadClick(thread.id)}
            className="border p-4 rounded hover:bg-gray-50 transition cursor-pointer"
          >
            <p className="text-lg font-semibold">{thread.title}</p>
            <div className="text-sm text-gray-600">
              タグ: {thread.tags.map(t => t.name).join(', ')} / 投稿数: {thread._count.messages} / 作成日: {new Date(thread.createdAt).toLocaleString()}
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
}
