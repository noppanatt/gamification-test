import { Request, Response } from "express";
import * as XLSX from "xlsx";
import { errorResponseHandler } from "../utils/errorResponseHandler";

export const incentiveController = {
  uploadFile: async (req: Request, res: Response) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "File is required" });
      }

      const workbook = XLSX.read(req.file.buffer, { type: "buffer" });

      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];

      const data = XLSX.utils.sheet_to_json<Record<string, any>>(worksheet);
      let xlsxData;
      if (data.length) {
        xlsxData = data.map((row) => {
          return Object.fromEntries(
            Object.entries(row).map(([key, value]) => [
              key.replace(/\s+/g, ""),
              value,
            ])
          );
        });
      }

      res.json({
        message: "Upload OK",
        filename: req.file.originalname,
        size: req.file.size,
        mimeType: req.file.mimetype,
        data: xlsxData?.slice(0, 10),
      });
      // return customResponse(res, 200, {  : "Upload accepted", body });
    } catch (error) {
      errorResponseHandler(error, req, res);
    }
  },
};
