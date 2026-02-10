using Microsoft.EntityFrameworkCore;
using TransactionService.Data;
using TransactionService.Models;

namespace TransactionService.Repositories
{
    public class TransactionRepository : ITransactionRepository
    {
        private readonly TransactionDbContext _context;

        public TransactionRepository(TransactionDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Transaccion>> GetAllAsync()
        {
            return await _context.Transacciones
                .OrderByDescending(t => t.Fecha)
                .ToListAsync();
        }

        public async Task<Transaccion?> GetByIdAsync(int id)
        {
            return await _context.Transacciones.FindAsync(id);
        }

        public async Task<IEnumerable<Transaccion>> GetByProductIdAsync(int productId)
        {
            return await _context.Transacciones
                .Where(t => t.ProductoId == productId)
                .OrderByDescending(t => t.Fecha)
                .ToListAsync();
        }

        public async Task AddAsync(Transaccion transaccion)
        {
            await _context.Transacciones.AddAsync(transaccion);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateAsync(Transaccion transaccion)
        {
            _context.Transacciones.Update(transaccion);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteAsync(int id)
        {
            var entity = await _context.Transacciones.FindAsync(id);
            if (entity != null)
            {
                _context.Transacciones.Remove(entity);
                await _context.SaveChangesAsync();
            }
        }
    }
}