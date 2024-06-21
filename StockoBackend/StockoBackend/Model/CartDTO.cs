namespace StockoBackend.Model
{
    public class CartDTO
    {
        public int UserID { get; set; }
        public int ItemID { get; set; }
        public string ItemName { get; set; }
        public decimal ItemPrice { get; set; }
        public int Quantity { get; set; }
    }
}
