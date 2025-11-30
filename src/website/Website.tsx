import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useEffect, useState } from "react";
import { createBrowserRouter, replace, RouterProvider } from "react-router";
import { ClientRegistry } from "./clients/ClientRegistry";
import { schedules } from "./pages/schedules";
import { configuration } from "./pages/configuration";
import { pipelines } from "./pages/pipelines";
import { pipelines_$id } from "./pages/pipelines.$id";

const router = createBrowserRouter([
  {
    path: "pipelines",
    Component: pipelines,
  },
  {
    path: "pipelines/:id",
    Component: pipelines_$id,
  },
  {
    path: "schedules",
    Component: schedules,
  },
  {
    path: "configuration",
    Component: configuration,
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
