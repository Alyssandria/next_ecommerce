import { LoginValidator } from "@/lib/validations/authValidators"
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

export interface Product {
  id: number
  title: string
  description: string
  category: string
  price: number
  discountPercentage: number
  rating: number
  stock: number
  tags: string[]
  brand: string
  sku: string
  weight: number
  dimensions: Dimensions
  warrantyInformation: string
  shippingInformation: string
  availabilityStatus: string
  reviews: Review[]
  returnPolicy: string
  minimumOrderQuantity: number
  meta: Meta
  images: string[]
  thumbnail: string
}

export interface Dimensions {
  width: number
  height: number
  depth: number
}

export interface Review {
  rating: number
  comment: string
  date: string
  reviewerName: string
  reviewerEmail: string
}

export interface Meta {
  createdAt: string
  updatedAt: string
  barcode: string
  qrCode: string
}

export interface User {
  firstName: string,
  lastName: string,
  email: string,
  id: number,
}
export interface CartItem {
  quantity: number,
  id: number,
  productData: Product
}

export interface Shipping {
  id: number,
  label: string,
  zip: string,
  province: string,
  street: string,
  recipient: string,
}
