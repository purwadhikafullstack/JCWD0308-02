import React from 'react';
import { Product } from '@/lib/types/product';
import ProductCard from '../card/ProductCard';

interface ProductTableProps {
  products: Product[];
  onTitleClick: (id: string) => void;
}

const ProductTable: React.FC<ProductTableProps> = ({ products, onTitleClick }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
    {products.map((product) => (
      <ProductCard
        key={product.id}
        product={product}
        onTitleClick={() => onTitleClick(product.id)}
      />
    ))}
  </div>
);

export default ProductTable;
