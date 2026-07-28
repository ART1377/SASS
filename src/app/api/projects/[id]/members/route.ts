import { auth } from '@/features/auth/auth-config';
import { prisma } from '@/shared/lib/prisma';
import { sendSSENotification } from '@/shared/lib/sse';
import { NextResponse } from 'next/server';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    const members = await prisma.projectMember.findMany({
      where: { projectId: id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
          },
        },
      },
    });

    return NextResponse.json(members);
  } catch (error) {
    console.error('Get members error:', error);
    return NextResponse.json({ error: 'خطا در دریافت اعضا' }, { status: 500 });
  }
}

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: projectId } = await params;
    const { email } = await request.json();

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json({ error: 'کاربری با این ایمیل یافت نشد' }, { status: 404 });
    }

    // Check if already a member
    const existingMember = await prisma.projectMember.findUnique({
      where: {
        projectId_userId: {
          projectId,
          userId: user.id,
        },
      },
    });

    if (existingMember) {
      return NextResponse.json({ error: 'این کاربر قبلاً عضو پروژه است' }, { status: 400 });
    }

    // Get project name for notification
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      select: { name: true },
    });

    // Add member
    const member = await prisma.projectMember.create({
      data: {
        projectId,
        userId: user.id,
        role: 'MEMBER',
      },
      include: {
        user: {
          select: { id: true, name: true, email: true, avatar: true },
        },
      },
    });

    // Add to chat room
    const chatRoom = await prisma.chatRoom.findFirst({
      where: { projectId },
    });

    if (chatRoom) {
      await prisma.chatRoomMember.create({
        data: {
          roomId: chatRoom.id,
          userId: user.id,
        },
      });
    }

    // Save notification to database
    const notification = await prisma.notification.create({
      data: {
        userId: user.id,
        title: 'دعوت به پروژه',
        message: `شما به پروژه "${project?.name || 'جدید'}" دعوت شدید`,
        type: 'PROJECT_INVITE',
      },
    });

    // Send real-time SSE notification
    sendSSENotification({
      userId: user.id,
      type: 'PROJECT_INVITE',
      title: 'دعوت به پروژه',
      message: `شما به پروژه "${project?.name || 'جدید'}" دعوت شدید`,
      data: { projectId },
    });

    return NextResponse.json(member, { status: 201 });
  } catch (error) {
    console.error('Add member error:', error);
    return NextResponse.json({ error: 'خطا در اضافه کردن عضو' }, { status: 500 });
  }
}
