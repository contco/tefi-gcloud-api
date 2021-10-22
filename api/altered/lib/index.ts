import { getAlteredStaking } from './staking';

export const getAlteredAccount = async (address: string) => {
  try {
    const altePool = await getAlteredStaking(address);
    const result = {altePool};
    return result;
  } catch {
    return { altePool: null };
  }
};

