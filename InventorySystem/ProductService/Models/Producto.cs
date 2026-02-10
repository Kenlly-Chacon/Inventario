using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ProductService.Models
{
    [Table("productos")] 
    public class Producto
    {
        [Key]
        [Column("id")]
        public int Id { get; set; }

        [Required]
        [Column("nombre")]
        public string Nombre { get; set; } = string.Empty;

        [Column("descripcion")]
        public string? Descripcion { get; set; }

        [Required]
        [Column("categoria")]
        public string Categoria { get; set; } = string.Empty;

        [Column("imagen")]
        public string? Imagen { get; set; }

        [Required]
        [Column("precio")]
        public decimal Precio { get; set; }

        [Required]
        [Column("stock")]
        public int Stock { get; set; }
    }
}