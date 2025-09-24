import { EXPIRES_IN_SECOND } from "../constants/azure-blob-constant";
import { getPresignedUrl } from "../utils/azure-blob";
import { generateUUID } from "../utils/common";

export const rewardService = {
  generateRewardBlobPath: (fileId: string) => {
    return `reward/${fileId}`;
  },
  getUploadPreSignUrl: async () => {
    const fileId = generateUUID();
    const generatedBlobName = rewardService.generateRewardBlobPath(fileId);

    const blobObject = await getPresignedUrl(
      generatedBlobName,
      EXPIRES_IN_SECOND
    );

    console.log({ blobObject });

    return {
      ...blobObject,
      fileId,
      url: generatedBlobName,
      headers: { "x-ms-blob-type": "BlockBlob" },
    };
  },
};
