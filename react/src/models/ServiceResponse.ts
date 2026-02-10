// file: src/models/ServiceResponse.ts
export interface ServiceResponse<T> {
    data: T;
    success: boolean;
    message: string;
}