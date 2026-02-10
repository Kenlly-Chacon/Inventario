using ProductService.Models;

namespace ProductService.Repositories
{
    public interface IProductRepository
    {
        Task<IEnumerable<Producto>> GetAllAsync();
        Task<Producto?> GetByIdAsync(int id);
        Task AddAsync(Producto producto);
        Task UpdateAsync(Producto producto);
        Task DeleteAsync(int id);
    }
}