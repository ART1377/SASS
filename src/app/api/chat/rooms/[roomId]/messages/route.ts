import { auth } from '@/features/auth/auth-config';
import { prisma } from '@/shared/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET(request: Request, { params }: { params: Promise<{ roomId: string }> }) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { roomId } = await params;
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '50');
    const before = searchParams.get('before');

    const messages = await prisma.chatMessage.findMany({
      where: {
        roomId,
        ...(before ? { createdAt: { lt: new Date(before) } } : {}),
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: limit,
    });

    return NextResponse.json(messages.reverse());
  } catch (error) {
    console.error('Get messages error:', error);
    return NextResponse.json({ error: 'خطا در دریافت پیام‌ها' }, { status: 500 });
  }
}

export async function POST(request: Request, { params }: { params: Promise<{ roomId: string }> }) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { roomId } = await params;
    const { content } = await request.json();

    if (!content?.trim()) {
      return NextResponse.json({ error: 'متن پیام نمی‌تواند خالی باشد' }, { status: 400 });
    }

    const message = await prisma.chatMessage.create({
      data: {
        roomId,
        senderId: session.user.id,
        content: content.trim(),
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
      },
    });

    // Update room's updatedAt
    await prisma.chatRoom.update({
      where: { id: roomId },
      data: { updatedAt: new Date() },
    });

    return NextResponse.json(message, { status: 201 });
  } catch (error) {
    console.error('Send message error:', error);
    return NextResponse.json({ error: 'خطا در ارسال پیام' }, { status: 500 });
  }
}
