import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import axios from 'axios';
import useAuth from '../Component/useAuth';
import '../Styles/loginnregister.css';

const schema = yup.object().shape({
  name: yup.string().required('Your Full Name is Required!'),
  password: yup.string().min(4).max(20).required(),
  email: yup.string().email().required(),
  phone: yup.string().required(),
});

export const Register = () =>
{
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
        Name: data.name,
        Username: data.name,
        UserEmail: data.email,
        UserPassword: data.password,
        UserPhone: data.phone,
      };
      console.log(Data)

      const response = await axios.post('https://localhost:7021/api/User/register', Data, {
        withCredentials: true,
      });

      if (response.status === 200)
      {
        const responseData = response.data;
        // Assuming responseData contains the user's data returned from the server
        const userData = {
          id: responseData.id,
          email: responseData.userEmail,
          username: responseData.username,
        };
        saveUser(userData);
        navigate('/login');
      }
    } catch (error)
    {
      console.error('Registration failed:', error);
    }
  };

  return (
    <div className="auth-container">
      <h2>STOCKO</h2>
      <div className="auth-box">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className='box'>
            <div className="input-container">
              <label>Name</label>
              <div className='err'>
                <input type="text" placeholder="Name" {...register('name')} />
                <p>{errors.name?.message}</p>
              </div>
            </div>
            <div className="input-container">
              <label>Password</label>
              <div className='err'>
                <input type="password" placeholder="Password" {...register('password')} />
                <p>{errors.password?.message}</p>
              </div>
            </div>
            <div className="input-container">
              <label>Email</label>
              <div className='err'>
                <input type="text" placeholder="Email" {...register('email')} />
                <p>{errors.email?.message}</p>
              </div>
            </div>
            <div className="input-container">
              <label>Phone</label>
              <div className='err'>
                <input type="text" placeholder="Phone" {...register('phone')} />
                <p>{errors.phone?.message}</p>
              </div>
            </div>
            <button type="submit">Register</button>
          </div>
        </form>
      </div>
    </div>
  );
};
