export interface Transaction {
    id: number;
    productoId: number;
    fecha: string;
    tipoTransaccion: 'COMPRA' | 'VENTA';
    cantidad: number;
    precioUnitario: number;
    precioTotal: number;
    detalle?: string;
}

export interface TransactionCreateDto {
    productoId: number;
    tipoTransaccion: 'COMPRA' | 'VENTA';
    cantidad: number;
    precioUnitario: number;
    detalle?: string;
}