import type { NextRequest } from 'next/server';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  // Socket.io will handle the upgrade
  // This is just a placeholder for the HTTP method
  return new Response('Socket.io endpoint', { status: 200 });
}

// The actual socket initialization happens in the server startup
// We need to modify next.config or use a custom server
