using ProductService.DTOs;

namespace ProductService.Services
{
    public interface IProductService
    {
        Task<ServiceResponse<IEnumerable<ProductoResponseDto>>> GetAllAsync();
        Task<ServiceResponse<ProductoResponseDto>> GetByIdAsync(int id);
        Task<ServiceResponse<ProductoResponseDto>> CreateAsync(ProductoCreateDto dto);
        Task<ServiceResponse<ProductoResponseDto>> UpdateAsync(int id, ProductoCreateDto dto);
        Task<ServiceResponse<bool>> DeleteAsync(int id);
    }
}