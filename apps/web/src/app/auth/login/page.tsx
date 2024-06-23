"use client";
import { useState } from 'react';
import axios from 'axios';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { env } from '@/app/env';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async () => {
    try {
      const response = await axios.post('http://localhost:8000/api/auth/signin', 
        { email, password }, 
        { withCredentials: true } // Ensure cookies are sent and received
      );
      console.log(response.data);
      window.alert('Login Successful!');
      window.location.href = '/admin/dashboard';
    } catch (err) {
      setError('Invalid email or password');
      window.alert('Login Failed: Invalid email or password');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded shadow-md">
        <h2 className="text-2xl font-bold text-center">Login</h2>
        {error && <div className="p-4 mb-4 text-sm text-red-700 bg-red-100 rounded">{error}</div>}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button
            onClick={handleLogin}
            className="w-full px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Login
          </button>
          <Separator />
          <Button asChild>
            <Link href={`${env.NEXT_PUBLIC_BASE_API_URL}/auth/github`}>GitHub</Link>
          </Button>
          <Button asChild>
            <Link href={`${env.NEXT_PUBLIC_BASE_API_URL}/auth/google`}>Google</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Login;
