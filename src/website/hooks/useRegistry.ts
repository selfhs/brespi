import { Class } from "@/types/Class";
import { useContext } from "react";
import { ClientRegistry } from "../clients/ClientRegistry";
import { Config } from "@/Config";

export namespace useRegistry {
  export function config(): Config.Public {
    return useContext(ClientRegistry.Context).getConfig();
  }
  export function instance<T>(klass: Class<T>): T {
    return useContext(ClientRegistry.Context).get(klass);
  }
}
