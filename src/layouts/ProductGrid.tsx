import React from "react";
import ProductCard from "../components/organisms/ProductCard";

interface Product {
  image: string;
  name: string;
  price: string | number;
}

interface ProductGridProps {
  products: Product[];
}

const ProductGrid: React.FC<ProductGridProps> = ({ products }) => (
  <div className="w-full flex justify-center">
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
      {products.map((product) => (
        <ProductCard
          key={product.name}
          image={product.image}
          name={product.name}
          price={product.price}
        />
      ))}
    </div>
  </div>
);

export default ProductGrid;