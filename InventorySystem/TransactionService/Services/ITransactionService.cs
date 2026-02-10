using TransactionService.DTOs;

namespace TransactionService.Services
{
    public interface ITransactionService
    {
        Task<ServiceResponse<IEnumerable<TransaccionResponseDto>>> GetAllAsync();
        Task<ServiceResponse<TransaccionResponseDto>> GetByIdAsync(int id);
        Task<ServiceResponse<IEnumerable<TransaccionResponseDto>>> GetByProductIdAsync(int productId);
        Task<ServiceResponse<TransaccionResponseDto>> CreateAsync(TransaccionCreateDto dto);
        Task<ServiceResponse<TransaccionResponseDto>> UpdateAsync(int id, TransaccionCreateDto dto); // Agregado para cumplir criterio
        Task<ServiceResponse<bool>> DeleteAsync(int id); 
    }
}