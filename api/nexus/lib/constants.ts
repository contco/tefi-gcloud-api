export const NEXUS_GRAPH_API = "https://api.nexusprotocol.app/graphql";

export const NEXUS_CONTRACTS = {
  token: "terra12897djskt9rge8dtmm86w654g7kzckkd698608",
  pool: "terra163pkeeuwxzr0yhndf8xd2jprm9hrtk59xf7nqf",
  liquidity: "terra1q6r8hfdl203htfvpsmyh8x689lp2g0m7856fwd",
  staking: "terra12kzewegufqprmzl20nhsuwjjq6xu8t8ppzt30a",
  bLunaVault: "terra10f2mt82kjnkxqj2gepgwl637u2w4ue2z5nhz5j",
  bEthVault: "terra178v546c407pdnx5rer3hu8s2c0fc924k74ymnn",
  bLunaRewards: "terra1hjv3quqsrw3jy7pulgutj0tgxrcrnw2zs2j0k7",
  bEthRewards: "terra1fhqsu40s0lk3p308mcakzjecj6ts6j2guepfr4",
  nLunaPool: "terra1zvn8z6y8u2ndwvsjhtpsjsghk6pa6ugwzxp6vx",
  nLunaToken: "terra10f2mt82kjnkxqj2gepgwl637u2w4ue2z5nhz5j",
  nLunaLiquidity: "terra1tuw46dwfvahpcwf3ulempzsn9a0vhazut87zec",
  nLunaStaking: "terra1hs4ev0ghwn4wr888jwm56eztfpau6rjcd8mczc",
  nEthPool: "terra14zhkur7l7ut7tx6kvj28fp5q982lrqns59mnp3",
  nEthLiquidity: "terra1y8kxhfg22px5er32ctsgjvayaj8q36tr590qtp",
  nEthToken: "terra178v546c407pdnx5rer3hu8s2c0fc924k74ymnn",
  nEthStaking: "terra1lws09x0slx892ux526d6atwwgdxnjg58uan8ph",
  nexusGov: "terra1xrk6v2tfjrhjz2dsfecj40ps7ayanjx970gy0j",
};

export const NEXUS_POOL_CONTRACTS = [
  {
    pool: "terra163pkeeuwxzr0yhndf8xd2jprm9hrtk59xf7nqf",
    liquidity: "terra1q6r8hfdl203htfvpsmyh8x689lp2g0m7856fwd",
    staking: "terra12kzewegufqprmzl20nhsuwjjq6xu8t8ppzt30a",
    token: "terra12897djskt9rge8dtmm86w654g7kzckkd698608",
    symbol1: "UST",
    symbol2: "PSI",
    rewardsSymbol: "PSI",
    isUstPair: true,
  },
  {
    pool: "terra1zvn8z6y8u2ndwvsjhtpsjsghk6pa6ugwzxp6vx",
    liquidity: "terra1tuw46dwfvahpcwf3ulempzsn9a0vhazut87zec",
    staking: "terra1hs4ev0ghwn4wr888jwm56eztfpau6rjcd8mczc",
    token: "terra10f2mt82kjnkxqj2gepgwl637u2w4ue2z5nhz5j",
    symbol1: "PSI",
    symbol2: "nLUNA",
    rewardsSymbol: "PSI",
    isUstPair: false,
  },
  {
    pool: "terra14zhkur7l7ut7tx6kvj28fp5q982lrqns59mnp3",
    liquidity: "terra1y8kxhfg22px5er32ctsgjvayaj8q36tr590qtp",
    staking: "terra1lws09x0slx892ux526d6atwwgdxnjg58uan8ph",
    token: "terra178v546c407pdnx5rer3hu8s2c0fc924k74ymnn",
    symbol1: "PSI",
    symbol2: "nETH",
    rewardsSymbol: "PSI",
    isUstPair: false,
  },
];
