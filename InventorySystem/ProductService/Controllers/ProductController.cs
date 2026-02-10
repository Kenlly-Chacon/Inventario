using Microsoft.AspNetCore.Mvc;
using ProductService.DTOs;
using ProductService.Services;

namespace ProductService.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductController : ControllerBase
    {
        private readonly IProductService _service;

        public ProductController(IProductService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<ActionResult<ServiceResponse<IEnumerable<ProductoResponseDto>>>> GetAll()
        {
            return Ok(await _service.GetAllAsync());
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ServiceResponse<ProductoResponseDto>>> GetById(int id)
        {
            var response = await _service.GetByIdAsync(id);
            if (!response.Success) return NotFound(response);
            return Ok(response);
        }

        [HttpPost]
        public async Task<ActionResult<ServiceResponse<ProductoResponseDto>>> Create([FromBody] ProductoCreateDto dto)
        {
            var response = await _service.CreateAsync(dto);
            if (!response.Success) return BadRequest(response);
            
            return CreatedAtAction(nameof(GetById), new { id = response.Data!.Id }, response);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<ServiceResponse<ProductoResponseDto>>> Update(int id, [FromBody] ProductoCreateDto dto)
        {
            var response = await _service.UpdateAsync(id, dto);
            if (!response.Success) return NotFound(response);
            return Ok(response);
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult<ServiceResponse<bool>>> Delete(int id)
        {
            var response = await _service.DeleteAsync(id);
            if (!response.Success) return NotFound(response);
            return Ok(response);
        }
    }
}