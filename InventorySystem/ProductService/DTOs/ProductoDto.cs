using System.ComponentModel.DataAnnotations;

namespace ProductService.DTOs
{
    public class ProductoCreateDto
    {
        [Required(ErrorMessage = "El nombre es obligatorio")]
        public string Nombre { get; set; } = string.Empty;

        public string? Descripcion { get; set; }

        [Required(ErrorMessage = "La categoría es obligatoria")]
        public string Categoria { get; set; } = string.Empty;

        public string? Imagen { get; set; }

        [Range(0, double.MaxValue, ErrorMessage = "El precio debe ser mayor a 0")]
        public decimal Precio { get; set; }

        [Range(0, int.MaxValue, ErrorMessage = "El stock no puede ser negativo")]
        public int Stock { get; set; }
    }

    public class ProductoResponseDto : ProductoCreateDto
    {
        public int Id { get; set; }
    }
}