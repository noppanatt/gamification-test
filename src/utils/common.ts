import { v4 as uuidv4 } from "uuid";

export const generateUUID = () => uuidv4();
export const SECOND = 1000;
export const MINUTE = 60 * SECOND;

export const calculateOffset = (page: number, limit: number) => {
  return ((Number(page) || 1) - 1) * (Number(limit) || 0);
};
