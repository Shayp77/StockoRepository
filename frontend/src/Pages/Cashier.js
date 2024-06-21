import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import '../Styles/cashier.css';
import Cookies from 'js-cookie';
import { AppContext } from '../App';

export const Cashier = () =>
{
  const { user, setUser } = useContext(AppContext);
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState(null);
  const [quantities, setQuantities] = useState({});
  const [carts, setCarts] = useState([]);
  const [total, setTotal] = useState(0);

  useEffect(() =>
  {
    const storedUser = Cookies.get('user');
    if (storedUser)
    {
      setUser(JSON.parse(storedUser));
    }
    fetchItems();
    fetchItemTypes();
    fetchCarts();
  }, [setUser]);

  const fetchItems = () =>
  {
    axios.get('https://localhost:7021/api/Item/getallitems')
      .then(response =>
      {
        setItems(response.data);
        const initialQuantities = {};
        response.data.forEach(item =>
        {
          initialQuantities[item.itemID] = 1;
        });
        setQuantities(initialQuantities);
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
        setCategories(response.data);
      })
      .catch(error =>
      {
        console.error('There was an error fetching the item types!', error);
      });
  };

  const fetchCarts = () =>
  {
    axios.get(`https://localhost:7021/api/Transaction/getcarts/${user.id}`)
      .then(response =>
      {
        setCarts(response.data);
        calculateTotal(response.data);
      })
      .catch(error =>
      {
        console.error('There was an error fetching the carts!', error);
      });
  };

  const calculateTotal = (carts) =>
  {
    const totalAmount = carts.reduce((sum, cart) => sum + (cart.itemPrice * cart.quantity), 0);
    setTotal(totalAmount);
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

  const handleAddToCart = (item) =>
  {
    const cartDto = {
      UserID: user.id,
      ItemID: item.itemID,
      ItemName: item.itemName,
      ItemPrice: item.itemPrice,
      Quantity: quantities[item.itemID]
    };
    axios.post('https://localhost:7021/api/Transaction/addtocart', cartDto)
      .then(response =>
      {
        console.log('Item added to cart:', response.data);
        fetchCarts(); // Refresh cart list and recalculate total
      })
      .catch(error =>
      {
        console.error('There was an error adding the item to the cart!', error);
      });
  };

  const handleDeleteCart = (cartID) =>
  {
    axios.delete(`https://localhost:7021/api/Transaction/deletecart/${cartID}`)
      .then(response =>
      {
        console.log('Cart deleted:', response.data);
        fetchCarts(); // Refresh cart list and recalculate total
      })
      .catch(error =>
      {
        console.error('There was an error deleting the cart!', error);
      });
  };

  const handleDeleteAllCarts = () =>
  {
    axios.delete(`https://localhost:7021/api/Transaction/deleteallcarts/${user.id}`)
      .then(response =>
      {
        console.log('All carts deleted:', response.data);
        fetchCarts(); // Refresh cart list and recalculate total
      })
      .catch(error =>
      {
        console.error('There was an error deleting all carts!', error);
      });
  };

  const handleQuantityChange = (itemID, amount) =>
  {
    setQuantities(prevQuantities => ({
      ...prevQuantities,
      [itemID]: Math.max(1, (prevQuantities[itemID] || 1) + amount)
    }));
  };

  const handleCompleteTransaction = async () =>
  {
    try
    {
      // Step 1: Create TransactionHeader
      const transactionDto = {
        UserID: user.id,
        TotalPrice: total
      };

      const transactionHeaderResponse = await axios.post('https://localhost:7021/api/Transaction/addtransaction', transactionDto);
      const transactionId = transactionHeaderResponse.data.transactionID;

      // Step 2: Create TransactionDetails using transactionId
      const transactionDetails = carts.map(cart => ({
        TransactionID: transactionId,
        ItemID: cart.itemID,
        Quantity: cart.quantity,
        price: cart.itemPrice,
        Totalamount: cart.quantity * cart.itemPrice
      }));

      const transactionDetailsResponse = await axios.post('https://localhost:7021/api/Transaction/addtransactiondetails', transactionDetails);
      console.log('Transaction details added:', transactionDetailsResponse.data);

      // Step 3: Optionally, clear the cart after transaction completion
      await handleDeleteAllCarts();
    } catch (error)
    {
      console.error('Error completing transaction:', error);
    }
  };


  const filteredItems = items.filter(item =>
  {
    const matchesSearchTerm = item.itemName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory ? item.itemTypeID === activeCategory : true;
    return matchesSearchTerm && matchesCategory;
  });

  return (
    <div className='semua'>
      <div className='cont'>
        <div className="cashier-page">
          <h1 className='judul1'>Cashier</h1>
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
                key={category.itemTypeID}
                onClick={() => handleCategoryClick(category.itemTypeID)}
                className={activeCategory === category.itemTypeID ? 'active-category' : ''}
              >
                {category.itemTypeName}
              </button>
            ))}
          </div>

          <div className="item-grid">
            <div className="item-section">
              <div className="item-list">
                {filteredItems.map(item => (
                  <div key={item.itemID} className="item-card">
                    <div className="item-details">
                      <p>{item.itemName}</p>
                      <p>Rp.{item.itemPrice.toLocaleString()}</p>
                    </div>
                    <div className="item-actions">
                      <button onClick={() => handleQuantityChange(item.itemID, -1)}>-</button>
                      <span>{quantities[item.itemID] || 1}</span>
                      <button onClick={() => handleQuantityChange(item.itemID, 1)}>+</button>
                      <button onClick={() => handleAddToCart(item)}>Add</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="transaction-details">
          <h3>Transaction Details</h3>
          <div className="transaction-summary">
            {carts.map(cart => (
              <div key={cart.cartID} className="cart-card">
                <div className="cart-details">
                  <p>{cart.itemName}</p>
                  <p>Rp.{cart.itemPrice.toLocaleString()}</p>
                  <p>Quantity: {cart.quantity}</p>
                </div>
                <div className="cart-actions">
                  <button onClick={() => handleDeleteCart(cart.cartID)}>Delete</button>
                </div>
              </div>
            ))}
            {carts.length > 0 && (
              <button className="delete-all-button" onClick={handleDeleteAllCarts}>Delete All Transactions</button>
            )}
          </div>
          <div className="transaction-footer">
            <h4>Total: Rp.{total.toLocaleString()}</h4>
            <button className="complete-button" onClick={handleCompleteTransaction}>Complete</button>
            <button className="cancel-button">Cancel</button>
          </div>
        </div>
      </div>
    </div>
  );
};
