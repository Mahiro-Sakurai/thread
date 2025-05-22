import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function DELETE(req: Request, context: { params: { id: string } }) {
    const { id } = context.params;
    const { uuid } = await req.json();

    if (!uuid) {
        return NextResponse.json({ error: 'UUIDが必要です' }, { status: 400 });
    }

    const message = await prisma.message.findUnique({ where: { id } });

    if (!message) {
        return NextResponse.json({ error: 'メッセージが見つかりません' }, { status: 404 });
    }

    if (message.uuid !== uuid) {
        return NextResponse.json({ error: '削除権限がありません' }, { status: 403 });
    }

    await prisma.message.update({
        where: { id },
        data: { isDeleted: true },
    });

    return NextResponse.json({ success: true });
}

