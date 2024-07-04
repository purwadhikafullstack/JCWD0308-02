
import FeaturedProducts from './_components/featured-products';
import CarouselPromo from './_components/carousel-vouchers';

export default function Home() {
  return (
    <main className="flex-1">

      <CarouselPromo />
      <FeaturedProducts />
    </main>
  );
}
