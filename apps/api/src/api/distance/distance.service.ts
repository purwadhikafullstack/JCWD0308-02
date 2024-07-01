import { prisma } from '@/db.js';
import { haversineDistance } from '@/utils/haversine.js';

const MAX_DISTANCE_KM = 100;

export const calculateDistance = (coord1: string, coord2: string) => {
  const [lat1, lon1] = coord1.split(' ').map(Number);
  const [lat2, lon2] = coord2.split(' ').map(Number);
  return haversineDistance(lat1, lon1, lat2, lon2);
};
export const findNearestStore = async (userCoordinate: string) => {
  const stores = await prisma.store.findMany({
    where: { status: 'PUBLISHED' },
  });

  let nearestStore = null;
  let nearestDistance = Infinity; // ensure less than nearestDistance

  for (const store of stores) {
    const distance = calculateDistance(userCoordinate, store.coordinate);
    if (distance < nearestDistance) {
      nearestDistance = distance;
      nearestStore = store;
    }
  }

  if (nearestDistance > MAX_DISTANCE_KM) {
    nearestStore = await prisma.store.findUnique({
      where: { slug: 'grosirun-pusat' },
    });
  }
  return nearestStore;
};

export const findStoresInRange = async (
  userCoordinate: string,
  range: number,
) => {
  const [userLat, userLon] = userCoordinate.split(',').map(Number);

  const stores = await prisma.store.findMany();
  const nearbyStores = stores.filter((store) => {
    const [storeLat, storeLon] = store.coordinate.split(',').map(Number);
    const distance = haversineDistance(userLat, userLon, storeLat, storeLon);
    return distance <= range;
  });
  return nearbyStores;
};
