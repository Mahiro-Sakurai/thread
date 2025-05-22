import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET(_: Request, context: { params: { threadId: string } }) {
    const { threadId } = context.params;

    const messages = await prisma.message.findMany({
        where: { threadId },
        orderBy: { createdAt: 'asc' },
    });

    return NextResponse.json(messages);
}

