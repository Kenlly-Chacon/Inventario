// file: D:/rider c/InventorySystem/TransactionService/DTOs/ServiceResponse.cs
namespace TransactionService.DTOs
{
    public class ServiceResponse<T>
    {
        public T? Data { get; set; }
        public bool Success { get; set; } = true;
        public string Message { get; set; } = string.Empty;
    }
}