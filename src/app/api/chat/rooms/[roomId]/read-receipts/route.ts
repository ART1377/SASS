import { auth } from '@/features/auth/auth-config';
import { prisma } from '@/shared/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET(request: Request, { params }: { params: Promise<{ roomId: string }> }) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { roomId } = await params;

    const reads = await prisma.chatMessageRead.findMany({
      where: {
        message: { roomId },
      },
      select: {
        messageId: true,
        userId: true,
      },
    });

    // Group by messageId
    const receipts: Record<string, string[]> = {};
    for (const read of reads) {
      if (!receipts[read.messageId]) {
        receipts[read.messageId] = [];
      }
      receipts[read.messageId].push(read.userId);
    }

    return NextResponse.json(receipts);
  } catch (error) {
    console.error('Get read receipts error:', error);
    return NextResponse.json({ error: 'خطا در دریافت وضعیت خواندن' }, { status: 500 });
  }
}
