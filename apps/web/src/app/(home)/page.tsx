import { Button } from '@/components/ui/button';
import CarouselComponent from '../_components/Carousel';
import Link from 'next/link';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import Image from 'next/image';

export default function Home() {
  return (
    <main className="flex-1">
      <section className="w-full py-6 sm:py-10 md:py-12 lg:py-14">
        <div className="container px-4 md:px-6">
          <Carousel className="rounded-lg shadow-lg">
            <CarouselContent>
              <CarouselItem>
                <div className="relative h-[400px] w-full overflow-hidden rounded-lg">
                  <Image
                    src="/placeholder.svg"
                    alt="Promotion 1"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <div className="absolute bottom-6 left-6 text-white">
                    <h2 className="text-2xl font-bold">Fresh Produce Sale</h2>
                    <p className="text-lg">Up to 30% off on selected items</p>
                  </div>
                </div>
              </CarouselItem>
              <CarouselItem>
                <div className="relative h-[400px] w-full overflow-hidden rounded-lg">
                  <Image
                    src="/placeholder.svg"
                    alt="Promotion 2"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <div className="absolute bottom-6 left-6 text-white">
                    <h2 className="text-2xl font-bold">Dairy Products Sale</h2>
                    <p className="text-lg">
                      Buy one, get one free on selected items
                    </p>
                  </div>
                </div>
              </CarouselItem>
              <CarouselItem>
                <div className="relative h-[400px] w-full overflow-hidden rounded-lg">
                  <Image
                    src="/placeholder.svg"
                    alt="Promotion 3"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <div className="absolute bottom-6 left-6 text-white">
                    <h2 className="text-2xl font-bold">Snack Attack</h2>
                    <p className="text-lg">
                      Grab your favorite snacks at discounted prices
                    </p>
                  </div>
                </div>
              </CarouselItem>
            </CarouselContent>
            <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/50 p-2 shadow-md hover:bg-white">
              <div className="h-6 w-6 text-muted-foreground" />
            </CarouselPrevious>
            <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/50 p-2 shadow-md hover:bg-white">
              <div className="h-6 w-6 text-muted-foreground" />
            </CarouselNext>
          </Carousel>
        </div>
      </section>
      <section className="w-full py-6 sm:py-10 md:py-12 lg:py-14">
        <div className="container px-4 md:px-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold sm:text-3xl md:text-4xl">
              Featured Products
            </h2>
            <Link
              href="#"
              className="text-sm font-medium text-primary hover:underline underline-offset-4"
              prefetch={false}
            >
              View All
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 mt-6 ">
            <div className="grid gap-2.5 relative group shadow-lg rounded-lg overflow-hidden hover:shadow-xl transition-shadow">
              <Link href="#" className="absolute inset-0 z-10" prefetch={false}>
                <span className="sr-only">View</span>
              </Link>
              <Image
                src="/placeholder.svg"
                alt="Apples"
                width={200}
                height={200}
                className="rounded-lg object-cover w-full aspect-square group-hover:opacity-50 transition-opacity"
              />
              <div className="grid gap-1 p-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">Apples</h3>
                  <h4 className="font-semibold">$2.99/lb</h4>
                </div>
                <Button
                  variant="outline"
                  className="bg-primary text-primary-foreground w-full"
                >
                  Add to Cart
                </Button>
              </div>
            </div>
            <div className="grid gap-2.5 relative group shadow-lg rounded-lg overflow-hidden hover:shadow-xl transition-shadow">
              <Link href="#" className="absolute inset-0 z-10" prefetch={false}>
                <span className="sr-only">View</span>
              </Link>
              <Image
                src="/placeholder.svg"
                alt="Apples"
                width={200}
                height={200}
                className="rounded-lg object-cover w-full aspect-square group-hover:opacity-50 transition-opacity"
              />
              <div className="grid gap-1 p-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">Apples</h3>
                  <h4 className="font-semibold">$2.99/lb</h4>
                </div>
                <Button
                  variant="outline"
                  className="bg-primary text-primary-foreground w-full"
                >
                  Add to Cart
                </Button>
              </div>
            </div>
            <div className="grid gap-2.5 relative group shadow-lg rounded-lg overflow-hidden hover:shadow-xl transition-shadow">
              <Link href="#" className="absolute inset-0 z-10" prefetch={false}>
                <span className="sr-only">View</span>
              </Link>
              <Image
                src="/placeholder.svg"
                alt="Apples"
                width={200}
                height={200}
                className="rounded-lg object-cover w-full aspect-square group-hover:opacity-50 transition-opacity"
              />
              <div className="grid gap-1 p-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">Apples</h3>
                  <h4 className="font-semibold">$2.99/lb</h4>
                </div>
                <Button
                  variant="outline"
                  className="bg-primary text-primary-foreground w-full"
                >
                  Add to Cart
                </Button>
              </div>
            </div>
            <div className="grid gap-2.5 relative group shadow-lg rounded-lg overflow-hidden hover:shadow-xl transition-shadow">
              <Link href="#" className="absolute inset-0 z-10" prefetch={false}>
                <span className="sr-only">View</span>
              </Link>
              <Image
                src="/placeholder.svg"
                alt="Apples"
                width={200}
                height={200}
                className="rounded-lg object-cover w-full aspect-square group-hover:opacity-50 transition-opacity"
              />
              <div className="grid gap-1 p-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">Apples</h3>
                  <h4 className="font-semibold">$2.99/lb</h4>
                </div>
                <Button
                  variant="outline"
                  className="bg-primary text-primary-foreground w-full"
                >
                  Add to Cart
                </Button>
              </div>
            </div>
            <div className="grid gap-2.5 relative group shadow-lg rounded-lg overflow-hidden hover:shadow-xl transition-shadow">
              <Link href="#" className="absolute inset-0 z-10" prefetch={false}>
                <span className="sr-only">View</span>
              </Link>
              <Image
                src="/placeholder.svg"
                alt="Apples"
                width={200}
                height={200}
                className="rounded-lg object-cover w-full aspect-square group-hover:opacity-50 transition-opacity"
              />
              <div className="grid gap-1 p-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">Apples</h3>
                  <h4 className="font-semibold">$2.99/lb</h4>
                </div>
                <Button
                  variant="outline"
                  className="bg-primary text-primary-foreground w-full"
                >
                  Add to Cart
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="w-full py-6 sm:py-10 md:py-12 lg:py-14">
        <div className="container px-4 md:px-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold sm:text-3xl md:text-4xl">
              Featured Products
            </h2>
            <Link
              href="#"
              className="text-sm font-medium text-primary hover:underline underline-offset-4"
              prefetch={false}
            >
              View All
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 mt-6">
            <div className="grid gap-2.5 relative group shadow-lg rounded-lg overflow-hidden hover:shadow-xl transition-shadow">
              <Link href="#" className="absolute inset-0 z-10" prefetch={false}>
                <span className="sr-only">View</span>
              </Link>
              <Image
                src="/placeholder.svg"
                alt="Apples"
                width={200}
                height={200}
                className="rounded-lg object-cover w-full aspect-square group-hover:opacity-50 transition-opacity"
              />
              <div className="grid gap-1 p-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">Apples</h3>
                  <h4 className="font-semibold">$2.99/lb</h4>
                </div>
                <Button
                  variant="outline"
                  className="bg-primary text-primary-foreground w-full"
                >
                  Add to Cart
                </Button>
              </div>
            </div>
            <div className="grid gap-2.5 relative group shadow-lg rounded-lg overflow-hidden hover:shadow-xl transition-shadow">
              <Link href="#" className="absolute inset-0 z-10" prefetch={false}>
                <span className="sr-only">View</span>
              </Link>
              <Image
                src="/placeholder.svg"
                alt="Apples"
                width={200}
                height={200}
                className="rounded-lg object-cover w-full aspect-square group-hover:opacity-50 transition-opacity"
              />
              <div className="grid gap-1 p-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">Apples</h3>
                  <h4 className="font-semibold">$2.99/lb</h4>
                </div>
                <Button
                  variant="outline"
                  className="bg-primary text-primary-foreground w-full"
                >
                  Add to Cart
                </Button>
              </div>
            </div>
            <div className="grid gap-2.5 relative group shadow-lg rounded-lg overflow-hidden hover:shadow-xl transition-shadow">
              <Link href="#" className="absolute inset-0 z-10" prefetch={false}>
                <span className="sr-only">View</span>
              </Link>
              <Image
                src="/placeholder.svg"
                alt="Apples"
                width={200}
                height={200}
                className="rounded-lg object-cover w-full aspect-square group-hover:opacity-50 transition-opacity"
              />
              <div className="grid gap-1 p-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">Apples</h3>
                  <h4 className="font-semibold">$2.99/lb</h4>
                </div>
                <Button
                  variant="outline"
                  className="bg-primary text-primary-foreground w-full"
                >
                  Add to Cart
                </Button>
              </div>
            </div>
            <div className="grid gap-2.5 relative group shadow-lg rounded-lg overflow-hidden hover:shadow-xl transition-shadow">
              <Link href="#" className="absolute inset-0 z-10" prefetch={false}>
                <span className="sr-only">View</span>
              </Link>
              <Image
                src="/placeholder.svg"
                alt="Apples"
                width={200}
                height={200}
                className="rounded-lg object-cover w-full aspect-square group-hover:opacity-50 transition-opacity"
              />
              <div className="grid gap-1 p-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">Apples</h3>
                  <h4 className="font-semibold">$2.99/lb</h4>
                </div>
                <Button
                  variant="outline"
                  className="bg-primary text-primary-foreground w-full"
                >
                  Add to Cart
                </Button>
              </div>
            </div>
            <div className="grid gap-2.5 relative group shadow-lg rounded-lg overflow-hidden hover:shadow-xl transition-shadow">
              <Link href="#" className="absolute inset-0 z-10" prefetch={false}>
                <span className="sr-only">View</span>
              </Link>
              <Image
                src="/placeholder.svg"
                alt="Apples"
                width={200}
                height={200}
                className="rounded-lg object-cover w-full aspect-square group-hover:opacity-50 transition-opacity"
              />
              <div className="grid gap-1 p-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">Apples</h3>
                  <h4 className="font-semibold">$2.99/lb</h4>
                </div>
                <Button
                  variant="outline"
                  className="bg-primary text-primary-foreground w-full"
                >
                  Add to Cart
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="w-full py-6 sm:py-10 md:py-12 lg:py-14">
        <div className="container px-4 md:px-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold sm:text-3xl md:text-4xl">
              Featured Products
            </h2>
            <Link
              href="#"
              className="text-sm font-medium text-primary hover:underline underline-offset-4"
              prefetch={false}
            >
              View All
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 mt-6">
            <div className="grid gap-2.5 relative group shadow-lg rounded-lg overflow-hidden hover:shadow-xl transition-shadow">
              <Link href="#" className="absolute inset-0 z-10" prefetch={false}>
                <span className="sr-only">View</span>
              </Link>
              <Image
                src="/placeholder.svg"
                alt="Apples"
                width={200}
                height={200}
                className="rounded-lg object-cover w-full aspect-square group-hover:opacity-50 transition-opacity"
              />
              <div className="grid gap-1 p-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">Apples</h3>
                  <h4 className="font-semibold">$2.99/lb</h4>
                </div>
                <Button
                  variant="outline"
                  className="bg-primary text-primary-foreground w-full"
                >
                  Add to Cart
                </Button>
              </div>
            </div>
            <div className="grid gap-2.5 relative group shadow-lg rounded-lg overflow-hidden hover:shadow-xl transition-shadow">
              <Link href="#" className="absolute inset-0 z-10" prefetch={false}>
                <span className="sr-only">View</span>
              </Link>
              <Image
                src="/placeholder.svg"
                alt="Apples"
                width={200}
                height={200}
                className="rounded-lg object-cover w-full aspect-square group-hover:opacity-50 transition-opacity"
              />
              <div className="grid gap-1 p-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">Apples</h3>
                  <h4 className="font-semibold">$2.99/lb</h4>
                </div>
                <Button
                  variant="outline"
                  className="bg-primary text-primary-foreground w-full"
                >
                  Add to Cart
                </Button>
              </div>
            </div>
            <div className="grid gap-2.5 relative group shadow-lg rounded-lg overflow-hidden hover:shadow-xl transition-shadow">
              <Link href="#" className="absolute inset-0 z-10" prefetch={false}>
                <span className="sr-only">View</span>
              </Link>
              <Image
                src="/placeholder.svg"
                alt="Apples"
                width={200}
                height={200}
                className="rounded-lg object-cover w-full aspect-square group-hover:opacity-50 transition-opacity"
              />
              <div className="grid gap-1 p-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">Apples</h3>
                  <h4 className="font-semibold">$2.99/lb</h4>
                </div>
                <Button
                  variant="outline"
                  className="bg-primary text-primary-foreground w-full"
                >
                  Add to Cart
                </Button>
              </div>
            </div>
            <div className="grid gap-2.5 relative group shadow-lg rounded-lg overflow-hidden hover:shadow-xl transition-shadow">
              <Link href="#" className="absolute inset-0 z-10" prefetch={false}>
                <span className="sr-only">View</span>
              </Link>
              <Image
                src="/placeholder.svg"
                alt="Apples"
                width={200}
                height={200}
                className="rounded-lg object-cover w-full aspect-square group-hover:opacity-50 transition-opacity"
              />
              <div className="grid gap-1 p-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">Apples</h3>
                  <h4 className="font-semibold">$2.99/lb</h4>
                </div>
                <Button
                  variant="outline"
                  className="bg-primary text-primary-foreground w-full"
                >
                  Add to Cart
                </Button>
              </div>
            </div>
            <div className="grid gap-2.5 relative group shadow-lg rounded-lg overflow-hidden hover:shadow-xl transition-shadow">
              <Link href="#" className="absolute inset-0 z-10" prefetch={false}>
                <span className="sr-only">View</span>
              </Link>
              <Image
                src="/placeholder.svg"
                alt="Apples"
                width={200}
                height={200}
                className="rounded-lg object-cover w-full aspect-square group-hover:opacity-50 transition-opacity"
              />
              <div className="grid gap-1 p-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">Apples</h3>
                  <h4 className="font-semibold">$2.99/lb</h4>
                </div>
                <Button
                  variant="outline"
                  className="bg-primary text-primary-foreground w-full"
                >
                  Add to Cart
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
