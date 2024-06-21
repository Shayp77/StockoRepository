namespace StockoBackend.Model
{
    public class DetailDTO
    {
        public int TransactionID { get; set; }
        public int ItemID { get; set; }
        public int Quantity { get; set; }
        public decimal price { get; set; }
        public decimal Totalamount { get; set; }
    }
}
