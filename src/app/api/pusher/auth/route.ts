import { auth } from '@/features/auth/auth-config';
import { pusherServer } from '@/shared/lib/pusher-server';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.text();
    const params = new URLSearchParams(formData);

    const socketId = params.get('socket_id');
    const channelName = params.get('channel_name');

    if (!socketId || !channelName) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }

    const presenceData = {
      user_id: session.user.id,
      user_info: {
        name: session.user.name || 'Unknown',
        avatar: session.user.image || null,
      },
    };

    const authResponse = pusherServer.authorizeChannel(socketId, channelName, presenceData);

    return NextResponse.json(authResponse);
  } catch (error) {
    console.error('Pusher auth error:', error);
    return NextResponse.json({ error: 'Auth failed' }, { status: 500 });
  }
}
