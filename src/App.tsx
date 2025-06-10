// app.tsx
import { useState, useEffect, useMemo } from 'react';
import "./assets/styles.css";
import type { Product, SearchIndex } from "./components/types";
import fetchProducts from './components/fetchProducts';
import buildSearchIndex from './components/buildIndex';

const ProductList = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState<string>('');

  // Construir el índice cuando los productos cambien
  const searchIndex = useMemo<SearchIndex>(() => {
    return buildSearchIndex(products);
  }, [products]);

  useEffect(() => {
    const getProducts = async () => {
      try {
        const data = await fetchProducts();
        setProducts(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    getProducts();
  }, []);

  // Función de búsqueda usando el índice
  const searchProducts = (query: string): Product[] => {
    if (!query.trim()) return [];

    const keywords = query.toLowerCase().split(/\W+/).filter(word => word.length > 0);
    const productIds = new Set<number>();

    keywords.forEach(keyword => {
      if (searchIndex[keyword]) {
        searchIndex[keyword].forEach(id => productIds.add(id));
      }
    });

    return Array.from(productIds)
      .map(id => products.find(p => p.id === id))
      .filter((p): p is Product => p !== undefined);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  const filteredProducts = search ? searchProducts(search) : products;

  return (
    <>
      <nav className="navbar">
        <div className="header">
            <h1>Product List</h1>
            <input
              type="text"
              placeholder="Search products..."
              onChange={(e) => setSearch(e.target.value)}
              value={search}
            />
        </div>
      </nav>
      
      <div>
        <div className="product-grid">
          {filteredProducts.map((product) => (
            <div key={product.id} className="product-card">
              <img 
                src={product.thumbnail} 
                alt={product.title} 
                width={150} 
                height={150} 
                style={{ objectFit: 'cover' }} 
              />
              <div className='product-info'>
                <h3>{product.title}</h3>
                <p>${product.price.toFixed(2)}</p>
                <p>{product.description.substring(0, 50)}...</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default ProductList;