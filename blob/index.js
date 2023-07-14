// require("dotenv").config();
const storage = require("@azure/storage-blob");

const storageClients = {
  cerds: null,
  blobServiceClient: null,
}

const init = () => {
  const accountName = process.env.AZURE_STORAGE_ACCOUNT_NAME;
  const accountKey = process.env.AZURE_STORAGE_ACCOUNT_KEY;
  storageClients.cerds = new storage.StorageSharedKeyCredential(accountName, accountKey);
  storageClients.blobServiceClient = new storage.BlobServiceClient(`https://${accountName}.blob.core.windows.net`, storageClients.cerds);
};

const uploadUrl = async (containerName, blobName) => {
  const client = storageClients.blobServiceClient.getContainerClient(containerName)
  const blobClient = client.getBlobClient(blobName);
  const blobSAS = storage.generateBlobSASQueryParameters(
    {
      containerName, 
      blobName, 
      permissions: storage.BlobSASPermissions.parse("wc"), 
      startsOn: new Date(),
      expiresOn: new Date(new Date().valueOf() + 86400)
    },
    storageClients.cerds, 
  ).toString();

  const url = blobClient.url+"?"+blobSAS;

  return url;
};

const main = async () => {
  init();
  const url = await uploadUrl('$web', '555.jpg');
  console.log(url);
};

module.exports = {
  init,
  uploadUrl,
};
