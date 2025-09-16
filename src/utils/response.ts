import { HttpStatusCode } from "axios";
import { Response } from "express";

const customResponse = (
  res: Response,
  statusCode: HttpStatusCode,
  data?: {
    message?: string;
    [key: string]: unknown;
  }
) => {
  res.status(statusCode).send({
    success: [HttpStatusCode.Ok, HttpStatusCode.Created].includes(statusCode),
    message: data?.message || "success",
    ...data,
  });
  return;
};

export default customResponse;
