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
const errorResponseHandler = <T>(err: T, req: Request, res: Response) => {
  console.debug("Error : ", err);
  if (err instanceof ValidationError || err instanceof UniqueConstraintError) {
    let message = "";
    const errors = (err as ValidationError).errors //|| (err as UniqueConstraintError)
      .map((e) => {
        return {
          path: e.path,
          message: e.message,
        };
      });
    if (errors.length) {
      message = errors[0].message;
    }
    res.status(409).json({
      success: false,
      message: message,
      errors: errors,
    });
  } else {
    console.info("Error errorResponseHandler", err);
    res.status(500).json({
      success: false,
      message: "There was some error",
      error: (err as any)?.message,
    });
  }
};
// }
export { errorResponseHandler };
