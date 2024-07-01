'use client';
import { useState } from 'react';
import axios from 'axios';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { env } from '@/app/env';
import { useRouter } from 'next/navigation';
import { getQueryClient } from '@/app/get-query-client';
import { useMutation } from '@tanstack/react-query';
import { getSelectedStore } from '@/lib/fetch-api/store/client';
import Image from 'next/image';
const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();
  const queryClient = getQueryClient();

  const signin = useMutation({
    mutationFn: async ({
      email,
      password,
    }: {
      email: string;
      password: string;
    }) => {
      try {
        const response = await axios.post(
          'http://localhost:8000/api/auth/signin',
          { email, password },
          { withCredentials: true }, // Ensure cookies are sent and received
        );
        return response.data;
      } catch (err) {
        setError('Invalid email or password');
        throw err;
      }
    },
    onSuccess: (data) => {
      queryClient.prefetchQuery({
        queryKey: ['store'],
        queryFn: getSelectedStore,
      });
      router.refresh();
      router.push(data.data?.user?.role === 'USER' ? '/' : '/dashboard');
    },
    onError: () => {
      setError('Invalid email or password');
      window.alert('Login Failed: Invalid email or password');
    },
  });

  const handleLogin = async () => {
    await signin.mutateAsync({ email, password });
    // router.prefetch('/dashboard')
  };

  return (
    <div className="flex min-h-screen bg-blue-50">
      {error && (
        <div className="p-4 mb-4 text-sm text-red-700 bg-red-100 rounded">
          {error}
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 m-auto shadow-xl shadow-gray-400 bg-white sm:max-w-5xl rounded-xl">
        {/* Photo */}
        <div className="hidden md:block">
          <figure className="w-full h-full object-cover rounded-l-xl m-auto">
            <Image
              src="/photo-login.jpg"
              width={500}
              height={500}
              alt="photo-login"
            />
          </figure>
        </div>
        <div className="flex flex-col p-8">
          <h1 className="text-3xl font-bold text-blue-900">Grosirun</h1>
          <p className="text-sm text-gray-600">Sign In</p>
          <form className="mt-4 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                className="block w-full px-3 py-2 mt-1 border border-blue-300 rounded-xl shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                type="password"
                className="block w-full px-3 py-2 mt-1 border border-blue-300 rounded-xl shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </form>
          <button
            onClick={handleLogin}
            className="w-full px-4 py-2 mt-4 text-white bg-blue-600 rounded-xl hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Login
          </button>
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600">or sign in with</p>
            <div className="flex justify-center mt-2 space-x-4">
              <Button
                asChild
                className="p-3 rounded-full bg-blue-600 text-white hover:bg-blue-700"
              >
                <Link href={`${env.NEXT_PUBLIC_BASE_API_URL}/auth/google`}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    className="bi bi-google"
                    viewBox="0 0 16 16"
                  >
                    <path d="M15.545 6.558a9.4 9.4 0 0 1 .139 1.626c0 2.434-.87 4.492-2.384 5.885h.002C11.978 15.292 10.158 16 8 16A8 8 0 1 1 8 0a7.7 7.7 0 0 1 5.352 2.082l-2.284 2.284A4.35 4.35 0 0 0 8 3.166c-2.087 0-3.86 1.408-4.492 3.304a4.8 4.8 0 0 0 0 3.063h.003c.635 1.893 2.405 3.301 4.492 3.301 1.078 0 2.004-.276 2.722-.764h-.003a3.7 3.7 0 0 0 1.599-2.431H8v-3.08z" />
                  </svg>
                </Link>
              </Button>

              <Button
                asChild
                className="p-3 rounded-full bg-blue-600 text-white hover:bg-blue-700"
              >
                <Link href={`${env.NEXT_PUBLIC_BASE_API_URL}/auth/github`}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    className="bi bi-github"
                    viewBox="0 0 16 16"
                  >
                    <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8" />
                  </svg>
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
