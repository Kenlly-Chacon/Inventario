import axios from 'axios';

export const productApi = axios.create({
    baseURL: 'http://localhost:5299/api/Product'
});

export const transactionApi = axios.create({
    baseURL: 'http://localhost:5160/api/Transaction'
});