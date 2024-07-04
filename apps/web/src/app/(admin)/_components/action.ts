'use server';

import { cookies } from 'next/headers';

export const changeStore = async (storeId: string): Promise<void> => {
  cookies().set('storeId', storeId);
  // return storeId
};
