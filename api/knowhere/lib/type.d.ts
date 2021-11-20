interface Attributes {
  display_type?: string;
  trait_type?: string;
  value?: string;
}

interface Images {
  small: string;
  medium: string;
  large: string;
  original: string;
}

interface Collection {
  nftContract?: string;
  name?: string;
  description?: string;
  imageUrl?: string;
  coverImageUrl?: string;
  standardType?: string;
  creator?: string;
  creatorName?: string;
  collectionType?: string;
  candyMachine?: string;
  rarities?: any;
  attributes?: any;
  isVerified?: boolean;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string;
}

export interface KnowhereNftInfo {
  nftContract: string;
  tokenId: string;
  name: string;
  description: string;
  image: string;
  imageData: any;
  externalUrl: any;
  backgroundColor: any;
  animationUrl: any;
  videoUrl: any;
  rarityLevel: any;
  unlockableContent?: boolean;
  attributes?: Attributes[];
  images?: Images;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string;
  collection: Collection;
}

export interface QueryVariables {
  [key: string]: string;
}

export interface QueryObject {
  variableNames: string;
  queryStrings: string;
  variables: QueryVariables;
}

export interface QueriesInfo {
  query: string;
  variables: QueryVariables;
}

export interface MantleData {
  Height: string;
  Result: string;
}

export interface MantleResponse {
  [key: string]: MantleData;
}

export interface TokensInfo {
  nftContract: string;
  tokens: string[];
}

interface Skills {
  skill_type?: string;
  value?: number;
}

export interface NftInfo {
  tokenId?: string;
  nftContract?: string;
  name?: string;
  description?: string;
  image?: string;
  collectionName?: string;
  marketplace?: string;
  symbol?: string;
  class?: string;
  rarity?: string;
  skills?: Skills[];
  attributes?: Attributes[];
}
