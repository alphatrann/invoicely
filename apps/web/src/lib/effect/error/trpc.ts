import { Data } from "effect";

/**
 * Error thrown when a resource is not found.
 * Used to handle and report failures in resource retrieval, such as when a resource is not found.
 * @requires message - The error message to be displayed to the user.
 */
export class NotFoundError extends Data.TaggedError("NotFoundError")<{
  message: string;
}> {}

/**
 * Error thrown when a user attempts to access or modify a resource they don't own.
 * Used in authorization checks to prevent unauthorized access to user-specific resources.
 * @requires message - The error message to be displayed to the user.
 */
export class NotOwnerError extends Data.TaggedError("NotOwnerError")<{
  message: string;
}> {}

/**
 * Error thrown when a storage operation fails.
 * Used to handle and report failures in storage operations, such as file uploads or deletions.
 * @requires message - The error message to be displayed to the user.
 */
export class MinIOStorageError extends Data.TaggedError("MinIOStorageError")<{
  message: string;
}> {}

/**
 * Error thrown when a user attempts to access a resource they don't have permission to.
 * Used to handle and report failures in authorization checks, such as when a user tries to access a resource they don't have permission to.
 * @requires message - The error message to be displayed to the user.
 */
export class ForbiddenError extends Data.TaggedError("ForbiddenError")<{
  message: string;
}> {}

/**
 * Error thrown when a payload is too large.
 * Used to handle and report failures in payload size checks, such as when a payload is too large.
 * @requires message - The error message to be displayed to the user.
 */
export class PayloadTooLargeError extends Data.TaggedError("PayloadTooLargeError")<{
  message: string;
}> {}

/**
 * Error thrown when a service is unavailable.
 * Used to handle and report failures in service availability checks, such as when a service is unavailable.
 * @requires message - The error message to be displayed to the user.
 */
export class ServiceUnavailableError extends Data.TaggedError("ServiceUnavailableError")<{
  message: string;
}> {}

/**
 * Error thrown when an internal server error occurs.
 * Used to handle and report failures in internal server errors, such as when an internal server error occurs.
 * @requires message - The error message to be displayed to the user.
 */
export class InternalServerError extends Data.TaggedError("InternalServerError")<{
  message: string;
}> {}

/**
 * Error thrown when a bad request is made.
 * Used to handle and report failures in bad requests, such as when a bad request is made.
 * @requires message - The error message to be displayed to the user.
 */
export class BadRequestError extends Data.TaggedError("BadRequestError")<{
  message: string;
}> {}
