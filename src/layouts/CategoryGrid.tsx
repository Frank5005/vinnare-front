import React from "react";
import CategoryCard from "../components/ui/CategoryCard";

interface Category {
  image: string;
  name: string;
}

interface CategoryGridProps {
  categories: Category[];
}

const CategoryGrid: React.FC<CategoryGridProps> = ({ categories }) => (
  <div className="w-full flex justify-center">
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
      {categories.map((cat) => (
        <CategoryCard key={cat.name} image={cat.image} name={cat.name} />
      ))}
    </div>
  </div>
);

export default CategoryGrid;