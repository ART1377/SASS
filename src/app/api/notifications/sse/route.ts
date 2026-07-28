import { auth } from '@/features/auth/auth-config';
import { NextRequest } from 'next/server';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return new Response('Unauthorized', { status: 401 });
  }

  const userId = session.user.id;

  // Create a ReadableStream for SSE
  const stream = new ReadableStream({
    start(controller) {
      // Send initial connection event
      const initMessage = `data: ${JSON.stringify({ type: 'connected', userId })}\n\n`;
      controller.enqueue(new TextEncoder().encode(initMessage));

      // Store this client's controller so we can push to it later
      // We use a global Map to track connected clients
      const clientId = `user_${userId}_${Date.now()}`;

      if (!globalThis.sseClients) {
        globalThis.sseClients = new Map();
      }
      globalThis.sseClients.set(clientId, { controller, userId });

      // Send heartbeat every 30 seconds to keep connection alive
      const heartbeat = setInterval(() => {
        try {
          controller.enqueue(new TextEncoder().encode(`: heartbeat\n\n`));
        } catch {
          clearInterval(heartbeat);
        }
      }, 30000);

      // Cleanup on connection close
      request.signal.addEventListener('abort', () => {
        clearInterval(heartbeat);
        globalThis.sseClients?.delete(clientId);
      });
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
      'Access-Control-Allow-Origin': '*',
    },
  });
}
