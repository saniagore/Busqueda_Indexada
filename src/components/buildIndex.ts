import type { Product, SearchIndex } from './types';

const buildSearchIndex = (products: Product[]): SearchIndex => {
    const index: SearchIndex = {};

    products.forEach(product => {
        const text = `${product.title.toLowerCase()} ${product.description.toLowerCase()}`;
        const words = text.split(/\W+/).filter(word => word.length > 0);
        words.forEach(word => {
            if (!index[word]) {
                index[word] = [];
            }
            if (!index[word].includes(product.id)) {
                index[word].push(product.id);
            }
        });
    });

    return index;
};

export default buildSearchIndex;