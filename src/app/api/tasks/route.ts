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
    const status = searchParams.get('status');

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: any = {};

    if (projectId) where.projectId = projectId;
    if (status) where.status = status;

    const tasks = await prisma.task.findMany({
      where,
      include: {
        assignee: {
          select: { id: true, name: true, avatar: true },
        },
        creator: {
          select: { id: true, name: true, avatar: true },
        },
        project: {
          select: { id: true, name: true },
        },
        _count: {
          select: { comments: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(tasks);
  } catch (error) {
    console.error('Get tasks error:', error);
    return NextResponse.json({ error: 'خطا در دریافت تسک‌ها' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    console.log('Create task body:', body); // Debug log

    const { title, description, priority, projectId, assigneeId, dueDate } = body;

    if (!title || !projectId) {
      return NextResponse.json({ error: 'عنوان و پروژه الزامی هستند' }, { status: 400 });
    }

    const task = await prisma.task.create({
      data: {
        title,
        description: description || null,
        priority: priority || 'MEDIUM',
        projectId,
        assigneeId: assigneeId || null,
        creatorId: session.user.id,
        dueDate: dueDate ? new Date(dueDate) : null,
      },
      include: {
        assignee: {
          select: { id: true, name: true, avatar: true },
        },
        creator: {
          select: { id: true, name: true, avatar: true },
        },
        project: {
          select: { id: true, name: true },
        },
        _count: {
          select: { comments: true },
        },
      },
    });

    return NextResponse.json(task, { status: 201 });
  } catch (error) {
    console.error('Create task error:', error);
    return NextResponse.json({ error: 'خطا در ایجاد تسک' }, { status: 500 });
  }
}
