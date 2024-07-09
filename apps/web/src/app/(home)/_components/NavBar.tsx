'use client';
import * as React from 'react';
import Link from 'next/link';
import { cn, shuffleArray } from '@/lib/utils';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';
import { CarTaxiFront, LayoutGrid, Menu, Search, ShoppingBag } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button, buttonVariants } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Category } from '@/lib/types/category';
import { AvatarDropdown } from '@/components/shared/avatar-dropdown';
import RightMenu from './right-menu';
import SecondNavbar from './second-navbar';
import Image from 'next/image';

export const NavbBar = ({ category }: { category: Category[] }) => {
  return (
    <div className="flex flex-col z-10 bg-background">
      <header className="container flex items-center justify-between gap-4 h-16 bg-background px-4 md:px-6">
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="flex items-center gap-2 text-lg font-semibold md:text-sm"
          >
            <figure>
              <Image
                src="/logogram-new.png"
                width={200}
                height={200}
                alt="logo grosirun"
              />
            </figure>
          </Link>
          <nav className="flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger>
                    <span className="hidden md:block">Category</span>
                    <>
                      <LayoutGrid className="h-6 w-6 md:hidden" />
                      <span className="sr-only">Toggle navigation</span>
                    </>
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[600px] gap-3 p-4 md:grid-cols-4">
                      {category.length > 0 ? (
                        category.map((item: Category) => (
                          <ListItem
                            key={item.id}
                            title={item.name}
                            href={`/category`}
                          />
                        ))
                      ) : (
                        <></>
                      )}
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </nav>
        </div>
        <form
          className="relative hidden md:block w-full max-w-4xl"
          onSubmit={(e) => {
            e.preventDefault();
            const q = new FormData(e.currentTarget).get('query');
            console.log(q);

            // router.push(`/search?q=${q}`);
          }}
        >
          <Input
            type="text"
            className="max-w-4xl"
            name="query"
            placeholder="Search products...."
          />
          <Button
            size="icon"
            variant="ghost"
            type="submit"
            className="absolute inset-y-0 right-0 rounded-r-md px-3 text-muted-foreground"
          >
            <Search className="h-5 w-5" />
          </Button>
        </form>
        <div className="flex items-center gap-3">
          <Sheet>
            <SheetTrigger asChild>
              <Button className="md:hidden" size="icon" variant="ghost">
                <Search className="h-6 w-6" />
                <span className="sr-only">Toggle navigation</span>
              </Button>
            </SheetTrigger>
            <SheetContent className="w-[300px]" side="right">
              <div className="flex flex-col items-start gap-4 p-4">
                <nav className="flex flex-col items-start gap-2">
                  <Link
                    href="#"
                    className="text-muted-foreground transition-colors hover:text-foreground"
                  >
                    Home
                  </Link>
                  <Link
                    href="#"
                    className="text-muted-foreground transition-colors hover:text-foreground"
                  >
                    List Orders
                  </Link>
                  <Link
                    href="#"
                    className="text-muted-foreground transition-colors hover:text-foreground"
                  >
                    Products
                  </Link>
                  <Link
                    href="#"
                    className="text-muted-foreground transition-colors hover:text-foreground"
                  >
                    Customers
                  </Link>
                  <Link
                    href="#"
                    className="text-foreground transition-colors hover:text-foreground"
                  >
                    Settings
                  </Link>
                </nav>
              </div>
            </SheetContent>
          </Sheet>
          <RightMenu />
          <AvatarDropdown />
        </div>
      </header>
      <SecondNavbar />
    </div>
  );
};

const ListItem = React.forwardRef<
  React.ElementRef<'a'>,
  React.ComponentPropsWithoutRef<'a'>
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            'block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground',
            className,
          )}
          {...props}
        >
          <div className="leading-none">
            {title}
          </div>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = 'ListItem';
