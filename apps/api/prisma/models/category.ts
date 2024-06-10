export function listCategories(id: string) {
  return [
    {
      name: 'ALL',
      superAdminId: id,
    },
    {
      name: 'FOOD',
      superAdminId: id,
    },
    {
      name: 'BEVERAGE',
      superAdminId: id,
    },
    {
      name: 'HOME AND LIVING',
      superAdminId: id,
    },
    {
      name: 'HEALTH',
      superAdminId: id,
    },
  ];
}
