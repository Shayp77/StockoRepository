// Pages/Login.js
import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { AppContext } from '../App';
import '../Styles/loginnregister.css';
import useAuth from '../Component/useAuth';
import axios from 'axios';

const schema = yup.object().shape({
  email: yup.string().email().required('Email is required'),
  password: yup.string().min(4, 'Password must be at least 4 characters').max(20, 'Password cannot exceed 20 characters').required('Password is required'),
});

export const Login = () =>
{
  const { setIsAuthenticated } = useContext(AppContext);
  const navigate = useNavigate();
  const { saveUser } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) =>
  {
    try
    {
      const Data = {
        UserEmail: data.email,
        UserPassword: data.password,
      };

      const response = await axios.post('https://localhost:7021/api/User/login', Data, {
        withCredentials: true,
      });

      if (response.status === 200)
      {
        const responseData = response.data;
        const userData = {
          id: responseData.userID,
          email: responseData.userEmail,
          username: responseData.username,
        };
        console.log(userData)
        saveUser(userData);
        setIsAuthenticated(true);
        navigate('/');
      }
    } catch (error)
    {
      console.error('Login failed:', error);
    }
  };

  return (
    <div className="auth-container">
      <h2>STOCKO</h2>
      <div className="auth-box">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="box">
            <div className="input-container">
              <div className="err">
                <input type="text" placeholder="Email" {...register('email')} />
                <p>{errors.email?.message}</p>
              </div>
            </div>
            <div className="input-container">
              <div className="err">
                <input type="password" placeholder="Password" {...register('password')} />
                <p>{errors.password?.message}</p>
              </div>
            </div>
            <div className="but">
              <button type="submit">LOGIN</button>
              <p>OR</p>
              <button
                type="button"
                className="register-button"
                onClick={() => navigate('/register')}
              >
                REGISTER
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
