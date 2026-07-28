import { auth } from '@/features/auth/auth-config';
import { prisma } from '@/shared/lib/prisma';
import { NextResponse } from 'next/server';

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { title, description, status, priority, assigneeId, dueDate } = body;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const data: any = {};

    if (title !== undefined) data.title = title;
    if (description !== undefined) data.description = description;
    if (status !== undefined) data.status = status;
    if (priority !== undefined) data.priority = priority;
    if (assigneeId !== undefined) data.assigneeId = assigneeId || null;
    if (dueDate !== undefined) data.dueDate = dueDate ? new Date(dueDate) : null;

    const task = await prisma.task.update({
      where: { id },
      data,
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

    return NextResponse.json(task);
  } catch (error) {
    console.error('Update task error:', error);
    return NextResponse.json({ error: 'خطا در به‌روزرسانی تسک' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    await prisma.task.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete task error:', error);
    return NextResponse.json({ error: 'خطا در حذف تسک' }, { status: 500 });
  }
}
