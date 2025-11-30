import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useEffect, useState } from "react";
import { createBrowserRouter, replace, RouterProvider } from "react-router";
import { ClientRegistry } from "./clients/ClientRegistry";
import { _schedules } from "./pages/schedules";
import { _configuration } from "./pages/configuration";
import { _demo } from "./pages/demo";
import { _pipelines } from "./pages/pipelines";
import { _pipelines_$id } from "./pages/pipelines.$id";

const router = createBrowserRouter([
  {
    path: "pipelines",
    Component: _pipelines,
  },
  {
    path: "pipelines/:id",
    Component: _pipelines_$id,
  },
  {
    path: "schedules",
    Component: _schedules,
  },
  {
    path: "configuration",
    Component: _configuration,
  },
  {
    path: "demo", // TODO: remove
    Component: _demo,
  },
  {
    path: "*",
    loader: () => replace("/pipelines"),
  },
]);

export function Website() {
  const [registry, setRegistry] = useState<ClientRegistry>();
  useEffect(() => {
    ClientRegistry.bootstrap().then(setRegistry);
  }, []);
  if (registry) {
    return (
      <ClientRegistry.Context.Provider value={registry}>
        <QueryClientProvider client={registry.get(QueryClient)}>
          <RouterProvider router={router} />
          {registry.getConfig().O_BRESPI_STAGE === "development" && <ReactQueryDevtools />}
        </QueryClientProvider>
      </ClientRegistry.Context.Provider>
    );
  }
  return null;
}
