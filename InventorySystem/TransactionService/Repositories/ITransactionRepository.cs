using TransactionService.Models;

namespace TransactionService.Repositories
{
    public interface ITransactionRepository
    {
        Task<IEnumerable<Transaccion>> GetAllAsync();
        Task<Transaccion?> GetByIdAsync(int id);
        Task<IEnumerable<Transaccion>> GetByProductIdAsync(int productId);
        Task AddAsync(Transaccion transaccion);
        Task UpdateAsync(Transaccion transaccion);
        Task DeleteAsync(int id);
    }
}