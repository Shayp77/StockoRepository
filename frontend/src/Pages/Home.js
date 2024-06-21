// Home.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../Styles/Home.css';

const Home = () =>
{
  const [notifications, setNotifications] = useState([]);
  const [selectedNotification, setSelectedNotification] = useState(null);

  useEffect(() =>
  {
    fetchNotifications().then(setNotifications);
  }, []);

  const fetchNotifications = async () =>
  {
    // Placeholder for user ID logic, e.g., fetching from cookies, context, or auth hook
    // const userId = getUserIdFromContextOrCookies();
    const response = await axios.get(`https://localhost:7021/api/User/notifications`);
    console.log(response.data)
    return response.data;
  };

  const handleNotificationClick = (notification) =>
  {
    setSelectedNotification(notification);
  };

  const handleCloseModal = () =>
  {
    setSelectedNotification(null);
  };

  return (
    <div>
      <h1>Notifications</h1>
      <div className="notification-container">
        <div className="expiring-items">
          <h4>Expiring Soon</h4>
          {notifications.expiringItems?.slice(0, 2).map((item) => (
            <div key={item.id} onClick={() => handleNotificationClick(item)}>
              {item.itemName} is expiring soon! Check your inventory for more details.
            </div>
          ))}
        </div>
        <div className="low-stock-items">
          <h4>Low Stock</h4>
          {notifications.lowStockItems?.slice(0, 2).map((item) => (
            <div key={item.id} onClick={() => handleNotificationClick(item)}>
              {item.name} is running low on stock! Please reorder soon.
            </div>
          ))}
        </div>
      </div>
      {selectedNotification && (
        <div className="modal-backdrop" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>{selectedNotification.name}</h2>
            <p>{selectedNotification.details}</p>
            <button onClick={handleCloseModal}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
