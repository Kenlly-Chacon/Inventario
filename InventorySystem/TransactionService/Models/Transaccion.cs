using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TransactionService.Models
{
    [Table("transacciones")]
    public class Transaccion
    {
        [Key]
        [Column("id")]
        public int Id { get; set; }

        [Required]
        [Column("producto_id")]
        public int ProductoId { get; set; }

        [Column("fecha")]
        public DateTime Fecha { get; set; }

        [Required]
        [Column("tipo_transaccion")]
        public string TipoTransaccion { get; set; } = string.Empty; 

        [Required]
        [Column("cantidad")]
        public int Cantidad { get; set; }

        [Required]
        [Column("precio_unitario")]
        public decimal PrecioUnitario { get; set; }

        [Required]
        [Column("precio_total")]
        public decimal PrecioTotal { get; set; }

        [Column("detalle")]
        public string? Detalle { get; set; }
    }
}