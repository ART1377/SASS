import { auth } from '@/features/auth/auth-config';
import { prisma } from '@/shared/lib/prisma';
import type { Prisma } from '@prisma/client';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const q = searchParams.get('q');
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortOrder = (searchParams.get('sortOrder') || 'desc') as 'asc' | 'desc';

    const where: Prisma.ProjectWhereInput = {
      OR: [{ ownerId: session.user.id }, { members: { some: { userId: session.user.id } } }],
    };

    if (q && q.trim().length >= 2) {
      where.AND = [
        {
          OR: [{ name: { contains: q.trim() } }, { description: { contains: q.trim() } }],
        },
      ];
    }

    const orderBy: Prisma.ProjectOrderByWithRelationInput[] = [];
    const direction: Prisma.SortOrder = sortOrder === 'asc' ? 'asc' : 'desc';

    switch (sortBy) {
      case 'name':
        orderBy.push({ name: direction });
        break;
      case 'updatedAt':
        orderBy.push({ updatedAt: direction });
        break;
      default:
        orderBy.push({ createdAt: direction });
    }

    const projects = await prisma.project.findMany({
      where,
      include: {
        owner: { select: { id: true, name: true, avatar: true } },
        _count: { select: { tasks: true, members: true } },
      },
      orderBy,
    });

    return NextResponse.json(projects);
  } catch (error) {
    console.error('Get projects error:', error);
    return NextResponse.json({ error: 'خطا در دریافت پروژه‌ها' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { name, description } = await request.json();

    if (!name) {
      return NextResponse.json({ error: 'نام پروژه الزامی است' }, { status: 400 });
    }

    const project = await prisma.project.create({
      data: {
        name,
        description,
        ownerId: session.user.id,
        members: {
          create: {
            userId: session.user.id,
            role: 'ADMIN',
          },
        },
        // 👈 اتوماتیک Chat Room بساز
        chatRooms: {
          create: {
            name: `چت ${name}`,
            type: 'GROUP',
            members: {
              create: {
                userId: session.user.id,
              },
            },
          },
        },
      },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
        _count: {
          select: {
            tasks: true,
            members: true,
          },
        },
      },
    });

    return NextResponse.json(project, { status: 201 });
  } catch (error) {
    console.error('Create project error:', error);
    return NextResponse.json({ error: 'خطا در ایجاد پروژه' }, { status: 500 });
  }
}
