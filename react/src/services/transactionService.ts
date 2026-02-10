import { transactionApi } from './api';
import type { Transaction, TransactionCreateDto } from '../models/Transaction';
import type { ServiceResponse } from '../models/ServiceResponse';

export const transactionService = {
    getAll: async () =>
        (await transactionApi.get<ServiceResponse<Transaction[]>>('')).data,

    getByProduct: async (productId: number) =>
        (await transactionApi.get<ServiceResponse<Transaction[]>>(`/producto/${productId}`)).data,

    create: async (data: TransactionCreateDto) =>
        (await transactionApi.post<ServiceResponse<Transaction>>('', data)).data,

    update: async (id: number, data: TransactionCreateDto) =>
        (await transactionApi.put<ServiceResponse<Transaction>>(`/${id}`, data)).data,

    delete: async (id: number) =>
        (await transactionApi.delete<ServiceResponse<boolean>>(`/${id}`)).data
};