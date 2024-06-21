import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../Styles/inventory.css';
import Modal from 'react-modal';

export const Inventory = () =>
{
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [itemTypes, setItemTypes] = useState([]);
  const [newItem, setNewItem] = useState({
    ItemName: '',
    ItemPrice: 0,
    ItemWeight: 20,
    ItemQuantity: 0,
    ItemSupplier: "",
    ItemTypeID: 0,
    expirationDate: ''
  });
  const [newCategoryModalIsOpen, setNewCategoryModalIsOpen] = useState(false);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [newCategory, setNewCategory] = useState('');
  const [activeCategory, setActiveCategory] = useState(null);  // New state for active category

  useEffect(() =>
  {
    fetchItems();
    fetchItemTypes();
  }, []);

  const fetchItems = () =>
  {
    axios.get('https://localhost:7021/api/Item/getallitems')
      .then(response =>
      {
        setItems(response.data);
      })
      .catch(error =>
      {
        console.error('There was an error fetching the inventory!', error);
      });
  };

  const fetchItemTypes = () =>
  {
    axios.get('https://localhost:7021/api/Item/getallitemtypes')
      .then(response =>
      {
        setItemTypes(response.data);
        setCategories(response.data);
      })
      .catch(error =>
      {
        console.error('There was an error fetching the item types!', error);
      });
  };

  const handleInputChange = (e) =>
  {
    const { name, value } = e.target;
    setNewItem({
      ...newItem,
      [name]: value
    });
  };

  const handleSubmit = (e) =>
  {
    e.preventDefault();
    const itemDto = {
      ItemName: newItem.ItemName,
      ItemPrice: parseFloat(newItem.ItemPrice),
      ItemWeight: parseFloat(newItem.ItemWeight),
      ItemQuantity: parseInt(newItem.ItemQuantity),
      ItemSupplier: newItem.ItemSupplier,
      ItemTypeID: parseInt(newItem.ItemTypeID),
      ExpirationDate: newItem.expirationDate
    };

    axios.post('https://localhost:7021/api/Item/additem', itemDto)
      .then(response =>
      {
        setItems([...items, response.data]);
        setNewItem({
          ItemName: '',
          ItemTypeID: '',
          ItemQuantity: '',
          ItemPrice: '',
          ItemSupplier: '',
          expirationDate: ''
        });
      })
      .catch(error =>
      {
        console.error('There was an error adding the item!', error);
      });
  };

  const openModal = (item) =>
  {
    setCurrentItem(item);
    setModalIsOpen(true);
  };

  const closeModal = () =>
  {
    setModalIsOpen(false);
    setCurrentItem(null);
  };

  const handleUpdateInputChange = (e) =>
  {
    const { name, value } = e.target;
    setCurrentItem({
      ...currentItem,
      [name]: value
    });
  };

  const handleUpdate = (e) =>
  {
    e.preventDefault();
    axios.put(`https://localhost:7021/api/Item/updateitem/${currentItem.itemID}`, currentItem)
      .then(response =>
      {
        const updatedItems = items.map(item =>
          item.itemID === currentItem.itemID ? response.data : item
        );
        setItems(updatedItems);
        closeModal();
      })
      .catch(error =>
      {
        console.error('There was an error updating the item!', error);
      });
  };

  const handleDelete = (itemID) =>
  {
    axios.delete(`https://localhost:7021/api/Item/deleteitem/${itemID}`)
      .then(() =>
      {
        setItems(items.filter(item => item.itemID !== itemID));
      })
      .catch(error =>
      {
        console.error('There was an error deleting the item!', error);
      });
  };

  const handleSearchChange = (e) =>
  {
    setSearchTerm(e.target.value);
  };

  const handleCategoryClick = (categoryID) =>
  {
    if (activeCategory === categoryID)
    {
      setActiveCategory(null); // Reset filter
    } else
    {
      setActiveCategory(categoryID);
    }
  };

  const filteredItems = items.filter(item =>
  {
    const matchesSearchTerm = item.itemName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory ? item.itemTypeID === activeCategory : true;
    return matchesSearchTerm && matchesCategory;
  });

  const openNewCategoryModal = () => setNewCategoryModalIsOpen(true);
  const closeNewCategoryModal = () => setNewCategoryModalIsOpen(false);

  const handleNewCategoryChange = (e) => setNewCategory(e.target.value);

  const handleAddCategory = (e) =>
  {
    e.preventDefault();
    const categoryDto = { ItemTypeName: newCategory };

    axios.post('https://localhost:7021/api/Item/addcategory', categoryDto)
      .then(response =>
      {
        fetchItemTypes();  // Fetch updated categories
        setNewCategory('');
        closeNewCategoryModal();
      })
      .catch(error => console.error('There was an error adding the category!', error));
  };

  return (

    <div className="inventory-page">
      <h1 className='judul1'>Inventory</h1>
      <hr className='garis' />
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search item"
          value={searchTerm}
          onChange={handleSearchChange}
        />
      </div>
      <h3>Categories</h3>
      <div className="categories">
        {categories.map(category => (
          <button
            key={category.itemTypeName}
            onClick={() => handleCategoryClick(category.itemTypeID)}
            className={activeCategory === category.itemTypeID ? 'active-category' : ''}
          >
            {category.itemTypeName}
          </button>
        ))}
        <button onClick={openNewCategoryModal}>Add Category</button>
      </div>
      <h4>Item List</h4>
      <div className="content">
        <div className="table-container">
          <table className="inventory-table">
            <thead>
              <tr>
                <th>Id</th>
                <th>Product</th>
                <th>Quantity</th>
                <th>Category</th>
                <th>Price</th>
                <th>Supplier</th>
                <th>Expiration</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.map(item => (
                <tr key={item.itemID}>
                  <td>{item.itemID}</td>
                  <td>{item.itemName}</td>
                  <td>{item.itemQuantity}</td>
                  <td>{item.itemTypeID}</td>
                  <td>{item.itemPrice}</td>
                  <td>{item.itemSupplier}</td>
                  <td>{item.expirationDate}</td>
                  <td className='butitem'>
                    <button className='updatebut' onClick={() => openModal(item)}>Update</button>
                    <button className='deletebut' onClick={() => handleDelete(item.itemID)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="add-item-form">
          <h2>Add Item</h2>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              name="ItemName"
              placeholder="Product Name"
              value={newItem.ItemName}
              onChange={handleInputChange}
            />
            <input
              type="number"
              name="ItemTypeID"
              placeholder="Product Type"
              value={newItem.ItemTypeID}
              onChange={handleInputChange}
            />
            <input
              type="number"
              name="ItemQuantity"
              placeholder="Product Quantity"
              value={newItem.ItemQuantity}
              onChange={handleInputChange}
            />
            <input
              type="number"
              name="ItemPrice"
              placeholder="Product Price"
              value={newItem.ItemPrice}
              onChange={handleInputChange}
            />
            <input
              type="text"
              name="ItemSupplier"
              placeholder="Supplier Details"
              value={newItem.ItemSupplier}
              onChange={handleInputChange}
            />
            <input
              type="date"
              name="expirationDate"
              placeholder="Expiration Date"
              value={newItem.expirationDate}
              onChange={handleInputChange}
            />
            <button type="submit">Complete</button>
            <button type="button" onClick={() => setNewItem({
              ItemName: '',
              ItemTypeID: 0,
              ItemQuantity: 0,
              ItemPrice: 0,
              ItemSupplier: '',
              expirationDate: ''
            })}>Clear</button>
          </form>
        </div>
      </div>

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Update Item"
      >
        <h2>Update Item</h2>
        {currentItem && (
          <form onSubmit={handleUpdate}>
            <input
              type="text"
              name="itemName"
              value={currentItem.itemName}
              onChange={handleUpdateInputChange}
            />
            <input
              type="number"
              name="itemTypeID"
              value={currentItem.itemTypeID}
              onChange={handleUpdateInputChange}
            />
            <input
              type="number"
              name="itemQuantity"
              value={currentItem.itemQuantity}
              onChange={handleUpdateInputChange}
            />
            <input
              type="number"
              name="itemPrice"
              value={currentItem.itemPrice}
              onChange={handleUpdateInputChange}
            />
            <input
              type="text"
              name="itemSupplier"
              value={currentItem.itemSupplier}
              onChange={handleUpdateInputChange}
            />
            <input
              type="date"
              name="expirationDate"
              value={currentItem.expirationDate}
              onChange={handleUpdateInputChange}
            />
            <button type="submit">Update</button>
            <button type="button" onClick={closeModal}>Cancel</button>
          </form>
        )}
      </Modal>

      <Modal
        isOpen={newCategoryModalIsOpen}
        onRequestClose={closeNewCategoryModal}
        contentLabel="Add New Category"
      >
        <h2>Add New Category</h2>
        <form onSubmit={handleAddCategory}>
          <input
            type="text"
            placeholder="Category Name"
            value={newCategory}
            onChange={handleNewCategoryChange}
          />
          <button type="submit">Add</button>
          <button type="button" onClick={closeNewCategoryModal}>Cancel</button>
        </form>
      </Modal>
    </div>
  );
};
