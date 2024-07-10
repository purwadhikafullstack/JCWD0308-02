import FeaturedProducts from './_components/featured-products';
import CarouselPromo from './_components/carousel-vouchers';
import { ExploreCategories } from '@/components/shared/explore-categories';
import { getCategory } from '@/lib/fetch-api/category/server';
import { WhyGrosirun } from './_components/why-section';
import PopularProducts from './_components/popular-products';

export default async function Home() {
  const categories = await getCategory();
  return (
    <main className="flex-1">
      <CarouselPromo />
      <ExploreCategories categories={categories.categories} />
      <PopularProducts/>
      <FeaturedProducts />
      <WhyGrosirun />
    </main>
  );
}
