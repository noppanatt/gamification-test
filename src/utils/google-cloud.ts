import { Storage } from "@google-cloud/storage";
import { config } from "dotenv";
import { MINUTE } from "./common";

config();

const bucketName = process.env.GCP_STORAGE_BUCKET_NAME!;
const credentials = JSON.parse(process.env.GCP_STORAGE_SERVICE_ACCOUNT!);
const defaultExpires = 1 * MINUTE;

const storage = new Storage({
  credentials,
});

const gcpService = {
  getPreSignedURL: async (
    action: "read" | "write",
    fileName: string,
    expires = defaultExpires,
  ) => {
    const bucket = storage.bucket(bucketName);
    const file = bucket.file(fileName);

    const [url] = await file.getSignedUrl({
      version: "v4",
      action,
      expires: Date.now() + expires,
      contentType: action === "write" ? "application/octet-stream" : undefined,
    });

    return url;
  },
};

export default gcpService;
