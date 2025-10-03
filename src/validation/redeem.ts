import { z } from "zod";
import {
  validOptionalEmail,
  validOptionalString,
  validPhoneNumber,
  validPositiveNumber,
  validUUID,
} from "../utils/common-validation";

export const RedeemSchema = z.object({
  name: z.string(),
  phoneNumber: validPhoneNumber(),
  email: validOptionalEmail(),
  address: z.string(),
  unit: validPositiveNumber(),
  shippingAddressId: validOptionalString(),
  rewardId: validUUID(),
  appMasterId: validPositiveNumber(),
});

export type TRedeemSchema = z.infer<typeof RedeemSchema>;
