import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Mail, Eye, EyeOff } from 'lucide-react';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { useAuth } from '../../hooks/useAuth';

interface LoginFormData {
  email: string;
  password: string;
  rememberMe?: boolean;
}

interface LoginFormProps {
  userType: 'user' | 'remote_employee' | 'admin';
  onSwitchToRegister: () => void;
}

export function LoginForm({ userType, onSwitchToRegister }: LoginFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid }
  } = useForm<LoginFormData>({
    mode: 'onChange',
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false
    }
  });

  const onSubmit = async (data: LoginFormData) => {
    console.log('Login attempt:', data);
    setLoading(true);
    setError('');
    
    try {
      await login(data.email, data.password, userType);
    } catch (err) {
      console.error('Login error:', err);
      setError('Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
      {error && (
        <div className="p-3 text-sm text-red-300 bg-red-900/20 rounded-md border border-red-500/20">
          {error}
        </div>
      )}

      <Input
        type="email"
        id="email"
        placeholder="Enter your email"
        leftIcon={<Mail className="w-5 h-5" />}
        {...register('email', {
          required: 'Email is required',
          pattern: {
            value: /^\S+@\S+$/i,
            message: 'Please enter a valid email'
          }
        })}
        error={errors.email?.message}
      />

      <Input
        type={showPassword ? 'text' : 'password'}
        id="password"
        placeholder="Enter your password"
        rightIcon={
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="text-white/60 hover:text-white"
          >
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        }
        {...register('password', {
          required: 'Password is required',
          minLength: {
            value: 6,
            message: 'Password must be at least 6 characters'
          }
        })}
        error={errors.password?.message}
      />

      <div className="flex items-center justify-between">
        <label className="flex items-center space-x-2 cursor-pointer">
          <input
            type="checkbox"
            className="remember-checkbox"
            {...register('rememberMe')}
          />
          <span className="text-sm text-white/70">Remember me</span>
        </label>
        <button
          type="button"
          className="text-sm text-white/70 hover:text-white transition-colors"
        >
          Forgot password?
        </button>
      </div>

      <Button
        type="submit"
        className="w-full"
        variant="gradient"
        loading={loading}
        disabled={loading || !isValid}
      >
        Sign In
      </Button>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-white/20"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-transparent text-white/60">OR CONTINUE WITH</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <button type="button" className="social-button">
          <div className="w-5 h-5 bg-white rounded-full"></div>
        </button>
        <button type="button" className="social-button">
          <div className="w-5 h-5 text-white">🍎</div>
        </button>
      </div>

      {userType !== 'admin' && (
        <div className="text-center">
          <p className="text-sm text-white/60">
            Don't have an account?{' '}
            <button
              type="button"
              onClick={onSwitchToRegister}
              className="text-white hover:underline font-medium"
            >
              Sign up
            </button>
          </p>
        </div>
      )}

      <div className="text-center space-y-2">
        <p className="text-xs text-white/50">
          By signing in, you agree to our Terms & Service
        </p>
        <p className="text-xs text-white/40">
          designed and developed with ❤️ by Dollar Gill
        </p>
      </div>
    </form>
  );
}