import React, { useState, useRef, useEffect } from 'react';
import { FaSearch } from 'react-icons/fa';
import { useProductSearch } from '../../hooks/useProductSearch';
import { useNavigate } from 'react-router-dom';

export const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const { products, loading } = useProductSearch(searchTerm);
  const navigate = useNavigate();
  const wrapperRef = useRef<HTMLDivElement>(null);


  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setIsOpen(true);
  };

  const handleProductClick = (productId: number) => {
    setIsOpen(false);
    setSearchTerm('');
    navigate(`/products/${productId}`);
  };

  return (
    <div ref={wrapperRef} className="relative w-full max-w-xl">
      <div className="flex items-center bg-white rounded-lg px-4 py-2">
        <FaSearch className="text-gray-400 mr-2" />
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearch}
          placeholder="Search products..."
          className="w-full bg-transparent outline-none text-sm"
        />
      </div>


      {isOpen && searchTerm.length >= 2 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
          {loading ? (
            <div className="p-4 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
            </div>
          ) : products.length > 0 ? (
            <div className="py-2">
              {products.map((product) => (
                <div
                  key={product.id}
                  className="flex items-center px-4 py-3 hover:bg-gray-50 cursor-pointer"
                  onClick={() => handleProductClick(product.id)}
                >
                  <img
                    src={product.image}
                    alt={product.title}
                    className="w-12 h-12 object-cover rounded"
                  />
                  <div className="ml-4 flex-1">
                    <h4 className="text-sm font-medium text-gray-900">{product.title}</h4>
                    <p className="text-sm text-gray-500">${product.price.toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-4 text-center text-gray-500">
              No products found
            </div>
          )}
        </div>
      )}
    </div>
  );
}; 