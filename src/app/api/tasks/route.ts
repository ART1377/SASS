import { auth } from '@/features/auth/auth-config';
import { prisma } from '@/shared/lib/prisma';
import { sendSSENotification } from '@/shared/lib/sse';
import { NextResponse } from 'next/server';

import type { Prisma } from '@prisma/client';

export async function GET(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get('projectId');
    const status = searchParams.get('status');
    const priority = searchParams.get('priority');
    const assigneeId = searchParams.get('assigneeId');
    const search = searchParams.get('q');
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortOrder = searchParams.get('sortOrder') || 'desc';

    const where: Prisma.TaskWhereInput = {};

    if (projectId) where.projectId = projectId;
    if (status) where.status = status;
    if (priority) where.priority = priority;
    if (assigneeId) {
      where.assignees = { some: { userId: assigneeId } };
    }

    if (search) {
      where.OR = [{ title: { contains: search } }, { description: { contains: search } }];
    }

    const orderBy: Prisma.TaskOrderByWithRelationInput[] = [];
    const direction: Prisma.SortOrder = sortOrder === 'asc' ? 'asc' : 'desc';

    switch (sortBy) {
      case 'dueDate':
        orderBy.push({ dueDate: { sort: direction, nulls: 'last' } });
        break;
      case 'priority':
        orderBy.push({ priority: direction }, { createdAt: 'desc' });
        break;
      default:
        orderBy.push({ createdAt: direction });
    }

    const tasks = await prisma.task.findMany({
      where,
      include: {
        assignees: {
          include: {
            user: { select: { id: true, name: true, avatar: true } },
          },
        },
        creator: { select: { id: true, name: true, avatar: true } },
        project: { select: { id: true, name: true } },
        _count: { select: { comments: true } },
      },
      orderBy,
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
    const { title, description, priority, projectId, assigneeIds, dueDate } = body;

    if (!title || !projectId) {
      return NextResponse.json({ error: 'عنوان و پروژه الزامی هستند' }, { status: 400 });
    }

    const task = await prisma.task.create({
      data: {
        title,
        description: description || null,
        priority: priority || 'MEDIUM',
        projectId,
        creatorId: session.user.id,
        dueDate: dueDate ? new Date(dueDate) : null,
        assignees: assigneeIds?.length
          ? {
              create: assigneeIds.map((userId: string) => ({ userId })),
            }
          : undefined,
      },
      include: {
        assignees: {
          include: {
            user: { select: { id: true, name: true, avatar: true } },
          },
        },
        creator: { select: { id: true, name: true, avatar: true } },
        project: { select: { id: true, name: true } },
        _count: { select: { comments: true } },
      },
    });

    // Send notifications to all assignees (except creator)
    if (assigneeIds?.length) {
      for (const assigneeId of assigneeIds) {
        if (assigneeId !== session.user.id) {
          await prisma.notification.create({
            data: {
              userId: assigneeId,
              title: 'تسک جدید',
              message: `تسک "${task.title}" در پروژه "${task.project?.name || 'ناشناخته'}" به شما واگذار شد`,
              type: 'TASK_ASSIGNED',
            },
          });

          sendSSENotification({
            userId: assigneeId,
            type: 'TASK_ASSIGNED',
            title: 'تسک جدید',
            message: `تسک "${task.title}" در پروژه "${task.project?.name || 'ناشناخته'}" به شما واگذار شد`,
            data: { projectId, taskId: task.id },
          });
        }
      }
    }

    return NextResponse.json(task, { status: 201 });
  } catch (error) {
    console.error('Create task error:', error);
    return NextResponse.json({ error: 'خطا در ایجاد تسک' }, { status: 500 });
  }
}
