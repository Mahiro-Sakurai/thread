import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET: スレッド一覧
export async function GET() {
    const threads = await prisma.thread.findMany({
        orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(threads);
}

// POST: 新しいスレッド作成
export async function POST(req: Request) {
    const { title, tags } = await req.json();

    if (!title || typeof title !== 'string') {
        return NextResponse.json({ error: 'タイトルは必須' }, { status: 400 });
    }

    const thread = await prisma.thread.create({
        data: { title, tags: tags || '' },
    });

    return NextResponse.json(thread, { status: 201 });
}
