using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using StockoBackend.Data;
using StockoBackend.Model;
using System;
using System.Collections.Generic;
using System.Linq;

namespace StockoBackend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ItemController : ControllerBase
    {
        private readonly AppDBContext _context;

        public ItemController(AppDBContext context)
        {
            _context = context;
        }

        [HttpGet("getallitems")]
        public ActionResult<IEnumerable<Item>> GetAllItems()
        {
            var items = _context.Items.ToList();
            return Ok(items);
        }

        [HttpPost("additem")]
        public IActionResult AddItem([FromBody] ItemDto itemDto)
        {
            if (itemDto == null)
            {
                return BadRequest("Item data is null.");
            }

            var item = new Item
            {
                ItemName = itemDto.ItemName,
                ItemPrice = itemDto.ItemPrice,
                ItemWeight = itemDto.ItemWeight,
                ItemQuantity = itemDto.ItemQuantity,
                ItemSupplier = itemDto.ItemSupplier,
                ItemTypeID= itemDto.ItemTypeID,
                ExpirationDate = itemDto.ExpirationDate
            };

            try
            {
                _context.Items.Add(item);
                _context.SaveChanges();

                // Gunakan CreatedAtAction jika ingin memberikan informasi lebih detail
                return CreatedAtAction(nameof(GetItem), new { id = item.ItemID }, item);
            }
            catch (Exception ex)
            {
                // Untuk debug, bisa mencetak ex.Message atau ex.StackTrace
                Console.WriteLine(ex.Message);
                return StatusCode(500, "Failed to add item.");
            }
        }

        // Contoh metode untuk mendapatkan item berdasarkan ID
        [HttpGet("{id}")]
        public ActionResult<Item> GetItem(int id)
        {
            var item = _context.Items.FirstOrDefault(i => i.ItemID == id);
            if (item == null)
            {
                return NotFound();
            }
            return item;
        }
        [HttpPut("updateitem/{id}")]
        public IActionResult UpdateItem(int id, [FromBody] ItemDto itemDto)
        {
            if (itemDto == null)
            {
                return BadRequest("Item data is null.");
            }

            var item = _context.Items.FirstOrDefault(i => i.ItemID == id);
            if (item == null)
            {
                return NotFound("Item not found.");
            }

            item.ItemName = itemDto.ItemName;
            item.ItemPrice = itemDto.ItemPrice;
            item.ItemWeight = itemDto.ItemWeight;
            item.ItemQuantity = itemDto.ItemQuantity;
            item.ItemSupplier = itemDto.ItemSupplier;
            item.ItemTypeID = itemDto.ItemTypeID;
            item.ExpirationDate = itemDto.ExpirationDate;

            try
            {
                _context.Items.Update(item);
                _context.SaveChanges();
                return Ok(item);
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return StatusCode(500, "Failed to update item.");
            }
        }

        [HttpDelete("deleteitem/{id}")]
        public IActionResult DeleteItem(int id)
        {
            var item = _context.Items.FirstOrDefault(i => i.ItemID == id);
            if (item == null)
            {
                return NotFound("Item not found.");
            }

            try
            {
                _context.Items.Remove(item);
                _context.SaveChanges();
                return NoContent();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return StatusCode(500, "Failed to delete item.");
            }
        }
        [HttpGet("getallitemtypes")]
        public ActionResult<IEnumerable<ItemType>> GetAllItemTypes()
        {
            var itemTypes = _context.ItemTypes.ToList();
            return Ok(itemTypes);
        }
        [HttpPost("addcategory")]
        public IActionResult AddCategory([FromBody] TypeDto typedto)
        {
            if (typedto == null)
            {
                return BadRequest("Category data is null.");
            }

            try
            {
                var itemType = new ItemType { ItemTypeName = typedto.ItemTypeName };
                _context.ItemTypes.Add(itemType);
                _context.SaveChanges();
                return StatusCode(200, "Success");
            }
            catch (DbUpdateException ex)
            {
                Console.WriteLine(ex.Message);
                return StatusCode(500, "Failed to add category due to database update issue.");
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return StatusCode(500, "Failed to add category.");
            }
        }

        [HttpGet("getcategory/{id}")]
        public ActionResult<ItemType> GetCategory(int id)
        {
            var category = _context.ItemTypes.FirstOrDefault(c => c.ItemTypeID == id);
            if (category == null)
            {
                return NotFound();
            }
            return category;
        }
    }
}

