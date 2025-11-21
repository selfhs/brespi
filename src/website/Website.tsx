import { useEffect, useState } from "react";
import { ClientRegistry } from "./clients/ClientRegistry";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createBrowserRouter, replace, RouterProvider } from "react-router";
import { $PipelineOverview } from "./pages/$PipelineOverview";
import { $ScheduleOverview } from "./pages/$ScheduleOverview";
import { $Configuration as $Configuration } from "./pages/$Configuration";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

const router = createBrowserRouter([
  {
    path: "/",
    Component: $PipelineOverview,
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
    path: "*",
    loader: () => replace("/"),
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
