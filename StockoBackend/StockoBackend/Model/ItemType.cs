namespace StockoBackend.Model
{
    public class ItemType
    {
        public int ItemTypeID { get; set; }
        public string ItemTypeName { get; set; }

        // Navigation property
        public ICollection<Item> Items { get; set; }
    }

}
