import { Execution } from "@/models/Execution";
import { Temporal } from "@js-temporal/polyfill";

export namespace ExecutionData {
  const time1 = Temporal.Now.plainDateTimeISO().subtract({ days: 1 });
  const time2 = Temporal.Now.plainDateTimeISO().subtract({ days: 2 });
  const time3 = Temporal.Now.plainDateTimeISO().subtract({ days: 3 });
  const duration = Temporal.Duration.from({ seconds: Math.round(200 + Math.random() * 400) });

  export const SUCCESS_1: Execution = {
    outcome: Execution.Outcome.success,
    duration,
    startedAt: time1,
    completedAt: time1.add(duration),
  };

  export const SUCCESS_2: Execution = {
    outcome: Execution.Outcome.success,
    duration,
    startedAt: time2,
    completedAt: time2.add(duration),
  };

  export const ERROR: Execution = {
    outcome: Execution.Outcome.error,
    duration,
    startedAt: time3,
    completedAt: time3.add(duration),
  };
}
