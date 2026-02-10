// file: D:/rider c/InventorySystem/ProductService/Services/ProductService.cs
using ProductService.DTOs;
using ProductService.Models;
using ProductService.Repositories;

namespace ProductService.Services
{
    public class ProductService : IProductService
    {
        private readonly IProductRepository _repository;

        public ProductService(IProductRepository repository)
        {
            _repository = repository;
        }

        public async Task<ServiceResponse<IEnumerable<ProductoResponseDto>>> GetAllAsync()
        {
            var response = new ServiceResponse<IEnumerable<ProductoResponseDto>>();
            try
            {
                var productos = await _repository.GetAllAsync();
                response.Data = productos.Select(p => new ProductoResponseDto
                {
                    Id = p.Id, Nombre = p.Nombre, Descripcion = p.Descripcion,
                    Categoria = p.Categoria, Imagen = p.Imagen, Precio = p.Precio, Stock = p.Stock
                });
                response.Message = "Lista de productos obtenida exitosamente.";
            }
            catch (Exception ex)
            {
                response.Success = false;
                response.Message = "Error al obtener productos: " + ex.Message;
            }
            return response;
        }

        public async Task<ServiceResponse<ProductoResponseDto>> GetByIdAsync(int id)
        {
            var response = new ServiceResponse<ProductoResponseDto>();
            var p = await _repository.GetByIdAsync(id);

            if (p == null)
            {
                response.Success = false;
                response.Message = "Producto no encontrado.";
            }
            else
            {
                response.Data = new ProductoResponseDto
                {
                    Id = p.Id, Nombre = p.Nombre, Descripcion = p.Descripcion,
                    Categoria = p.Categoria, Imagen = p.Imagen, Precio = p.Precio, Stock = p.Stock
                };
                response.Message = "Producto encontrado.";
            }
            return response;
        }

        public async Task<ServiceResponse<ProductoResponseDto>> CreateAsync(ProductoCreateDto dto)
        {
            var response = new ServiceResponse<ProductoResponseDto>();
            try
            {
                var producto = new Producto
                {
                    Nombre = dto.Nombre, Descripcion = dto.Descripcion, Categoria = dto.Categoria,
                    Imagen = dto.Imagen, Precio = dto.Precio, Stock = dto.Stock
                };

                await _repository.AddAsync(producto);

                response.Data = new ProductoResponseDto
                {
                    Id = producto.Id, Nombre = producto.Nombre, Descripcion = producto.Descripcion,
                    Categoria = producto.Categoria, Imagen = producto.Imagen, Precio = producto.Precio, Stock = producto.Stock
                };
                response.Message = "Producto creado exitosamente.";
            }
            catch (Exception ex)
            {
                response.Success = false;
                response.Message = "Error al crear el producto: " + ex.Message;
            }
            return response;
        }

        public async Task<ServiceResponse<ProductoResponseDto>> UpdateAsync(int id, ProductoCreateDto dto)
        {
            var response = new ServiceResponse<ProductoResponseDto>();
            var producto = await _repository.GetByIdAsync(id);

            if (producto == null)
            {
                response.Success = false;
                response.Message = "Producto no encontrado para actualizar.";
                return response;
            }

            producto.Nombre = dto.Nombre;
            producto.Descripcion = dto.Descripcion;
            producto.Categoria = dto.Categoria;
            producto.Imagen = dto.Imagen;
            producto.Precio = dto.Precio;
            producto.Stock = dto.Stock;

            await _repository.UpdateAsync(producto);

            response.Data = new ProductoResponseDto
            {
                Id = producto.Id, Nombre = producto.Nombre, Descripcion = producto.Descripcion,
                Categoria = producto.Categoria, Imagen = producto.Imagen, Precio = producto.Precio, Stock = producto.Stock
            };
            response.Message = "Producto actualizado exitosamente.";
            return response;
        }

        public async Task<ServiceResponse<bool>> DeleteAsync(int id)
        {
            var response = new ServiceResponse<bool>();
            var producto = await _repository.GetByIdAsync(id);

            if (producto == null)
            {
                response.Success = false;
                response.Message = "Producto no encontrado para eliminar.";
                response.Data = false;
            }
            else
            {
                await _repository.DeleteAsync(id);
                response.Data = true;
                response.Message = "Producto eliminado exitosamente.";
            }
            return response;
        }
    }
}