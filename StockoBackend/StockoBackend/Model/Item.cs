namespace StockoBackend.Model
{
    public class Item
    {
        public int ItemID { get; set; }
        public string ItemName { get; set; }
        public decimal ItemPrice { get; set; }
        public decimal ItemWeight { get; set; }
        public int ItemQuantity { get; set; }
        public string ItemSupplier { get; set; }
        public DateTime? ExpirationDate { get; set; } // New property

        // Foreign key
        public int ItemTypeID { get; set; }

        // Navigation properties
        public ItemType ItemType { get; set; }
        public ICollection<Cart> Carts { get; set; }
        public ICollection<TransactionDetail> TransactionDetails { get; set; }
    }


}
