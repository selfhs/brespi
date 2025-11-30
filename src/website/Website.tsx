import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useEffect, useState } from "react";
import { createBrowserRouter, replace, RouterProvider } from "react-router";
import { ClientRegistry } from "./clients/ClientRegistry";
import { $Configuration } from "./pages/$Configuration";
import { $Demo } from "./pages/$Demo";
import { $PipelineOverview } from "./pages/$PipelineOverview";
import { $ScheduleOverview } from "./pages/$ScheduleOverview";
import { $Pipeline } from "./pages/$Pipeline";

const router = createBrowserRouter([
  {
    path: "pipelines",
    Component: $PipelineOverview,
  },
  {
    path: "pipelines/:id",
    Component: $Pipeline,
  },
  {
    path: "schedules",
    Component: $ScheduleOverview,
  },
  {
    path: "configuration",
    Component: $Configuration,
  },
  {
    path: "demo", // TODO: remove
    Component: $Demo,
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
