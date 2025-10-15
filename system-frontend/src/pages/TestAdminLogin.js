import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { adminLogin } from '../redux/slices/authSlice';
import { toast } from 'react-hot-toast';

const TestAdminLogin = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const testAdminLogin = async () => {
    setLoading(true);
    try {
      console.log('Testing admin login...');
      const result = await dispatch(adminLogin({
        email: 'admin@mzansimomentshub.com',
        password: 'admin'
      })).unwrap();
      
      console.log('Admin login result:', result);
      toast.success('Admin login successful!');
    } catch (error) {
      console.error('Admin login error:', error);
      toast.error(`Admin login failed: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Test Admin Login</h1>
      <button
        onClick={testAdminLogin}
        disabled={loading}
        className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 disabled:opacity-50"
      >
        {loading ? 'Testing...' : 'Test Admin Login'}
      </button>
    </div>
  );
};

export default TestAdminLogin;

