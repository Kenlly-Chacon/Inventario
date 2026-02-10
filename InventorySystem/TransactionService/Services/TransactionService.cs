using System.Text;
using System.Text.Json;
using TransactionService.DTOs;
using TransactionService.Models;
using TransactionService.Repositories;

namespace TransactionService.Services
{
    public class TransactionService : ITransactionService
    {
        private readonly ITransactionRepository _repository;
        private readonly IHttpClientFactory _httpClientFactory;

        public TransactionService(ITransactionRepository repository, IHttpClientFactory httpClientFactory)
        {
            _repository = repository;
            _httpClientFactory = httpClientFactory;
        }

        public async Task<ServiceResponse<IEnumerable<TransaccionResponseDto>>> GetAllAsync()
        {
            var response = new ServiceResponse<IEnumerable<TransaccionResponseDto>>();
            var data = await _repository.GetAllAsync();
            response.Data = data.Select(MapToDto);
            response.Message = "Transacciones obtenidas exitosamente.";
            return response;
        }

        public async Task<ServiceResponse<TransaccionResponseDto>> GetByIdAsync(int id)
        {
            var response = new ServiceResponse<TransaccionResponseDto>();
            var entity = await _repository.GetByIdAsync(id);
            if (entity == null)
            {
                response.Success = false;
                response.Message = "Transacción no encontrada.";
            }
            else
            {
                response.Data = MapToDto(entity);
                response.Message = "Transacción encontrada.";
            }
            return response;
        }

        public async Task<ServiceResponse<IEnumerable<TransaccionResponseDto>>> GetByProductIdAsync(int productId)
        {
            var response = new ServiceResponse<IEnumerable<TransaccionResponseDto>>();
            var data = await _repository.GetByProductIdAsync(productId);
            response.Data = data.Select(MapToDto);
            response.Message = $"Transacciones del producto {productId} obtenidas.";
            return response;
        }

        public async Task<ServiceResponse<TransaccionResponseDto>> CreateAsync(TransaccionCreateDto dto)
        {
            var response = new ServiceResponse<TransaccionResponseDto>();
            try
            {
                var client = _httpClientFactory.CreateClient();
                var productServiceUrl = "http://localhost:5299/api/Product"; // Ajustar puerto si cambia

                var responseGet = await client.GetAsync($"{productServiceUrl}/{dto.ProductoId}");
                if (!responseGet.IsSuccessStatusCode)
                {
                    response.Success = false;
                    response.Message = $"El producto con ID {dto.ProductoId} no existe.";
                    return response;
                }

                var jsonString = await responseGet.Content.ReadAsStringAsync();
                var options = new JsonSerializerOptions { PropertyNameCaseInsensitive = true };
                
                var wrapper = JsonSerializer.Deserialize<ServiceResponse<ExternalProductDto>>(jsonString, options);
                var producto = wrapper?.Data;

                if (producto == null)
                {
                    response.Success = false;
                    response.Message = "Error al obtener datos del producto remoto.";
                    return response;
                }

                if (dto.TipoTransaccion == "COMPRA")
                {
                    producto.Stock += dto.Cantidad;
                }
                else if (dto.TipoTransaccion == "VENTA")
                {
                    if (producto.Stock < dto.Cantidad)
                    {
                        // AQUÍ se cumple el criterio de mensaje claro por stock insuficiente
                        response.Success = false;
                        response.Message = $"Stock insuficiente. Stock actual: {producto.Stock}, solicitado: {dto.Cantidad}.";
                        return response;
                    }
                    producto.Stock -= dto.Cantidad;
                }

                var content = new StringContent(JsonSerializer.Serialize(producto), Encoding.UTF8, "application/json");
                var responsePut = await client.PutAsync($"{productServiceUrl}/{dto.ProductoId}", content);

                if (!responsePut.IsSuccessStatusCode)
                {
                    response.Success = false;
                    response.Message = "Error al comunicarse con ProductService para actualizar el stock.";
                    return response;
                }

                var entity = new Transaccion
                {
                    ProductoId = dto.ProductoId,
                    TipoTransaccion = dto.TipoTransaccion,
                    Cantidad = dto.Cantidad,
                    PrecioUnitario = dto.PrecioUnitario,
                    Detalle = dto.Detalle,
                    Fecha = DateTime.UtcNow,
                    PrecioTotal = dto.Cantidad * dto.PrecioUnitario
                };

                await _repository.AddAsync(entity);
                
                response.Data = MapToDto(entity);
                response.Message = "Transacción registrada exitosamente y stock actualizado.";
            }
            catch (Exception ex)
            {
                response.Success = false;
                response.Message = $"Error interno al crear transacción: {ex.Message}";
            }

            return response;
        }

        public async Task<ServiceResponse<TransaccionResponseDto>> UpdateAsync(int id, TransaccionCreateDto dto)
        {
            var response = new ServiceResponse<TransaccionResponseDto>();
            var entity = await _repository.GetByIdAsync(id);

            if (entity == null)
            {
                response.Success = false;
                response.Message = "No se encontró la transacción para editar.";
                return response;
            }

            entity.ProductoId = dto.ProductoId;
            entity.TipoTransaccion = dto.TipoTransaccion;
            entity.Cantidad = dto.Cantidad;
            entity.PrecioUnitario = dto.PrecioUnitario;
            entity.Detalle = dto.Detalle;
            entity.PrecioTotal = dto.Cantidad * dto.PrecioUnitario;

            await _repository.UpdateAsync(entity);

            response.Data = MapToDto(entity);
            response.Message = "Transacción actualizada exitosamente.";
            return response;
        }

        public async Task<ServiceResponse<bool>> DeleteAsync(int id)
        {
            var response = new ServiceResponse<bool>();
            var existing = await _repository.GetByIdAsync(id);
            if (existing == null)
            {
                response.Success = false;
                response.Message = "Transacción no encontrada para eliminar.";
                response.Data = false;
            }
            else
            {
                await _repository.DeleteAsync(id);
                response.Data = true;
                response.Message = "Transacción eliminada correctamente.";
            }
            return response;
        }

        private static TransaccionResponseDto MapToDto(Transaccion t)
        {
            return new TransaccionResponseDto
            {
                Id = t.Id,
                ProductoId = t.ProductoId,
                TipoTransaccion = t.TipoTransaccion,
                Fecha = t.Fecha,
                Cantidad = t.Cantidad,
                PrecioUnitario = t.PrecioUnitario,
                PrecioTotal = t.PrecioTotal,
                Detalle = t.Detalle
            };
        }
    }
}