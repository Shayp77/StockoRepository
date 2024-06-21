namespace StockoBackend.Model
{
    public class Cashier
    {
        public int CashierID { get; set; }
        public string CashierName { get; set; }
        public string CashierDescription { get; set; }
        public int UserID { get; set; } 
        public User User { get; set; }

    }
}
