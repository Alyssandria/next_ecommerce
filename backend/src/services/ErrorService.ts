import { Response } from "express"
import z, { ZodError } from "zod"

export const validatorError = (res: Response, error: ZodError) => {
  const formatError = z.flattenError(error) as {
    formErrors: string[],
    fieldErrors: Record<string, any>
  }

  return res.status(400).json({
    success: false,
    errors: {
      global: false,
      form: formatError
    }
  });
}

