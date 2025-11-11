import { DrizzleQueryError } from "drizzle-orm"
import { Response } from "express"
import z, { ZodError } from "zod"

export const validatorError = (res: Response, error: ZodError) => {
  const formatError = z.flattenError(error) as {
    formErrors: string[],
    fieldErrors: Record<string, any>
  }

  return res.status(400).json({
    success: false,
    errors: formatError
  });
}

export const drizzleError = (res: Response, error: DrizzleQueryError, opts: {
  conditions: (() => boolean)
  message: Record<string, any>
}[]) => {
  const cause = error.cause as any;
  const code = cause?.code;

  const errorBody = {
    success: false,
  }

  for (const opt of opts) {
    if (opt.conditions()) {
      return res.status(400).json({
        ...errorBody,
        errors: opt.message
      });
    }
  }

  return res.status(400).json({
    ...errorBody,
    error: {
      "_global": "Something went wrong in the query"
    }
  })
}
