export interface Product {
    id: number;
    title: string;
    price: number;
    description: string;
    thumbnail: string;
}

export interface ApiResponse {
    products: Product[];
    total: number;
    skip: number;
    limit: number;
}

export type SearchIndex = {
    [keyword: string]: number[];
};
