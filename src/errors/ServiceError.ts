import { Response } from "express";

export class ServiceError extends Error {
  public readonly statusCode: number;
  public readonly body: unknown;

  constructor(statusCode: number, body: unknown) {
    const message =
      body && typeof body === "object" && "message" in body
        ? String((body as { message: unknown }).message)
        : String(body);
    super(message);
    this.name = "ServiceError";
    this.statusCode = statusCode;
    this.body = body;
    Object.setPrototypeOf(this, ServiceError.prototype);
  }

  static message(
    statusCode: number,
    message: string,
    extra?: Record<string, unknown>
  ): ServiceError {
    return new ServiceError(statusCode, { message, ...(extra ?? {}) });
  }
}

export const handleServiceError = (res: Response, error: unknown): boolean => {
  if (error instanceof ServiceError) {
    res.status(error.statusCode).json(error.body);
    return true;
  }
  return false;
};
