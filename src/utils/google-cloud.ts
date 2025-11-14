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
  initiateCORS: async () => {
    const bucket = storage.bucket(bucketName);
    await bucket.setCorsConfiguration([
      {
        origin: [
          "http://localhost:3000",
          "http://localhost:3001",
          "https://dev.farmsookbyfarmtech.com",
          "https://qa.farmsookbyfarmtech.com",
          "https://uat.farmsookbyfarmtech.com",
          "https://prod.farmsookbyfarmtech.com",
        ],
        responseHeader: ["*"], //* Might have to try to remove some custom headers from FrontEnd that is being used with azure blob and set to ["Content-Type"] to enhance security
        method: ["GET", "PUT"],
        maxAgeSeconds: 3600,
      },
    ]);
  },
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
    });

    return url;
  },
};

export default gcpService;
