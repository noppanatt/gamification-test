import { generateUUID } from "../utils/common";
import gcpService from "../utils/google-cloud";

export const rewardService = {
  generateRewardBlobPath: (fileId: string) => {
    return `reward/${fileId}`;
  },
  getUploadPreSignUrl: async () => {
    const fileId = generateUUID();
    const generatedBlobName = rewardService.generateRewardBlobPath(fileId);

    const blobUrl = await gcpService.getPreSignedURL(
      "write",
      generatedBlobName,
    );

    return {
      blobUrl,
      fileId,
      url: generatedBlobName,
    };
  },
};
