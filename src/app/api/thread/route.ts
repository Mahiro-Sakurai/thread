import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET() {
    const threads = await prisma.thread.findMany({
        include: {
            messages: {
                select: { createdAt: true },
                orderBy: { createdAt: 'desc' },
                take: 1,
            },
        },
    });

    const sorted = threads.sort((a, b) => {
        const dateA = a.messages[0]?.createdAt || new Date(0);
        const dateB = b.messages[0]?.createdAt || new Date(0);
        return dateB.getTime() - dateA.getTime();
    });

    const result = sorted.map(({ messages, ...thread }) => ({
        ...thread,
        latestMessageAt: messages[0]?.createdAt ?? thread.createdAt,
    }));

    return NextResponse.json(result);
}

export async function POST(req: Request) {
    const body = await req.json();
    const { title, tags } = body;

    if (!title || typeof title !== 'string') {
        return NextResponse.json({ error: 'タイトルは必須です' }, { status: 400 });
    }

    const thread = await prisma.thread.create({
        data: {
            title,
            tags: tags || '',
        },
    });

    return NextResponse.json(thread, { status: 201 });
}

