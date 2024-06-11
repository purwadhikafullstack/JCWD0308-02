'use client';

import { Menu, Search, Home, Bell, ShoppingCart, User } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import Image from 'next/image';

export const Header = () => {
  const [state, setState] = useState<boolean>(false);

  const menus = [
    { title: 'Home', path: '/', icon: <Home className="h-5 w-5" /> },
    {
      title: 'Notification',
      path: '/notification',
      icon: <Bell className="h-5 w-5" />,
    },
    {
      title: 'Cart',
      path: '/cart',
      icon: <ShoppingCart className="h-5 w-5" />,
    },
    {
      title: '',
      path: '/profile',
      icon: (
        <Image
          src="/avatar.png"
          width={50}
          height={50}
          alt="Avatar"
          className="rounded-full object-cover cursor-pointer"
        />
      ),
    },
  ];

  return (
    <nav className="bg-gray-200 w-full border-b md:border-0">
      <div className="items-center px-4 max-w-screen-xl mx-auto md:flex md:px-8">
        <div className="flex items-center justify-between py-3 md:py-5 md:block">
          <Link href="/">
            <Image
              src="/logo-grosirun-main.png"
              width={200}
              height={200}
              alt="Logo Grosirun"
            />
          </Link>
          <div className="md:hidden">
            <button
              className="text-gray-700 outline-none p-2 rounded-md focus:border-gray-400 focus:border"
              onClick={() => setState(!state)}
            >
              <Menu />
            </button>
          </div>
        </div>
        <div className="flex items-center space-x-2 border rounded-md p-2 md:flex-1 md:ml-4">
          <div className="relative w-full max-w-md">
            <Input type="text" placeholder="Search" className="pr-10" />
            <Button
              className="absolute right-2 top-1/2 transform -translate-y-1/2"
              variant="ghost"
              size="icon"
            >
              <Search className="h-5 w-5 text-gray-500" />
            </Button>
          </div>
        </div>
        <div
          className={`flex-1 justify-self-center pb-3 mt-8 md:block md:pb-0 md:mt-0 ${
            state ? 'block' : 'hidden'
          }`}
        >
          <ul className="justify-center items-center space-y-8 md:flex md:space-x-6 md:space-y-0">
            {menus.map((item, idx) => (
              <li
                key={idx}
                className="text-gray-600 hover:text-indigo-600 flex items-center space-x-2"
              >
                {item.icon}
                <Link href={item.path}>{item.title}</Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </nav>
  );
};
