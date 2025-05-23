import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
    const threads = await prisma.thread.findMany({
        include: {
            tags: true,
            _count: {
                select: { messages: true },
            },
            messages: {
                select: { createdAt: true },
                orderBy: { createdAt: 'desc' },
                take: 1,
            },
        },
    });

    const sorted = threads.sort((a, b) => {
        const dateA = a.messages?.[0]?.createdAt || new Date(0);
        const dateB = b.messages?.[0]?.createdAt || new Date(0);
        return dateB.getTime() - dateA.getTime();
    });

    const result = sorted.map(({ messages, ...thread }) => ({
        ...thread,
        latestMessageAt: messages?.[0]?.createdAt ?? thread.createdAt,
    }));

    return NextResponse.json(result);
}



export async function POST(req: Request) {
    const body = await req.json();
    const { title, tags } = body; // tags: string[]

    if (!title || typeof title !== 'string') {
        return NextResponse.json({ error: 'タイトルは必須です' }, { status: 400 });
    }

    if (!Array.isArray(tags)) {
        return NextResponse.json({ error: 'タグは配列で送ってください' }, { status: 400 });
    }

    const thread = await prisma.thread.create({
        data: {
            title,
            tags: {
                create: tags.map((tag: string) => ({ name: tag })),
            },
        },
        include: { tags: true },
    });

    return NextResponse.json(thread, { status: 201 });
}


