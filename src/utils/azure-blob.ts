import {
  BlobSASPermissions,
  BlobSASSignatureValues,
  BlobServiceClient,
  SASProtocol,
  ServiceGetUserDelegationKeyResponse,
  StorageSharedKeyCredential,
  generateBlobSASQueryParameters,
} from "@azure/storage-blob";

const constants = {
  accountName: process.env.AZURE_STORAGE_ACCOUNT as string,
  containerName: process.env.AZURE_STORAGE_ACCOUNT_CONTAINER as string,
  key: process.env.AZURE_STORAGE_KEY as string,
  version: "2020-04-08",
};

const getClient = async (): Promise<BlobServiceClient> => {
  // const tokenCredential = new DefaultAzureCredential();

  const account = process.env.AZURE_STORAGE_ACCOUNT!.trim();
  const key = process.env.AZURE_STORAGE_KEY!.trim();
  const cred = new StorageSharedKeyCredential(account, key);

  const blobClient = new BlobServiceClient(
    `https://${account}.blob.core.windows.net`,
    cred
  );

  console.log({ blobClient });

  return blobClient;
};

// const getDelegationKey = async () => {
//   try {
//     //* Best practice: create time limits
//     const TEN_MINUTES = 10 * 60 * 1000;
//     const NOW = new Date();

//     //* Best practice: set start time a little before current time to
//     //* make sure any clock issues are avoided
//     const TEN_MINUTES_BEFORE_NOW = new Date(NOW.valueOf() - TEN_MINUTES);
//     const TEN_MINUTES_AFTER_NOW = new Date(NOW.valueOf() + TEN_MINUTES);

//     //* Generate user delegation SAS for a container
//     const blobClient = await getClient();

//     const delegationKey = await blobClient.getUserDelegationKey(
//       TEN_MINUTES_BEFORE_NOW,
//       TEN_MINUTES_AFTER_NOW
//     );
//     console.log({ delegationKey });

//     return delegationKey;
//   } catch (error) {
//     console.log({ error });
//   }
// };

const getBlobUrl = (
  accountName: string,
  containerName: string,
  blobName: string,
  sasToken: string
) =>
  `https://${accountName}.blob.core.windows.net/${containerName}/${blobName}${sasToken}`;

const createBlobSas = (
  delegationKey: ServiceGetUserDelegationKeyResponse,
  accountName: string,
  options: {
    containerName: string;
    blobName: string;
    contentType?: string;
    correlationId?: string;
    expiresOnSeconds: number;
  }
) => {
  const sasOptions: BlobSASSignatureValues = {
    permissions: BlobSASPermissions.parse("cwr"), // permissions
    protocol: SASProtocol.Https,
    startsOn: new Date(),
    expiresOn: new Date(new Date().valueOf() + options.expiresOnSeconds * 1000), // 5 seconds
    containerName: options.containerName,
    blobName: options.blobName,
    contentType: options.contentType,
    correlationId: options.correlationId,
    version: constants.version,
  };

  const sasToken = generateBlobSASQueryParameters(
    sasOptions,
    delegationKey,
    accountName
  ).toString();

  //* Prepend sasToken with `?`
  return sasToken[0] === "?" ? sasToken : `?${sasToken}`;
};

function createBlobSasWithSharedKey(opts: {
  containerName: string;
  blobName: string;
  expiresOnSeconds: number;
  contentType?: string;
  correlationId?: string;
}) {
  const now = Date.now();
  const values: BlobSASSignatureValues = {
    containerName: opts.containerName,
    blobName: opts.blobName,
    permissions: BlobSASPermissions.parse("cwr"), // create + write + read
    protocol: SASProtocol.Https,
    startsOn: new Date(now - 5 * 60 * 1000), // clock skew buffer
    expiresOn: new Date(now + opts.expiresOnSeconds * 1000),
    contentType: opts.contentType, // optional
    correlationId: opts.correlationId, // optional
  };

  const cred = new StorageSharedKeyCredential(
    constants.accountName,
    constants.key
  );
  const sas = generateBlobSASQueryParameters(values, cred).toString();
  return sas.startsWith("?") ? sas : `?${sas}`;
}

export const getPresignedUrl = async (
  blobName: string,
  expiresOnSeconds: number,
  contentType?: string | undefined,
  correlationId?: string | undefined
) => {
  const blobVersion = new Date().toISOString().split("T")[0] as string;

  if (!blobName) return {};

  const sasToken = createBlobSasWithSharedKey({
    blobName,
    containerName: constants.containerName,
    contentType,
    correlationId,
    expiresOnSeconds,
  });

  const blobUrl = getBlobUrl(
    constants.accountName,
    constants.containerName,
    blobName,
    sasToken
  );

  return { blobUrl, blobVersion, correlationId };
};

export const isFileUploaded = async (prefix: string) => {
  const blobClient = await getClient();
  const containerClient = blobClient.getContainerClient(
    constants.containerName
  );
  const iter = containerClient.listBlobsFlat({ prefix });
  const blobItem = await iter.next();
  return blobItem.value !== undefined;
};
