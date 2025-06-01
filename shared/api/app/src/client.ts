// Client-safe exports - only types and schemas, no services with database dependencies
export type { TProductItem } from './v1/products/products-dto';
export {
  userLoginSchema,
  userRegistrationSchema,
} from './v1/iam/users/users-schema';
