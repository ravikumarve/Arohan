'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { LayoutDashboard, Lock, Mail } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate login - replace with actual authentication
    setTimeout(() => {
      setIsLoading(false);
      router.push('/admin');
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-admin-background-primary p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-admin-primary to-admin-primary-light rounded-2xl mb-4">
            <LayoutDashboard className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">AROHAN Platform Admin</h1>
          <p className="text-admin-primary-light mt-2">Sign in to your account</p>
        </div>

        {/* Login Form */}
        <div className="bg-admin-background-secondary rounded-lg p-8 border border-admin-background-tertiary">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-white mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-admin-primary-light" />
                <input
                  id="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 bg-admin-background-tertiary border border-admin-background-tertiary rounded-lg text-white placeholder-admin-primary-light focus:outline-none focus:border-admin-primary"
                  placeholder="admin@arohan.com"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-white mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-admin-primary-light" />
                <input
                  id="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 bg-admin-background-tertiary border border-admin-background-tertiary rounded-lg text-white placeholder-admin-primary-light focus:outline-none focus:border-admin-primary"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {/* Remember me & Forgot password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm text-admin-primary-light">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-admin-background-tertiary bg-admin-background-tertiary text-admin-primary focus:ring-admin-primary"
                />
                <span>Remember me</span>
              </label>
              <a href="#" className="text-sm text-admin-primary hover:text-admin-primary-light transition-colors">
                Forgot password?
              </a>
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-admin-primary hover:bg-admin-primary-dark text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-admin-background-tertiary"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-admin-background-secondary text-admin-primary-light">
                Or continue with
              </span>
            </div>
          </div>

          {/* Back to home */}
          <div className="text-center">
            <a
              href="/"
              className="text-sm text-admin-primary-light hover:text-white transition-colors"
            >
              ← Back to home
            </a>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-admin-primary-light mt-8">
          © 2026 AROHAN. All rights reserved.
        </p>
      </div>
    </div>
  );
}
