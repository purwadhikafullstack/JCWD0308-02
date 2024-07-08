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

export default function CarouselPromo() {
  const vouchers = useSuspenseQuery({
    queryKey: ['carousel-voucher'],
    queryFn: () => getVouchers(),
  });

  if (!vouchers?.data?.vouchers?.length) return null;

  return (
    <section className="w-full py-6 sm:py-10 md:py-12 lg:py-14">
      <div className="container px-4 md:px-6">
        <Carousel className="rounded-lg shadow-lg">
          <CarouselContent>
            {vouchers.data?.vouchers?.map((voucher) => (
              <VoucherItem key={voucher?.id} voucher={voucher} />
            ))}
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
  );
}

export function VoucherItem({ voucher }: { voucher: Voucher }) {
  const discount = voucher?.discount
    ? `${voucher.discount}%`
    : `Rp.${voucher?.fixedDiscount}`;
  return (
    <CarouselItem>
      <div className="relative h-[400px] w-full overflow-hidden rounded-lg">
        <Image
          src={voucher?.imageUrl || '/placeholder.svg'}
          alt="Promotion 1"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        <div className="absolute bottom-6 left-6 text-white">
          <h2 className="text-2xl font-bold">{voucher?.name}</h2>
          <p className="text-lg">Up to {discount} off on selected items</p>
        </div>
      </div>
    </CarouselItem>
  );
}
