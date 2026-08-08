import { auth } from '@/features/auth/auth-config';
import { prisma } from '@/shared/lib/prisma';
import { pusherServer } from '@/shared/lib/pusher-server';
import { NextResponse } from 'next/server';

const MAX_MESSAGE_LENGTH = 1000;
const DEFAULT_PAGE_SIZE = 50;
const MAX_PAGE_SIZE = 100;

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

async function assertMember(roomId: string, userId: string) {
  const member = await prisma.chatRoomMember.findFirst({ where: { roomId, userId } });
  return !!member;
}

export async function GET(request: Request, { params }: { params: Promise<{ roomId: string }> }) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { roomId } = await params;

    if (!(await assertMember(roomId, session.user.id))) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const limit = Math.min(
      parseInt(searchParams.get('limit') || String(DEFAULT_PAGE_SIZE), 10) || DEFAULT_PAGE_SIZE,
      MAX_PAGE_SIZE
    );
    const before = searchParams.get('before');

    const messages = await prisma.chatMessage.findMany({
      where: {
        roomId,
        ...(before ? { createdAt: { lt: new Date(before) } } : {}),
      },
      include: messageInclude,
      orderBy: { createdAt: 'desc' },
      take: limit,
    });

    const ordered = messages.reverse();
    const nextCursor = messages.length === limit ? ordered[0].createdAt.toISOString() : null;

    return NextResponse.json({ messages: ordered, nextCursor });
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

    if (!(await assertMember(roomId, session.user.id))) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { content, replyToId, forwardedFromName, clientId } = await request.json();
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

    // Note: real-time sends go through the socket server (see
    // shared/lib/socket-server.ts), which persists messages the same way.
    // This REST endpoint remains as a fallback for clients without a live
    // socket connection.
    const message = await prisma.chatMessage.create({
      data: {
        roomId,
        senderId: session.user.id,
        content: trimmed,
        replyToId: replyToId || null,
        forwardedFromName: forwardedFromName || null, // ← ADD THIS
      },
      include: messageInclude,
    });

    await prisma.chatRoom.update({
      where: { id: roomId },
      data: { updatedAt: new Date() },
    });

    // Broadcast message to the room
    await pusherServer.trigger(`presence-room-${roomId}`, 'message:new', message);

    // Notify each member on their private channel for room list update
    const members = await prisma.chatRoomMember.findMany({
      where: { roomId },
      select: { userId: true },
    });

    for (const member of members) {
      await pusherServer.trigger(`private-user-${member.userId}`, 'room:updated', {
        roomId,
        lastMessage: message,
        isSender: member.userId === session.user.id,
      });
    }

    return NextResponse.json(message, { status: 201 });
  } catch (error) {
    console.error('Send message error:', error);
    return NextResponse.json({ error: 'خطا در ارسال پیام' }, { status: 500 });
  }
}
