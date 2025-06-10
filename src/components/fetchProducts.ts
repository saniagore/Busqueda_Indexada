import type { Product,ApiResponse } from './types';

const fetchAllProducts = async (
  totalDesired: number = 1000,
  limitPerRequest: number = 200
): Promise<Product[]> => {
  try {
    const allProducts: Product[] = [];
    const requestsNeeded = Math.ceil(totalDesired / limitPerRequest);

    for (let i = 0; i < requestsNeeded; i++) {
      const skip = i * limitPerRequest;
      const response = await fetch(
        `https://dummyjson.com/products?limit=${limitPerRequest}&skip=${skip}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: ApiResponse = await response.json();
      allProducts.push(...data.products);
      if (data.products.length < limitPerRequest) break;
    }

    return allProducts.slice(0, totalDesired);
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
};

export default fetchAllProducts;