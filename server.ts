import { serve } from "https://deno.land/std@0.218.2/http/server.ts";
import { serveDir } from "https://deno.land/std@0.218.2/http/file_server.ts";

const HOSTNAME = "localhost";
const PORT = 8000;

async function startServer() {
  const coreServices = await loadCoreServices();
  const apiHandlers = await loadAPIHandlers(coreServices);

  console.log("Core Services Loaded.");
  for (const serviceName in coreServices) {
    console.log(`- ${serviceName} Service: ${typeof coreServices[serviceName]}`);
  }

  serve(async (req, connInfo) => {
    const pathName = new URL(req.url).pathname;
    const remoteAddr = connInfo.remoteAddr as Deno.NetAddr;
    const clientIp = remoteAddr.hostname;
    const clientPort = remoteAddr.port;

    // Serve API endpoints
    if (apiHandlers[pathName]) {
      console.log(`API Request - Endpoint: ${pathName}, Client IP: ${clientIp}, Client Port: ${clientPort}`);
      return apiHandlers[pathName](req);
    }

    // Serve static files from 'public' directory
    if (pathName.startsWith("/static")) {
      return serveDir(req, {
        fsRoot: "public",
        urlRoot: "static",
      });
    }
    if (pathName === "/") {
      // Serve index.html for root path
      return serveDir(req, {
        fsRoot: "public",
        index: "index.html",
      });
    }

    return new Response("NotFound", { status: 404 });
  }, { hostname: HOSTNAME, port: PORT });
}


// Function to dynamically load API handlers (no changes needed in logic)
async function loadAPIHandlers(coreServices: Record<string, any>): Promise<
  Record<string, (req: Request) => Promise<Response>>
> {
  const handlers: Record<string, (req: Request) => Promise<Response>> = {};
  const apiDir = "./api";

  for await (const entry of Deno.readDir(apiDir)) {
    if (entry.isFile && entry.name.endsWith(".ts")) {
      const routePath = `/api/${entry.name.replace(".ts", "")}`;
      const modulePath = new URL(`./api/${entry.name}`, import.meta.url).href;
      const module = await import(modulePath);
      handlers[routePath] = module.default;
      console.log(`API Endpoint Loaded: http://${HOSTNAME}:${PORT}${routePath}`);
    }
  }
  return handlers;
}

// Function to dynamically load core services (no changes needed in logic)
async function loadCoreServices(): Promise<Record<string, any>> {
  const services: Record<string, any> = {};
  const coreServiceDir = "./coreService";

  for await (const entry of Deno.readDir(coreServiceDir)) {
    if (
      entry.isFile &&
      entry.name.endsWith(".ts")
    ) {
      const serviceName = entry.name.replace(".ts", "");
      const modulePath = new URL(`./coreService/${entry.name}`, import.meta.url).href;
      const module = await import(modulePath);
      services[serviceName] = module;
      console.log(`CoreServiceLoaded: ${serviceName}`);
    }
  }
  return services;
}


startServer();