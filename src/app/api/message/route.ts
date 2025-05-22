import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET: 全メッセージ取得（必要ならフィルタ）
export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const threadId = searchParams.get('threadId');

    const messages = await prisma.message.findMany({
        where: { threadId: threadId || undefined },
        orderBy: { createdAt: 'asc' },
    });

    return NextResponse.json(messages);
}

// POST: 新規メッセージ作成
export async function POST(req: Request) {
    const { threadId, name, content, uuid } = await req.json();

    if (!threadId || !content || !uuid) {
        return NextResponse.json({ error: '必須項目が足りない' }, { status: 400 });
    }

    const message = await prisma.message.create({
        data: {
            threadId,
            name: name || '名無しさん',
            content,
            uuid,
        },
    });

    return NextResponse.json(message, { status: 201 });
}

// DELETE: 投稿削除（isDeleted = trueにするだけ）
export async function DELETE(req: Request) {
    const { id, uuid } = await req.json();

    const message = await prisma.message.findUnique({ where: { id } });

    if (!message || message.uuid !== uuid) {
        return NextResponse.json({ error: '削除権限がない' }, { status: 403 });
    }

    const deleted = await prisma.message.update({
        where: { id },
        data: { isDeleted: true },
    });

    return NextResponse.json(deleted);
}
