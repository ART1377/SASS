/* eslint-disable @typescript-eslint/no-explicit-any */

interface SSEClient {
  controller: ReadableStreamDefaultController<any>;
  userId: string;
}

declare global {
  var sseClients: Map<string, SSEClient> | undefined;
}

export {};
