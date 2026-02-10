using Microsoft.AspNetCore.Mvc;
using TransactionService.DTOs;
using TransactionService.Services;

namespace TransactionService.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TransactionController : ControllerBase
    {
        private readonly ITransactionService _service;

        public TransactionController(ITransactionService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<ActionResult<ServiceResponse<IEnumerable<TransaccionResponseDto>>>> GetAll()
        {
            return Ok(await _service.GetAllAsync());
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ServiceResponse<TransaccionResponseDto>>> GetById(int id)
        {
            var response = await _service.GetByIdAsync(id);
            if (!response.Success) return NotFound(response);
            return Ok(response);
        }

        [HttpGet("producto/{productId}")]
        public async Task<ActionResult<ServiceResponse<IEnumerable<TransaccionResponseDto>>>> GetByProduct(int productId)
        {
            return Ok(await _service.GetByProductIdAsync(productId));
        }

        [HttpPost]
        public async Task<ActionResult<ServiceResponse<TransaccionResponseDto>>> Create([FromBody] TransaccionCreateDto dto)
        {
            var response = await _service.CreateAsync(dto);
            
            if (!response.Success)
            {
                return BadRequest(response);
            }
            
            return CreatedAtAction(nameof(GetById), new { id = response.Data!.Id }, response);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<ServiceResponse<TransaccionResponseDto>>> Update(int id, [FromBody] TransaccionCreateDto dto)
        {
            var response = await _service.UpdateAsync(id, dto);
            if (!response.Success) return NotFound(response);
            return Ok(response);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var response = await _service.DeleteAsync(id);
            if (!response.Success) return NotFound(response);
            return Ok(response);
        }
    }
}