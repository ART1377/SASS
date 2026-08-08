import { auth } from '@/features/auth/auth-config';
import { prisma } from '@/shared/lib/prisma';
import { pusherServer } from '@/shared/lib/pusher-server';
import { NextResponse } from 'next/server';

const MAX_MESSAGE_LENGTH = 1000;

const messageInclude = {
  sender: { select: { id: true, name: true, avatar: true } },
  replyTo: {
    select: {
      id: true,
      content: true,
      sender: { select: { id: true, name: true } },
    },
  },
} as const;

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ roomId: string; messageId: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { roomId, messageId } = await params;
    const { content } = await request.json();
    const trimmed = typeof content === 'string' ? content.trim() : '';

    if (!trimmed) {
      return NextResponse.json({ error: 'متن پیام نمی‌تواند خالی باشد' }, { status: 400 });
    }
    if (trimmed.length > MAX_MESSAGE_LENGTH) {
      return NextResponse.json(
        { error: `پیام نمی‌تواند بیشتر از ${MAX_MESSAGE_LENGTH} کاراکتر باشد` },
        { status: 400 }
      );
    }

    const message = await prisma.chatMessage.findUnique({ where: { id: messageId } });
    if (!message || message.roomId !== roomId) {
      return NextResponse.json({ error: 'پیام یافت نشد' }, { status: 404 });
    }
    if (message.senderId !== session.user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const updated = await prisma.chatMessage.update({
      where: { id: messageId },
      // `editedAt` requires adding a nullable DateTime column to ChatMessage
      // in the Prisma schema — see NOTES.md.
      data: { content: trimmed, editedAt: new Date() },
      include: messageInclude,
    });

    await pusherServer.trigger(`presence-room-${roomId}`, 'message:updated', updated);

    return NextResponse.json(updated);
  } catch (error) {
    console.error('Update message error:', error);
    return NextResponse.json({ error: 'خطا در ویرایش پیام' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ roomId: string; messageId: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { roomId, messageId } = await params;

    const message = await prisma.chatMessage.findUnique({ where: { id: messageId } });
    if (!message || message.roomId !== roomId) {
      return NextResponse.json({ error: 'پیام یافت نشد' }, { status: 404 });
    }
    if (message.senderId !== session.user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    await prisma.chatMessage.delete({ where: { id: messageId } });

    await pusherServer.trigger(`presence-room-${roomId}`, 'message:deleted', {
      roomId,
      messageId,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete message error:', error);
    return NextResponse.json({ error: 'خطا در حذف پیام' }, { status: 500 });
  }
}
