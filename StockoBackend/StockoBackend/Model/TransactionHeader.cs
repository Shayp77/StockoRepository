using System.ComponentModel.DataAnnotations;

namespace StockoBackend.Model
{
    public class TransactionHeader
    {
        [Key]
        public int TransactionID { get; set; }

        // Foreign key
        public int UserID { get; set; }
        public DateTime TransactionDate { get; set; }
        public decimal TotalPrice { get; set; }

        // Navigation properties
        public User User { get; set; }
        public ICollection<TransactionDetail> TransactionDetails { get; set; }
    }

}
