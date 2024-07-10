'use client';

import { Voucher } from '@/lib/types/voucher';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { getVouchers } from '@/lib/fetch-api/voucher/client';
import { useSuspenseQuery } from '@tanstack/react-query';
import Image from 'next/image';
import { useRef } from 'react';
import Autoplay from 'embla-carousel-autoplay';

export default function CarouselPromo() {
  const vouchers = useSuspenseQuery({
    queryKey: ['carousel-voucher'],
    queryFn: () => getVouchers(),
  });

  if (!vouchers?.data?.vouchers?.length) return null;

  return (
    <section className="w-full py-6 sm:py-10 md:py-12 lg:py-14">
      <div className="container px-4 md:px-6">
        <Carousel
          opts={{
            align: 'start',
            loop: true,
          }}
          plugins={[
            Autoplay({
              delay: 10000,
            }),
          ]}
          className="rounded-lg shadow-lg"
        >
          <CarouselContent>
            {vouchers.data?.vouchers?.map((voucher) => (
              <VoucherItem key={voucher?.id} voucher={voucher} />
            ))}
          </CarouselContent>
          <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/70 p-2 shadow-md hover:bg-white">
            <div className="h-6 w-6 text-muted-foreground" />
          </CarouselPrevious>
          <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/70 p-2 shadow-md hover:bg-white">
            <div className="h-6 w-6 text-muted-foreground" />
          </CarouselNext>
        </Carousel>
      </div>
    </section>
  );
}

export function VoucherItem({ voucher }: { voucher: Voucher }) {
  const discount = voucher?.discount
    ? `${voucher.discount}%`
    : `Rp.${voucher?.fixedDiscount}`;
  return (
    <CarouselItem className='xl:basis-1/2'>
      <div className="group cursor-pointer relative aspect-[2/1] w-full overflow-hidden rounded-lg">
        <Image
          src={voucher?.imageUrl || '/placeholder.svg'}
          alt="Promotion 1"
          fill
          unoptimized
          className="group-hover:scale-110 h-full w-full object-cover rounded-lg transition-transform duration-500 ease-in-out transform hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        <div className="absolute bottom-6 left-6 text-white">
          <h2 className="lg:text-lg font-bold">{voucher?.name}</h2>
          <p className="lg:text-sm">{voucher.description}</p>
        </div>
      </div>
    </CarouselItem>
  );
}
