import { useState, useEffect } from 'react';
import type { Product} from "../models/Product.ts";
import { productService } from '../services/productService';

export const useProducts = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const response = await productService.getAll();
            if (response.success && response.data) {
                setProducts(response.data);
            } else {
                console.error("Error backend:", response.message);
            }
        } catch (error) {
            console.error("Error fetching products", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    return { products, loading, refresh: fetchProducts };
};