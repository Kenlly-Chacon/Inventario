using System.ComponentModel.DataAnnotations;

namespace TransactionService.DTOs
{
    public class TransaccionCreateDto
    {
        [Required]
        public int ProductoId { get; set; }

        [Required]
        [RegularExpression("COMPRA|VENTA", ErrorMessage = "El tipo debe ser 'COMPRA' o 'VENTA'")]
        public string TipoTransaccion { get; set; } = string.Empty;

        [Range(1, int.MaxValue, ErrorMessage = "La cantidad debe ser mayor a 0")]
        public int Cantidad { get; set; }

        [Range(0, double.MaxValue, ErrorMessage = "El precio unitario no puede ser negativo")]
        public decimal PrecioUnitario { get; set; }

        public string? Detalle { get; set; }
    }

    public class TransaccionResponseDto : TransaccionCreateDto
    {
        public int Id { get; set; }
        public DateTime Fecha { get; set; }
        public decimal PrecioTotal { get; set; }
    }
}