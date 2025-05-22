import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function POST(req: Request) {
    const { threadId, name, content, parentId, uuid } = await req.json();

    if (!threadId || !content || !uuid) {
        return NextResponse.json({ error: '必須項目が足りません' }, { status: 400 });
    }

    const message = await prisma.message.create({
        data: {
            threadId,
            name: name?.trim() || '名無しさん',
            content: content.slice(0, 100),
            parentId,
            uuid,
        },
    });

    return NextResponse.json(message, { status: 201 });
}

