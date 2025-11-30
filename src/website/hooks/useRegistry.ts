import { Class } from "@/types/Class";
import { useContext } from "react";
import { ClientRegistry } from "../clients/ClientRegistry";
import { Env } from "@/Env";

export namespace useRegistry {
  export function env(): Env.Public {
    return useContext(ClientRegistry.Context).getEnv();
  }
  export function instance<T>(klass: Class<T>): T {
    return useContext(ClientRegistry.Context).get(klass);
  }
}
