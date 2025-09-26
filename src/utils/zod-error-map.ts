// export const enumErrorMap: z.ZodErrorMap = (issue, params) => {
//   return { message: `\`${issue.path.at(0)}\` ${params.defaultError}` };
// };
// import type { $ZodIssue } from "@zod/core";

export const fieldError = (iss: any) => {
  const f = `\`${String(iss.path?.[0] ?? "")}\``;
  if (iss.code === "invalid_type") return `${f} Invalid type`;
  // otherwise, keep Zod’s default message
  return undefined;
};
