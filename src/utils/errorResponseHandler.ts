import { Request, Response } from "express";
import { UniqueConstraintError, ValidationError } from "sequelize";

// class CustomError extends Error {
//   constructor(public statusCode: number, message: string) {
//     super(message);
//   }
// }

/**
 *
 * @param {Error} err - error
 * @param {Request} req - Request
 * @param {Response} res - Response
 */
// export default function errorResponseHandler(app: Express) {

function safeJsonParse<T = any>(input: unknown): T | null {
  if (typeof input !== "string") return null;
  try {
    return JSON.parse(input);
  } catch {
    return null;
  }
}

const errorResponseHandler = <T>(err: T, req: Request, res: Response) => {
  if (err instanceof ValidationError || err instanceof UniqueConstraintError) {
    const errors = (err as ValidationError).errors.map((e) => ({
      path: e.path,
      message: e.message,
    }));
    const message = errors.length ? errors[0].message : "Validation error";

    return res.status(409).json({
      success: false,
      message,
      errors,
    });
  }

  console.info("Error errorResponseHandler", err);

  const rawMessage = (err as any)?.message ?? "Unknown error";
  const parsed = safeJsonParse(rawMessage);

  return res.status(500).json({
    success: false,
    message: "There was some error",
    error: parsed ?? rawMessage, // fallback to raw string if not JSON
  });
};

export { errorResponseHandler };
