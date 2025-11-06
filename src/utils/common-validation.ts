import z from "zod";

const validUUID = () => z.uuid();

const validOptionalString = () => z.preprocess((val) => val || "", z.string());

const validPositiveNumber = () =>
  z.preprocess((val) => (val ? val : undefined), z.coerce.number().positive());

const validPositiveNumberWithZero = () =>
  z.preprocess(
    (val) =>
      val === "" || val === null || val === undefined ? undefined : val,
    z.coerce.number().min(0)
  );

const validOptionalPositiveNumber = () =>
  z.preprocess(
    (val) => (val ? val : undefined),
    z.coerce.number().positive().optional()
  );

const validPositiveNumberWithRange = (min: number, max: number) => {
  const processedMin = Math.max(0, min);
  const processedMax = Math.max(processedMin, max);

  return z.coerce.number().gte(processedMin).lte(processedMax);
};

const validOptionalPositiveNumberWithRange = (min: number, max: number) => {
  const processedMin = Math.max(0, min);
  const processedMax = Math.max(processedMin, max);

  return z.coerce.number().gte(processedMin).lte(processedMax).optional();
};

const validPhoneNumber = () =>
  z
    .string({
      error: "Mobile number is required",
    })
    .regex(/^[0-9]{10}$/, { message: "Invalid mobile number" });

const validOptionalEmail = () =>
  z.preprocess((val) => (val ? val : undefined), z.email().optional());

export {
  validOptionalEmail,
  validOptionalPositiveNumber,
  validOptionalPositiveNumberWithRange,
  validOptionalString,
  validPhoneNumber,
  validPositiveNumber,
  validPositiveNumberWithRange,
  validPositiveNumberWithZero,
  validUUID,
};
