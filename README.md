# Deno SSE Hello World - Quick Start

This guide provides the command-line instructions to run the Deno Server-Sent Events (SSE) "Hello World" example.

## Prerequisites

*   **Deno:**  Installed on your system. ([deno.land](https://deno.land/))

## Running the Server

1.  **Save files:** Ensure you have saved the code as `server.ts` and `api/sse.ts` in your project directory.

2.  **Open Terminal:** Navigate to your project directory in your terminal.

3.  **Run command:** Execute this command to start the server:

    ```bash
    deno run --allow-net --allow-read server.ts
    ```

    *   `deno run`: Runs the Deno program.
    *   `--allow-net`: Allows network access (for the server).
    *   `--allow-read`: Allows reading files (for serving files).
    *   `server.ts`:  The main server file.

    The server will start and listen on `http://localhost:8000`.

## Testing with `curl`

1.  **Open a new terminal window.**

2.  **Run `curl` command:**  Execute this command to test the SSE endpoint:

    ```bash
    curl -N http://localhost:8000/api/sse
    ```

    *   `curl -N`:  Keeps the connection open for SSE.
    *   `http://localhost:8000/api/sse`: The SSE endpoint URL.

    You should see a stream of "hello world" messages in your terminal, updating every second. Press `Ctrl+C` to stop `curl`.

That's it! You've run the Deno SSE Hello World example. For more details, see the complete `README.md` for project structure, browser testing, and troubleshooting.
