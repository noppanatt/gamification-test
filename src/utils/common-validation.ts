import z from "zod";

const validOptionalString = () => z.preprocess((val) => val || "", z.string());

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

export {
  validOptionalPositiveNumber,
  validOptionalPositiveNumberWithRange,
  validOptionalString,
  validPositiveNumberWithRange,
};
