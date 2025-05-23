'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

type Message = {
    id: string;
    content: string;
    name: string;
    createdAt: string;
    isDeleted: boolean;
    uuid: string;
};

export default function ThreadDetailPage() {
    const { id } = useParams();
    const [messages, setMessages] = useState<Message[]>([]);
    const [content, setContent] = useState('');
    const uuid = getOrCreateUuid();

    useEffect(() => {
        const fetchMessages = async () => {
            const res = await fetch(`/api/message?threadId=${id}`);
            const data = await res.json();
            setMessages(data);
        };

        fetchMessages();
        const interval = setInterval(fetchMessages, 5000); // 5秒ごとに更新

        return () => clearInterval(interval);
    }, [id]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const anonymousName = generateAnonymousName(uuid);

        const res = await fetch('/api/message', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                threadId: id,
                content,
                name: anonymousName,
                uuid,
            }),
        });

        if (res.ok) {
            setContent('');
            const newMessage = await res.json();
            setMessages((prev) => [...prev, newMessage]);
        }
    };

    const handleDelete = async (messageId: string) => {
        await fetch('/api/message', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: messageId, uuid }),
        });

        setMessages((prev) =>
            prev.map((msg) =>
                msg.id === messageId ? { ...msg, isDeleted: true } : msg
            )
        );
    };

    return (
        <main className="max-w-2xl mx-auto p-4">
            <h1 className="text-xl font-bold mb-4">スレッド詳細</h1>

            <form onSubmit={handleSubmit} className="mb-6 space-y-2">
                <textarea
                    placeholder="内容を入力（最大100文字）"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    maxLength={100}
                    required
                    className="w-full border px-3 py-2 rounded"
                />
                <button
                    type="submit"
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                    投稿
                </button>
            </form>
            <ul className="space-y-0">
                {messages.map((msg) => (
                    <li key={msg.id} className="border border-gray-300 px-3 py-2 text-sm text-gray-800">
                        <div className="flex items-center justify-start text-xs text-gray-500 gap-3 mb-1">
                            <span>{new Date(msg.createdAt).toLocaleString()}</span>
                            {!msg.isDeleted && msg.uuid === uuid && (
                                <button
                                    onClick={() => handleDelete(msg.id)}
                                    className="text-red-500 hover:underline"
                                >
                                    削除
                                </button>
                            )}
                        </div>
                        <p className="break-words">
                            {msg.isDeleted ? 'この投稿は削除されました。' : msg.content}
                        </p>
                    </li>
                ))}
            </ul>


        </main>
    );
}

// uuidの取得 or 生成
function getOrCreateUuid(): string {
    if (typeof window === 'undefined') return '';
    let uuid = localStorage.getItem('uuid');
    if (!uuid) {
        uuid = crypto.randomUUID();
        localStorage.setItem('uuid', uuid);
    }
    return uuid;
}

// 匿名名の生成（例：匿名AB12）
function generateAnonymousName(uuid: string): string {
    return '匿名' + uuid.slice(0, 4).toUpperCase();
}
