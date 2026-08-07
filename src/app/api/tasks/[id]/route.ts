import { auth } from '@/features/auth/auth-config';
import { TASK_STATUS_LABELS } from '@/shared/lib/constants';
import { prisma } from '@/shared/lib/prisma';
import { sendSSENotification } from '@/shared/lib/sse';
import { NextResponse } from 'next/server';

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { title, description, status, priority, assigneeIds, dueDate } = body;

    // Get old task to compare changes
    const oldTask = await prisma.task.findUnique({
      where: { id },
      select: {
        title: true,
        status: true,
        assignees: { select: { userId: true } },
        project: { select: { name: true } },
      },
    });

    const data: any = {};
    if (title !== undefined) data.title = title;
    if (description !== undefined) data.description = description;
    if (status !== undefined) data.status = status;
    if (priority !== undefined) data.priority = priority;
    if (dueDate !== undefined) data.dueDate = dueDate ? new Date(dueDate) : null;

    // Handle assignees update
    if (assigneeIds !== undefined) {
      // Delete existing assignees
      await prisma.taskAssignee.deleteMany({ where: { taskId: id } });
      // Create new ones
      if (assigneeIds.length > 0) {
        await prisma.taskAssignee.createMany({
          data: assigneeIds.map((userId: string) => ({ taskId: id, userId })),
        });
      }
    }

    const task = await prisma.task.update({
      where: { id },
      data,
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

    // ─── Notification: Status changed ───
    if (status && oldTask && status !== oldTask.status) {
      const oldAssigneeIds = oldTask.assignees.map((a) => a.userId);
      const statusLabel = TASK_STATUS_LABELS[status] || status;

      for (const assigneeId of oldAssigneeIds) {
        if (assigneeId !== session.user.id) {
          await prisma.notification.create({
            data: {
              userId: assigneeId,
              title: 'بروزرسانی تسک',
              message: `وضعیت تسک "${oldTask.title}" به "${statusLabel}" تغییر کرد`,
              type: 'TASK_UPDATED',
            },
          });

          sendSSENotification({
            userId: assigneeId,
            type: 'TASK_UPDATED',
            title: 'بروزرسانی تسک',
            message: `وضعیت تسک "${oldTask.title}" به "${statusLabel}" تغییر کرد`,
            data: { taskId: id, projectId: task.projectId },
          });
        }
      }
    }

    // ─── Notification: New assignees ───
    if (assigneeIds !== undefined && oldTask) {
      const oldAssigneeIds = new Set(oldTask.assignees.map((a) => a.userId));
      const newAssignees = assigneeIds.filter((uid: string) => !oldAssigneeIds.has(uid));

      for (const assigneeId of newAssignees) {
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
            data: { projectId: task.projectId, taskId: task.id },
          });
        }
      }
    }

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
