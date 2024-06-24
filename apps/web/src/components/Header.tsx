'use client';

import {
  Menu,
  Search,
  Home,
  Bell,
  ShoppingCart,
  ClipboardList,
  MapPin,
  ChevronDown,
  PackageSearch,
} from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

import Image from 'next/image';
import axios from 'axios';
import SearchBar from './partial/SearchBar';
import { env } from '@/app/env';
import { Badge } from './ui/badge';
import { useAppDispatch, useAppSelector } from '@/lib/features/hooks';
import { RootState } from '@/lib/features/store';
import { fetchCartItemCount } from '@/lib/features/cart/cartSlice';

export const Header = () => {
  const [state, setState] = useState<boolean>(false);
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);
  const itemCount = useAppSelector((state: RootState) => state.cart.itemCount);
  console.log(itemCount);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchCartItemCount());
  }, [dispatch]);

  const menus = [
    { title: 'Home', path: '/', icon: <Home className="h-5 w-5" /> },
    {
      title: 'Product',
      path: '/customer/product',
      icon: <PackageSearch className="h-5 w-5" />,
    },
    {
      title: 'Notification',
      path: '/customer/notification',
      icon: <Bell className="h-5 w-5" />,
    },
    {
      title: 'Cart',
      path: '/customer/cart',
      icon: (
        <div className="relative">
          <ShoppingCart className="h-5 w-5" />
          {itemCount > 0 && (
            <Badge className="absolute -top-2 -right-2">{itemCount}</Badge>
          )}
        </div>
      ),
    },
    {
      title: 'Orders',
      path: '/customer/order',
      icon: <ClipboardList className="h-5 w-5" />,
    },
    {
      title: 'Login',
      path: '/auth/login',
    },
  ];

  // useEffect(() => {
  //   const fetchCartItemCount = async () => {
  //     try {
  //       const response = await getCartItemCount();
  //       setCartItemCount(response.data);
  //     } catch (error) {
  //       console.error('Error fetching cart item count:', error);
  //     }
  //   };

  //   fetchCartItemCount();
  // }, []);

  const handleLogout = async () => {
    try {
      await axios.post(
        `${env.NEXT_PUBLIC_BASE_API_URL}/auth/signout`,
        {},
        { withCredentials: true },
      );
      alert('Logged out successfully');
      window.location.href = `${env.NEXT_PUBLIC_BASE_WEB_URL}/auth/login`; // Redirect to login page after logout
    } catch (error) {
      console.error('Error logging out:', error);
      alert('Failed to log out');
    }
  };

  return (
    <nav className="bg-muted w-full border-b md:border-0">
      <div className="max-w-screen-xl mx-auto p-2 flex flex-col md:flex-row md:items-center md:justify-between">
        <div className="flex items-center justify-between w-full md:w-auto">
          <Link href="/">
            <Image
              src="/logo-grosirun-main.png"
              width={150}
              height={150}
              alt="Logo Grosirun"
              className="cursor-pointer"
            />
          </Link>
          <button
            className="md:hidden text-gray-700 p-2 rounded-md focus:border-gray-400 focus:border"
            onClick={() => setState(!state)}
          >
            <Menu />
          </button>
        </div>

        <div
          className={`mt-4 md:mt-0 md:flex md:items-center md:space-x-6 ${
            state ? 'block' : 'hidden'
          }`}
        >
          <ul className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6">
            {menus.map((item, idx) => (
              <li
                key={idx}
                className="text-gray-600 hover:text-destructive flex items-center space-x-2 text-sm"
              >
                {item.icon}
                <Link href={item.path}>{item.title}</Link>
              </li>
            ))}
            <li className="relative">
              <figure
                className="max-w-[10rem] h-auto cursor-pointer"
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                <Image
                  src="/avatar.png"
                  width={50}
                  height={50}
                  alt="Avatar"
                  className="rounded-full object-cover"
                />
              </figure>
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white border rounded-md shadow-lg z-10">
                  <ul className="py-1">
                    <li>
                      <Link
                        href="/customer/profile"
                        className="block px-4 py-2 text-gray-800 hover:bg-gray-200"
                      >
                        Profile
                      </Link>
                    </li>
                    <li>
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-200"
                      >
                        Logout
                      </button>
                    </li>
                  </ul>
                </div>
              )}
            </li>
          </ul>
        </div>
      </div>
      <hr />
      {/* search bar */}
      <SearchBar onSearch={(s) => {}} />
      <hr />
      <div className="address flex justify-between mx-5 p-2">
        <p className="flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          Deliver to <strong>Home</strong>
        </p>
        <p className="flex items-center gap-2">
          <ChevronDown className="h-5 w-5" />
          From <strong>Grosirun Pusat</strong>
        </p>
      </div>
    </nav>
  );
};
