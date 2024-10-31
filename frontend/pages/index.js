import React from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import Dashboard from '../components/Dashboard';
import useAuth from '../utils/useAuth';
import { useRouter } from 'next/router';

export default function Home() {
  const { isAuthenticated, role } = useAuth();
  const router = useRouter();

  if (!isAuthenticated) {
      if (typeof window !== 'undefined') {
          router.push('/login');  // Redirect if not authenticated
      }
      return null; // Render nothing if redirecting
  }

  return (
      <div>
          <Navbar />
          <Sidebar />
          {role === 'admin' && <h1>Welcome, Admin!</h1>}
          {role === 'manager' && <h1>Welcome, Manager!</h1>}
          {role === 'user' && <Dashboard />}
      </div>
  );
}
