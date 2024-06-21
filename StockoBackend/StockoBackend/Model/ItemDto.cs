namespace StockoBackend.Model
{
    public class ItemDto
    {
        public string ItemName { get; set; }
        public decimal ItemPrice { get; set; }
        public decimal ItemWeight { get; set; }
        public int ItemQuantity { get; set; }
        public string ItemSupplier { get; set; }
        public int ItemTypeID { get; set; }
        public DateTime? ExpirationDate { get; set; }
    }
}
