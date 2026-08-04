import { auth } from '@/features/auth/auth-config';
import { prisma } from '@/shared/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get('projectId');

    const rooms = await prisma.chatRoom.findMany({
      where: {
        ...(projectId ? { projectId } : {}),
        members: {
          some: { userId: session.user.id },
        },
      },
      include: {
        project: {
          select: { id: true, name: true },
        },
        _count: {
          select: { messages: true, members: true },
        },
      },
      orderBy: { updatedAt: 'desc' },
    });

    return NextResponse.json(rooms);
  } catch (error) {
    console.error('Get chat rooms error:', error);
    return NextResponse.json({ error: 'خطا در دریافت چت روم‌ها' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { projectId, name, type } = await request.json();

    if (!projectId || typeof projectId !== 'string') {
      return NextResponse.json({ error: 'پروژه نامعتبر است' }, { status: 400 });
    }

    // Only members of the project may create a chat room for it.
    const isProjectMember = await prisma.projectMember.findFirst({
      where: { projectId, userId: session.user.id },
    });
    if (!isProjectMember) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const room = await prisma.chatRoom.create({
      data: {
        projectId,
        name,
        type: type === 'DIRECT' ? 'DIRECT' : 'GROUP',
        members: {
          create: { userId: session.user.id },
        },
      },
      include: {
        project: { select: { id: true, name: true } },
        _count: { select: { messages: true, members: true } },
      },
    });

    return NextResponse.json(room, { status: 201 });
  } catch (error) {
    console.error('Create chat room error:', error);
    return NextResponse.json({ error: 'خطا در ایجاد چت روم' }, { status: 500 });
  }
}
