import Image from 'next/image';
import { Button } from '../ui/button';
import Link from 'next/link';
import { NearestStock } from '@/lib/types/stock';

export function ProductCard({ stock }: { stock: NearestStock }) {
  return (
    <div className="group relative rounded-xl overflow-hidden border-muted border shadow-xl">
      <Link
        href={`/products/detail/${stock.product.slug}`}
        suppressHydrationWarning
        className="absolute inset-0 z-[5]"
      >
        <span className="sr-only">View</span>
      </Link>
      <Image
        src={stock.product.images[0].imageUrl}
        width={300}
        height={300}
        alt={stock.product.title}
        className="group-hover:scale-110 w-full h-60 object-contain transition-transform duration-500 ease-in-out transform hover:scale-110 "
      />
      <div className="p-4 bg-background flex flex-col justify-between h-auto">
        <h3 className="text-lg font-semibold max-h-14 truncate">
          {stock.product.title}
        </h3>
        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-center mt-2">
            <p
              className="text-muted-foreground text-sm line-through"
              suppressHydrationWarning
            >
              Rp {stock.product.price?.toLocaleString() ?? 'N/A'}
            </p>
            <span className="text-lg font-bold" suppressHydrationWarning>
              Rp {stock.product.discountPrice?.toLocaleString() ?? 'N/A'}
            </span>
          </div>
          {stock.amount > 0 ? (
            <Button size={'sm'}>View product</Button>
          ) : (
            <Button disabled variant={'ghost'}>Product Out of Stock</Button>
          )}
        </div>
      </div>
    </div>
  );
}
