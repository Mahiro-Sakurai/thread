import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET /api/tag?name=タグ名
export async function GET(req: NextRequest) {
    const tag = req.nextUrl.searchParams.get('name');
    if (!tag) {
        return NextResponse.json({ error: 'タグが指定されていません' }, { status: 400 });
    }

    const threads = await prisma.thread.findMany({
        where: {
            tags: {
                some: {
                    name: tag,
                },
            },
        },
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

    return NextResponse.json(threads);
}
