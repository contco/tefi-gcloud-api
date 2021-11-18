export const getIpfsImageUrl = (ipfsImage: string) => {
  if (ipfsImage) {
    const splitImage = ipfsImage.split("/");
    const image = "https://cloudflare-ipfs.com/ipfs/" + splitImage[2];
    return image;
  }
  return "";
};
