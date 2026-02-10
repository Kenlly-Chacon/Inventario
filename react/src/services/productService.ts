import { productApi } from './api';
import type { Product, ProductCreateDto } from '../models/Product';
import type { ServiceResponse } from '../models/ServiceResponse';

export const productService = {
    getAll: async () =>
        (await productApi.get<ServiceResponse<Product[]>>('')).data,

    getById: async (id: number) =>
        (await productApi.get<ServiceResponse<Product>>(`/${id}`)).data,

    create: async (data: ProductCreateDto) =>
        (await productApi.post<ServiceResponse<Product>>('', data)).data,

    update: async (id: number, data: ProductCreateDto) =>
        (await productApi.put<ServiceResponse<Product>>(`/${id}`, data)).data,

    delete: async (id: number) =>
        (await productApi.delete<ServiceResponse<boolean>>(`/${id}`)).data
};