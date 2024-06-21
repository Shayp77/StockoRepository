namespace StockoBackend.Model
{
    public class User
    {
        public int UserID { get; set; }
        public string name { get; set; }
        public string Username { get; set; }
        public string UserEmail { get; set; }
        public string UserPassword { get; set; }
        public string UserPhone { get; set; }

        // Navigation properties
        public ICollection<Cart> Carts { get; set; }
        public ICollection<TransactionHeader> TransactionHeaders { get; set; }
        public ICollection<Cashier> Cashiers { get; set; }
    }

}
