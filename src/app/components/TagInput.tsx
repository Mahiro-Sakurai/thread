'use client';

import { useState } from 'react';

export default function TagInput({
    tags,
    setTags,
}: {
    tags: string[];
    setTags: (tags: string[]) => void;
}) {
    const [input, setInput] = useState('');

    const addTag = () => {
        const value = input.trim();
        if (value && !tags.includes(value)) {
            setTags([...tags, value]);
            setInput('');
        }
    };

    const removeTag = (tag: string) => {
        setTags(tags.filter((t) => t !== tag));
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            addTag();
        }
    };

    return (
        <div>
            <div className="flex flex-wrap gap-2 mb-2">
                {tags.map((tag) => (
                    <span key={tag} className="bg-gray-200 px-2 py-1 rounded">
                        {tag}
                        <button type="button" onClick={() => removeTag(tag)} className="ml-1 text-red-500">×</button>
                    </span>
                ))}
            </div>
            <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="タグを入力してEnterで追加"
                className="w-full border px-3 py-2 rounded"
            />
        </div>
    );
}

