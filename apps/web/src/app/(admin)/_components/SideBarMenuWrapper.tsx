import SidebarMenu from './sidebar';
import { getUserRole } from '@/lib/auth';

export default async function SidebarMenuWrapper() {
  const userRole = await getUserRole();

  return <SidebarMenu userRole={userRole} />;
}