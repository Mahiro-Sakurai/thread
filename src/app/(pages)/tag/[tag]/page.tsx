'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';

type Thread = {
    id: string;
    title: string;
    tags: { name: string }[];
    createdAt: string;
    _count: { messages: number };
};

export default function TagPage() {
    const { tag } = useParams();
    const router = useRouter();
    const [threads, setThreads] = useState<Thread[]>([]);

    useEffect(() => {
        if (!tag) return;
        fetch(`/api/tag?name=${encodeURIComponent(tag as string)}`)
            .then(res => res.json())
            .then(setThreads);
    }, [tag]);

    return (
        <main className="max-w-2xl mx-auto p-4 space-y-6">
            <h1 className="text-2xl font-bold">タグ: {tag}</h1>

            <button onClick={() => router.push('/')} className="text-blue-600 underline text-sm">
                ← ホームに戻る
            </button>

            <ul className="space-y-4">
                {threads.map(thread => (
                    <li
                        key={thread.id}
                        onClick={() => router.push(`/thread/${thread.id}`)}
                        className="border p-4 rounded hover:bg-gray-50 cursor-pointer"
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

