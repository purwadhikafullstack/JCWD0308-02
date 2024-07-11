import { Product } from '@/lib/types/product';
import Image from 'next/image';
import { Button } from '../ui/button';
import Link from 'next/link';
import { NearestStock } from '@/lib/types/stock';

export function ProductCard({ stock }: { stock: NearestStock }) {
  return (
    <Link
      href={`/products/detail/${stock.product.slug}`}
      className="rounded-xl overflow-hidden border-muted border shadow-xl"
    >
      <Image
        src={stock.product.images[0].imageUrl}
        width={300}
        height={300}
        alt={stock.product.title}
        className="w-full h-48 object-cover"
      />
      <div className="p-4 bg-background flex flex-col justify-between h-auto">
        <Link
          href={`/products/detail/${stock.product.slug}`}
          className="text-lg font-semibold max-h-14 truncate"
        >
          {stock.product.title}
        </Link>
        <p
          className="text-muted-foreground text-sm line-through"
          suppressHydrationWarning
        >
          Rp {stock.product.price?.toLocaleString() ?? 'N/A'}
        </p>
        <div className="flex justify-between items-center mt-2">
          <span className="text-lg font-bold" suppressHydrationWarning>
            Rp {stock.product.discountPrice?.toLocaleString() ?? 'N/A'}
          </span>
          {stock.amount > 0 ? (
            <Button size={'sm'}>View product</Button>
          ) : (
            <Button disabled>Product Out of Stock</Button>
          )}
        </div>
      </div>
    </Link>
  );
}
