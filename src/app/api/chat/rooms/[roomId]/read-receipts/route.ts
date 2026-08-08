import { auth } from '@/features/auth/auth-config';
import { prisma } from '@/shared/lib/prisma';
import { pusherServer } from '@/shared/lib/pusher-server';
import { NextResponse } from 'next/server';

export async function GET(request: Request, { params }: { params: Promise<{ roomId: string }> }) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { roomId } = await params;

    const reads = await prisma.chatMessageRead.findMany({
      where: {
        message: { roomId },
      },
      select: {
        messageId: true,
        userId: true,
      },
    });

    // Group by messageId
    const receipts: Record<string, string[]> = {};
    for (const read of reads) {
      if (!receipts[read.messageId]) {
        receipts[read.messageId] = [];
      }
      receipts[read.messageId].push(read.userId);
    }

    return NextResponse.json(receipts);
  } catch (error) {
    console.error('Get read receipts error:', error);
    return NextResponse.json({ error: 'خطا در دریافت وضعیت خواندن' }, { status: 500 });
  }
}

export async function POST(request: Request, { params }: { params: Promise<{ roomId: string }> }) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { roomId } = await params;
    const { messageIds } = await request.json();

    if (!messageIds || !Array.isArray(messageIds)) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }

    // Create read receipts
    const reads = messageIds.map((messageId: string) => ({
      messageId,
      userId: session.user.id,
    }));

    await prisma.$transaction(
      reads.map((read) =>
        prisma.chatMessageRead.upsert({
          where: {
            messageId_userId: {
              messageId: read.messageId,
              userId: read.userId,
            },
          },
          create: read,
          update: {},
        })
      )
    );

    // Broadcast read receipts via Pusher
    await pusherServer.trigger(`presence-room-${roomId}`, 'messages:read_receipt', {
      roomId,
      userId: session.user.id,
      messageIds,
      readAt: new Date().toISOString(),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Read receipts error:', error);
    return NextResponse.json({ error: 'خطا در ثبت وضعیت خواندن' }, { status: 500 });
  }
}
