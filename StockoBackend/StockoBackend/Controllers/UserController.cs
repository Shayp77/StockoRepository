using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using StockoBackend.Data;
using StockoBackend.Model;

namespace StockoBackend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly AppDBContext _context;
        public UserController(AppDBContext context)
        {
            _context = context;
        }
        [HttpPost("register")]
        public async Task<IActionResult> Register(UserRegisterDto request)
        {
            if (await _context.Users.AnyAsync(u => u.UserEmail == request.UserEmail))
            {
                return BadRequest("User already exists");
            }
            var user = new User
            {
                UserEmail = request.UserEmail,
                name = request.Name,
                UserPassword = request.UserPassword,
                UserPhone = request.UserPhone,
                Username = request.Name,
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return StatusCode(200, user);
        }
        [HttpPost("login")]
        public async Task<IActionResult> Login(UserLoginDto request)
        {
            // Retrieve user by email
            var user = await _context.Users.FirstOrDefaultAsync(u => u.UserEmail == request.UserEmail);

            if (user == null)
            {
                return BadRequest("User not found");
            }

            // Verify password
            if (!VerifyPassword(request.UserPassword, user.UserPassword))
            {
                return BadRequest("Incorrect password");
            }

            return StatusCode(200, user);
        }
        private bool VerifyPassword(string password, string hashedPassword)
        {
            // Implement password verification (compare hashed passwords)
            // For simplicity, let's just compare plain passwords (not secure in production)
            return password == hashedPassword;
        }
        // UserController.cs
        [HttpGet("notifications")]
        public async Task<IActionResult> GetNotifications()
        {
            var expiringItems = await _context.Items
                .Where(i => i.ExpirationDate != null && i.ExpirationDate <= DateTime.UtcNow.AddDays(7))
                .ToListAsync();

            var lowStockItems = await _context.Items
                .Where(i => i.ItemQuantity <= 10)
                .ToListAsync();

            return Ok(new { expiringItems, lowStockItems });
        }

    }
}
