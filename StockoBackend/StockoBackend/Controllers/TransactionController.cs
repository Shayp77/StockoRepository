using Microsoft.AspNetCore.Mvc;
using StockoBackend.Model;
using StockoBackend.Data;
using System.Linq;
using System.Threading.Tasks;
using System;

namespace StockoBackend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TransactionController : ControllerBase
    {
        private readonly AppDBContext _context;

        public TransactionController(AppDBContext context)
        {
            _context = context;
        }

        [HttpPost("addtocart")]
        public async Task<IActionResult> AddToCart([FromBody] CartDTO cartDto)
        {
            if (cartDto == null)
            {
                return BadRequest("Cart data is null.");
            }

            var cart = new Cart
            {
                UserID = cartDto.UserID,
                ItemID = cartDto.ItemID,
                ItemName = cartDto.ItemName,
                ItemPrice = cartDto.ItemPrice,
                Quantity = cartDto.Quantity
            };

            _context.Carts.Add(cart);
            await _context.SaveChangesAsync();

            return Ok(cart);
        }

        [HttpGet("getcarts/{userId}")]
        public IActionResult GetCarts(int userId)
        {
            var carts = _context.Carts.Where(c => c.UserID == userId).ToList();
            return Ok(carts);
        }

        [HttpDelete("deletecart/{cartId}")]
        public async Task<IActionResult> DeleteCart(int cartId)
        {
            var cart = await _context.Carts.FindAsync(cartId);
            if (cart == null)
            {
                return NotFound();
            }

            _context.Carts.Remove(cart);
            await _context.SaveChangesAsync();

            return Ok();
        }

        [HttpDelete("deleteallcarts/{userId}")]
        public async Task<IActionResult> DeleteAllCarts(int userId)
        {
            var carts = _context.Carts.Where(c => c.UserID == userId);
            if (!carts.Any())
            {
                return NotFound();
            }

            _context.Carts.RemoveRange(carts);
            await _context.SaveChangesAsync();

            return Ok();
        }

        [HttpPost("addtransaction")]
        public async Task<IActionResult> AddTransaction([FromBody] TransactionDTO transactionDto)
        {
            if (transactionDto == null)
            {
                return BadRequest("Transaction data is null.");
            }

            var transactionHeader = new TransactionHeader
            {
                UserID = transactionDto.UserID,
                TransactionDate = DateTime.UtcNow,
                TotalPrice = transactionDto.TotalPrice
            };

            _context.TransactionHeaders.Add(transactionHeader);
            await _context.SaveChangesAsync();

            return Ok(transactionHeader);
        }

        [HttpPost("addtransactiondetails")]
        public async Task<IActionResult> AddTransactionDetails([FromBody] IEnumerable<DetailDTO> transactionDetails)
        {
            if (transactionDetails == null || !transactionDetails.Any())
            {
                return BadRequest("Transaction details data is null or empty.");
            }
            var transactionEntities = transactionDetails.Select(dto => new TransactionDetail
            {
                TransactionID = dto.TransactionID,
                ItemID = dto.ItemID,
                Quantity = dto.Quantity,
                price = dto.price,
                Totalamount = dto.Totalamount
            });

            _context.TransactionDetails.AddRange(transactionEntities);
            await _context.SaveChangesAsync();

            return Ok(transactionEntities);
        }

        [HttpGet("transactions")]
        public IActionResult GetTransactions(DateTime? from, DateTime? to)
        {
            var transactions = _context.TransactionHeaders.AsQueryable();

            if (from.HasValue)
            {
                transactions = transactions.Where(t => t.TransactionDate >= from.Value);
            }

            if (to.HasValue)
            {
                transactions = transactions.Where(t => t.TransactionDate <= to.Value);
            }

            return Ok(transactions.ToList());
        }

        [HttpGet("transactiondetails/{transactionId}")]
        public IActionResult GetTransactionDetails(int transactionId)
        {
            var details = _context.TransactionDetails
                .Where(td => td.TransactionID == transactionId)
                .ToList();

            if (details == null)
            {
                return NotFound();
            }

            return Ok(details);
        }

        [HttpDelete("deletetransaction/{transactionId}")]
        public async Task<IActionResult> DeleteTransaction(int transactionId)
        {
            var transactionHeader = await _context.TransactionHeaders.FindAsync(transactionId);
            if (transactionHeader == null)
            {
                return NotFound();
            }

            var transactionDetails = _context.TransactionDetails
                .Where(td => td.TransactionID == transactionId);

            _context.TransactionDetails.RemoveRange(transactionDetails);
            _context.TransactionHeaders.Remove(transactionHeader);
            await _context.SaveChangesAsync();

            return Ok();
        }
    }
}
