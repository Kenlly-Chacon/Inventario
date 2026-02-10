export interface Product {
    id: number;
    nombre: string;
    descripcion?: string;
    categoria: string;
    imagen?: string;
    precio: number;
    stock: number;
}

export interface ProductCreateDto {
    nombre: string;
    descripcion?: string;
    categoria: string;
    imagen?: string;
    precio: number;
    stock: number;
}