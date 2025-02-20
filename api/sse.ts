// ./api/sse.ts
export default async function handler(req: Request): Promise<Response> {
  const encoder = new TextEncoder();
  let interval: number;

  const stream = new ReadableStream({
    start(controller) {
      // Immediately send an event
      controller.enqueue(encoder.encode("data: Hello world\n\n"));

      // Set up a periodic event
      interval = setInterval(() => {
        try {
          controller.enqueue(encoder.encode("data: Hello world\n\n"));
        } catch (error) {
          // If the stream is closed, we clear the interval to free the resource
          console.error("Error enqueuing data, likely due to client disconnect:", error);
          clearInterval(interval);
        }
      }, 1000);
    },
    cancel() {
      // This callback is invoked when the client disconnects,
      // ensuring the interval is cleared.
      clearInterval(interval);
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      "Connection": "keep-alive",
    },
  });
}
