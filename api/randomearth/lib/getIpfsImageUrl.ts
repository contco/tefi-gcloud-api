export const getIpfsImageUrl = (ipfsImage: string) => {
  if (ipfsImage) {
    if (ipfsImage[0] !== "i") {
      return ipfsImage;
    }
    const splitImage = ipfsImage.split("/");
    const image = "https://cloudflare-ipfs.com/ipfs/" + splitImage[2];
    return image;
  }
  return "";
};
