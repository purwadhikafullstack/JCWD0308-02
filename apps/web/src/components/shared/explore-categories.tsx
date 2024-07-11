import { Category } from '@/lib/types/category';
import { ThumbnailCard } from './thumbnail-card';

export function ExploreCategories({ categories }: { categories: Category[] }) {
  if (!categories || !Array.isArray(categories)) {
    return null; 
  }

  return (
    <div className='container'>
      <div className="text-3xl font-bold pb-8">Explore Categories</div>
      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
        {categories.map((category) => (
          <ThumbnailCard
            key={category.id}
            redirectUrl={`/products?categoryId=${category.id}`}
            imageUrl={category.imageUrl!}
            hoverAnim={true}
            text={category.name}
          />
        ))}
      </div>
    </div>
  );
}