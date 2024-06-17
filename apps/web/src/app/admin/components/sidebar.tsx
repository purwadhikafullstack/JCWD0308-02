"use client"
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { Home, User, Settings, Bell, LogOut } from 'lucide-react';

const Sidebar = () => {
  const pathname = usePathname();
  const menus = [
    { title: 'Dashboard', path: '/admin/dashboard', icon: <Home /> },
    { title: 'Users', path: '/admin/users', icon: <User /> },
    { title: 'Product', path: '/admin/product', icon: <Settings /> },
    { title: 'Notifications', path: '/admin/notifications', icon: <Bell /> },
  ];

  return (
    <aside className="w-64 bg-white shadow-lg">
      <div className="p-4 border-b">
        <Link href="/admin/dashboard">
            <Image src="/logo-grosirun-fix.png" alt="Logo" width={40} height={40} className="h-10 mx-auto" />
        </Link>
      </div>
      <nav className="mt-6">
        <ul>
          {menus.map((menu, index) => (
            <li key={index} className={`p-4 ${pathname === menu.path ? 'bg-gray-200' : ''}`}>
              <Link href={menu.path}>
                <div className="flex items-center space-x-3">
                  <div className="w-5 h-5">{menu.icon}</div>
                  <span>{menu.title}</span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
