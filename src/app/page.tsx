"use client"

import { useEffect, useState } from "react"

type Thread = {
  id: string;
  title: string;
  tags: string;
  createdAt: string;
}

export default function Home() {
  const [threads, setThreads] = useState<Thread[]>([]);

  useEffect(() => {
    fetch('api/thread')
      .then((res) => res.json())
      .then(setThreads);
  }, []);

  return (
    <main className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">掲示板一覧</h1>
      <a href="/new-thread" className="text-blue-600 underline mb-4 block">
        新しいスレッドを作成
      </a>

      <ul className="space-y-4">
        {threads.map((thread) => (
          <li
            key={thread.id}
            className="border p-4 rounded hover:bg-gray-50 transition"
          >
            <a href={`/${thread.id}`} className="text-lg font-semibold">
              {thread.title}
            </a>
            <div className="text-sm text-gray-600">
              タグ: {thread.tags} / 作成日: {new Date(thread.createdAt).toLocaleString()}
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
}


