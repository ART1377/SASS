import { auth } from '@/features/auth/auth-config';
import { prisma } from '@/shared/lib/prisma';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;

    // Run all queries in parallel for performance
    const [
      totalProjects,
      activeProjects,
      totalTasks,
      tasksByStatus,
      tasksByProject,
      upcomingDeadlines,
      recentActivities,
      totalMembers,
    ] = await Promise.all([
      // Total projects user is member of
      prisma.project.count({
        where: {
          OR: [{ ownerId: userId }, { members: { some: { userId } } }],
        },
      }),

      // Active projects
      prisma.project.count({
        where: {
          OR: [{ ownerId: userId }, { members: { some: { userId } } }],
          tasks: { some: { status: { not: 'DONE' } } },
        },
      }),

      // Total tasks assigned to user
      prisma.task.count({
        where: {
          OR: [{ assigneeId: userId }, { creatorId: userId }],
        },
      }),

      // Tasks grouped by status
      prisma.task.groupBy({
        by: ['status'],
        where: {
          OR: [{ assigneeId: userId }, { creatorId: userId }],
        },
        _count: true,
      }),

      // Tasks per project (for chart)
      prisma.project.findMany({
        where: {
          OR: [{ ownerId: userId }, { members: { some: { userId } } }],
        },
        select: {
          id: true,
          name: true,
          _count: {
            select: {
              tasks: true,
            },
          },
          tasks: {
            select: { status: true },
          },
        },
        take: 5,
        orderBy: { createdAt: 'desc' },
      }),

      // Upcoming deadlines (next 7 days)
      prisma.task.findMany({
        where: {
          OR: [{ assigneeId: userId }, { creatorId: userId }],
          dueDate: {
            gte: new Date(),
            lte: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          },
          status: { not: 'DONE' },
        },
        select: {
          id: true,
          title: true,
          dueDate: true,
          priority: true,
          status: true,
          project: { select: { id: true, name: true } },
        },
        orderBy: { dueDate: 'asc' },
        take: 5,
      }),

      // Recent activities (last 10 changes)
      prisma.task.findMany({
        where: {
          OR: [
            { assigneeId: userId },
            { creatorId: userId },
            { project: { members: { some: { userId } } } },
          ],
        },
        select: {
          id: true,
          title: true,
          status: true,
          updatedAt: true,
          assignee: { select: { id: true, name: true } },
          creator: { select: { id: true, name: true } },
          project: { select: { id: true, name: true } },
        },
        orderBy: { updatedAt: 'desc' },
        take: 10,
      }),

      // Total team members
      prisma.projectMember.count({
        where: {
          project: {
            OR: [{ ownerId: userId }, { members: { some: { userId } } }],
          },
        },
      }),
    ]);

    // Transform task status counts
    const statusCounts = {
      TODO: 0,
      IN_PROGRESS: 0,
      REVIEW: 0,
      DONE: 0,
    };
    tasksByStatus.forEach((item) => {
      if (item.status in statusCounts) {
        statusCounts[item.status as keyof typeof statusCounts] = item._count;
      }
    });

    // Transform project stats for chart
    const projectStats = tasksByProject.map((project) => ({
      name: project.name,
      total: project._count.tasks,
      completed: project.tasks.filter((t) => t.status === 'DONE').length,
      inProgress: project.tasks.filter((t) => t.status !== 'DONE').length,
    }));

    // Transform recent activities
    const activities = recentActivities.map((task) => ({
      id: task.id,
      title: task.title,
      status: task.status,
      projectName: task.project.name,
      updatedAt: task.updatedAt.toISOString(),
      assignee: task.assignee?.name || 'Unassigned',
      creator: task.creator.name,
    }));

    const stats = {
      totalProjects,
      activeProjects,
      totalTasks,
      statusCounts,
      projectStats,
      upcomingDeadlines: upcomingDeadlines.map((t) => ({
        id: t.id,
        title: t.title,
        projectName: t.project.name,
        dueDate: t.dueDate?.toISOString() || null,
        priority: t.priority,
        status: t.status,
      })),
      activities,
      totalMembers,
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error('Dashboard stats error:', error);
    return NextResponse.json({ error: 'خطا در دریافت آمار داشبورد' }, { status: 500 });
  }
}
