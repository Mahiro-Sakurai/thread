'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import TagInput from '../../components/TagInput';


export default function NewThreadPage() {
    const [title, setTitle] = useState('');
    const [tags, setTags] = useState<string[]>([]);
    const [error, setError] = useState('');
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!title.trim()) {
            setError('タイトルは必須です');
            return;
        }

        const res = await fetch('/api/thread', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title, tags }),
        });

        if (!res.ok) {
            const data = await res.json();
            setError(data.error || 'スレッド作成に失敗しました');
            return;
        }

        router.push('/');
    };

    return (
        <main className="max-w-md mx-auto p-4">
            <h1 className="text-xl font-bold mb-4">新しいスレッドを作成</h1>
            <Link href="/" className="text-blue-600 underline text-sm mb-4 inline-block">
                ← ホームに戻る
            </Link>
            {error && <p className="text-red-600 mb-2">{error}</p>}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block mb-1 text-sm">タイトル</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full border rounded px-3 py-2"
                        maxLength={50}
                        required
                    />
                </div>

                <div>
                    <label className="block mb-1 text-sm">タグ</label>
                    <TagInput tags={tags} setTags={setTags} />
                </div>

                <button
                    type="submit"
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                    作成
                </button>
            </form>
        </main>
    );
}

