import { useEffect } from 'react';
import Cookies from 'js-cookie';
import { AppContext } from '../App.js';
import { useContext } from 'react';

const useAuth = () =>
{
  const { user, setUser } = useContext(AppContext);
  useEffect(() =>
  {
    const storedUser = Cookies.get('user');
    if (storedUser)
    {
      setUser(JSON.parse(storedUser));
    }
  }, [setUser]);

  const saveUser = (userData) =>
  {
    Cookies.set('user', JSON.stringify(userData), { expires: 7 });
    setUser(userData);
  };

  const clearUser = () =>
  {
    Cookies.remove('user');
    setUser(null);
  };

  return { saveUser, clearUser };
};

export default useAuth;
