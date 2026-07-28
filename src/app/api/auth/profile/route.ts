import { auth } from '@/features/auth/auth-config';
import { prisma } from '@/shared/lib/prisma';
import { compare, hash } from 'bcryptjs';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        avatar: true,
        createdAt: true,
      },
    });

    return NextResponse.json(user);
  } catch (error) {
    console.error('Get profile error:', error);
    return NextResponse.json({ error: 'خطا در دریافت پروفایل' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { name, newEmail, password, currentPassword, newPassword } = body;

    // Get current user for password verification
    const currentUser = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { password: true, email: true },
    });

    if (!currentUser) {
      return NextResponse.json({ error: 'کاربر یافت نشد' }, { status: 404 });
    }

    // ===== CHANGE EMAIL =====
    if (newEmail) {
      if (!password) {
        return NextResponse.json(
          { error: 'رمز عبور برای تغییر ایمیل الزامی است' },
          { status: 400 }
        );
      }

      // Verify password
      const isPasswordValid = await compare(password, currentUser.password);
      if (!isPasswordValid) {
        return NextResponse.json({ error: 'رمز عبور اشتباه است' }, { status: 400 });
      }

      // Check if new email is the same as current
      if (newEmail === currentUser.email) {
        return NextResponse.json(
          { error: 'ایمیل جدید نمی‌تواند با ایمیل فعلی یکسان باشد' },
          { status: 400 }
        );
      }

      // Check if email already exists
      const emailExists = await prisma.user.findUnique({
        where: { email: newEmail },
      });

      if (emailExists) {
        return NextResponse.json(
          { error: 'این ایمیل قبلاً توسط کاربر دیگری استفاده شده است' },
          { status: 400 }
        );
      }

      // Update email
      const updatedUser = await prisma.user.update({
        where: { id: session.user.id },
        data: { email: newEmail },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          avatar: true,
          createdAt: true,
        },
      });

      return NextResponse.json({
        ...updatedUser,
        message: 'ایمیل با موفقیت تغییر کرد. لطفاً دوباره وارد شوید',
      });
    }

    // ===== CHANGE PASSWORD =====
    if (newPassword) {
      if (!currentPassword) {
        return NextResponse.json({ error: 'رمز عبور فعلی الزامی است' }, { status: 400 });
      }

      // Verify current password
      const isPasswordValid = await compare(currentPassword, currentUser.password);
      if (!isPasswordValid) {
        return NextResponse.json({ error: 'رمز عبور فعلی اشتباه است' }, { status: 400 });
      }

      // Check new password is different
      const isSamePassword = await compare(newPassword, currentUser.password);
      if (isSamePassword) {
        return NextResponse.json(
          { error: 'رمز عبور جدید نمی‌تواند با رمز عبور فعلی یکسان باشد' },
          { status: 400 }
        );
      }

      // Update password
      const hashedPassword = await hash(newPassword, 12);
      await prisma.user.update({
        where: { id: session.user.id },
        data: { password: hashedPassword },
      });

      return NextResponse.json({
        message: 'رمز عبور با موفقیت تغییر کرد',
      });
    }

    // ===== UPDATE NAME =====
    if (name) {
      const updatedUser = await prisma.user.update({
        where: { id: session.user.id },
        data: { name },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          avatar: true,
          createdAt: true,
        },
      });

      return NextResponse.json(updatedUser);
    }

    return NextResponse.json(
      { error: 'هیچ داده‌ای برای بروزرسانی ارسال نشده است' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Update profile error:', error);
    return NextResponse.json({ error: 'خطا در بروزرسانی پروفایل' }, { status: 500 });
  }
}
