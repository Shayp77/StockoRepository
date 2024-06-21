import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import '../Styles/TransactionHistory.css';

export const TransactionDetail = () => {
  const { transactionId } = useParams();
  const [details, setDetails] = useState([]);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const response = await axios.get(`https://localhost:7021/api/transaction/transactiondetails/${transactionId}`);
        setDetails(response.data);
      } catch (error) {
        console.error("Error fetching transaction details", error);
      }
    };
    fetchDetails();
  }, [transactionId]);

  // Calculate the total amount
  const totalSum = details.reduce((sum, detail) => sum + (detail.quantity * detail.price), 0);

  return (
    <div className="transaction-detail">
      <h2>Transaction Details for {transactionId}</h2>
      <table className="detail-table">
        <thead>
          <tr>
            <th>Item ID</th>
            <th>Quantity</th>
            <th>Price</th>
            <th>Total Amount</th>
          </tr>
        </thead>
        <tbody>
          {details.map(detail => (
            <tr key={detail.itemID}>
              <td>{detail.itemID}</td>
              <td>{detail.quantity}</td>
              <td>Rp{detail.price.toLocaleString()}</td>
              <td>Rp{(detail.quantity * detail.price).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p>Total Amount: Rp{totalSum.toLocaleString()}</p>
    </div>
  );
};
