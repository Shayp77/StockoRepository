namespace StockoBackend.Model
{
    public class Cart
    {
        public int CartID { get; set; }

        // Foreign keys
        public int UserID { get; set; }
        public int ItemID { get; set; }
        public string ItemName { get; set; }
        public decimal ItemPrice { get; set; }
        public int Quantity { get; set; }

        // Navigation properties
        public User User { get; set; }
        public Item Item { get; set; }
    }

}
