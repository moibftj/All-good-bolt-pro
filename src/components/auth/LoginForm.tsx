import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { useAuth } from '../../hooks/useAuth';

interface LoginFormData {
  email: string;
  password: string;
}

interface LoginFormProps {
  userType: 'user' | 'remote_employee' | 'admin';
  onSwitchToRegister: () => void;
}

export function LoginForm({ userType, onSwitchToRegister }: LoginFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid }
  } = useForm<LoginFormData>({
    mode: 'onChange',
    defaultValues: {
      email: '',
      password: ''
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
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      {error && (
        <div className="p-3 text-sm text-red-700 bg-red-100 rounded-md">
          {error}
        </div>
      )}

      <Input
        label="Email Address"
        type="email"
        id="email"
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
        label="Password"
        type="password"
        id="password"
        {...register('password', {
          required: 'Password is required',
          minLength: {
            value: 6,
            message: 'Password must be at least 6 characters'
          }
        })}
        error={errors.password?.message}
      />

      <Button
        type="submit"
        className="w-full"
        loading={loading}
        disabled={loading || !isValid}
      >
        Sign In
      </Button>

      {userType !== 'admin' && (
        <div className="text-center">
          <p className="text-sm text-gray-600">
            Don't have an account?{' '}
            <button
              type="button"
              onClick={onSwitchToRegister}
              className="text-material-primary hover:underline font-medium"
            >
              Sign up
            </button>
          </p>
        </div>
      )}
    </form>
  );
}