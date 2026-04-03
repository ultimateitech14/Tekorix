import { z } from "zod";

export function getFieldErrors<TValues extends Record<string, unknown>>(error: z.ZodError<TValues>) {
  return error.issues.reduce<Partial<Record<keyof TValues, string>>>((acc, issue) => {
    const key = issue.path[0] as keyof TValues | undefined;

    if (key && !acc[key]) {
      acc[key] = issue.message;
    }

    return acc;
  }, {});
}
