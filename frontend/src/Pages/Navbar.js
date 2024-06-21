import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import '../Styles/navbar.css';
import group from "../Pictures/group.png";
import useAuth from '../Component/useAuth';
import { AppContext } from '../App';

export const Navbar = () =>
{
  const { user, setIsAuthenticated } = useContext(AppContext);
  const { clearUser } = useAuth();

  const logout = () =>
  {
    clearUser();
    setIsAuthenticated(false);
  };

  return (
    <div className="divnavbar">
      <div className='rolesatas'>
        <div className='rolepembagi'>
          <div className='rolekirikana'>
            <div className='rolekiri'>
              <img className='groupgambar' src={group} alt='groupofpeople' />
              <span className='roles'>Role</span>
            </div>
            <div className='rolekanan'>
              <Link className="links" to="/cashier">Switch</Link>
            </div>
          </div>
          <div className='rolebawah'>
            <span className='owner'>Owner/Kasir</span>
            <span className='namawarung'>{user ? `Warung ${user.username}` : "Warung"}</span>
          </div>
        </div>
      </div>
      <div className="truenav">
        <Link className="links" to="/inventory">Inventory</Link>
        <Link className="links" to="/cashier/inventory">Inventory</Link>
        <Link className="links" to="/transactionHistory">Transaction History</Link>
        <Link className="links" to="/settings">Setting</Link>
      </div>
      <div className='logout'>
        <button onClick={logout}>Log Out</button>
      </div>
    </div>
  );
};
