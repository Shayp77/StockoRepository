import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../Styles/TransactionHistory.css';

export const TransactionHistory = () =>
{
  const [transactions, setTransactions] = useState([]);
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const navigate = useNavigate();

  const fetchTransactions = async () =>
  {
    try
    {
      const response = await axios.get('https://localhost:7021/api/Transaction/transactions', {
        params: { from: fromDate, to: toDate }
      });
      setTransactions(response.data);
    } catch (error)
    {
      console.error("Error fetching transactions", error);
    }
  };

  const handleViewDetails = (transactionId) =>
  {
    navigate(`/transactiondetails/${transactionId}`);
  };

  const handleDeleteTransaction = async (transactionId) =>
  {
    if (window.confirm('Are you sure you want to delete this transaction?'))
    {
      try
      {
        await axios.delete(`https://localhost:7021/api/transaction/deletetransaction/${transactionId}`);
        fetchTransactions();
      } catch (error)
      {
        console.error("Error deleting transaction", error);
      }
    }
  };

  useEffect(() =>
  {
    fetchTransactions();
  }, [fromDate, toDate]);

  return (
    <div className="transaction-history">
      <h1 className='judul1'>Transaction History</h1>
      <hr className='garis' />

      <div className="date-filter">
        <label>
          From:
          <input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} />
        </label>
        <label>
          To:
          <input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} />
        </label>
      </div>
      <table className="transaction-table">
        <thead>
          <tr>
            <th>Transaction ID</th>
            <th>Date</th>
            <th>Total Price</th>
            <th>Action</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map(transaction => (
            <tr key={transaction.transactionID}>
              <td>{transaction.transactionID}</td>
              <td>{new Date(transaction.transactionDate).toLocaleString()}</td>
              <td>Rp{transaction.totalPrice.toLocaleString()}</td>
              <td>
                <button onClick={() => handleViewDetails(transaction.transactionID)}>
                  View Details
                </button>
              </td>
              <td>
                <button onClick={() => handleDeleteTransaction(transaction.transactionID)}>
                  ❌
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
