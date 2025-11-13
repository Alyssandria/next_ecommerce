import { ZodFormattedError } from "zod/v3"

export type ApiValidatorError<T> = {
  success: false,
  errors: {
    global: false,
    form: {
      formErrors?: string[],
      fieldErrors: Record<keyof T, string[]>
    }
  }
}

export type ApiGlobalError = {
  success: false,
  errors: {
    global: true,
    message: string
  }
}

export type ApiSuccess = {
  success: true,
  data: Record<string, any>
}

export type ApiResponse<T> = ApiGlobalError | ApiSuccess | ApiValidatorError<T>;

