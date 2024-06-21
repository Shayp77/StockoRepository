using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace StockoBackend.Model
{
    public class TransactionDetail
    {
        [Key]
        public int Details { get; set; }
        public int ItemID { get; set; }
        public int Quantity { get; set; }
        public decimal price { get; set; }
        public decimal Totalamount { get; set; }

        // Foreign key to TransactionHeader
        [ForeignKey("TransactionHeader")]
        public int TransactionID { get; set; }

        // Navigation properties
        public TransactionHeader TransactionHeader { get; set; }
        public Item Item { get; set; }
    }
}
