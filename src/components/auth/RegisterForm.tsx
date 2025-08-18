import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { useAuth } from '../../hooks/useAuth';

interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  discountCode?: string;
}

interface RegisterFormProps {
  userType: 'user' | 'remote_employee';
  onSwitchToLogin: () => void;
}

export function RegisterForm({ userType, onSwitchToLogin }: RegisterFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { register: registerUser } = useAuth();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid }
  } = useForm<RegisterFormData>({
    mode: 'onChange',
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      discountCode: ''
    }
  });

  const watchPassword = watch('password');

  const onSubmit = async (data: RegisterFormData) => {
    console.log('Form submission data:', data);
    setLoading(true);
    setError('');
    
    try {
      await registerUser(data.email, data.password, data.name, userType, data.discountCode);
    } catch (err) {
      console.error('Registration error:', err);
      setError('Registration failed. Please try again.');
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
        label="Full Name"
        id="name"
        {...register('name', {
          required: 'Name is required',
          minLength: {
            value: 2,
            message: 'Name must be at least 2 characters'
          },
          pattern: {
            value: /^[a-zA-Z\s]+$/,
            message: 'Name can only contain letters and spaces'
          }
        })}
        error={errors.name?.message}
      />

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
            value: 8,
            message: 'Password must be at least 8 characters'
          },
          pattern: {
            value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
            message: 'Password must contain uppercase, lowercase, number, and special character'
          }
        })}
        error={errors.password?.message}
      />

      <Input
        label="Confirm Password"
        type="password"
        id="confirmPassword"
        {...register('confirmPassword', {
          required: 'Please confirm your password',
          validate: (value) => value === watchPassword || 'Passwords do not match'
        })}
        error={errors.confirmPassword?.message}
      />

      {userType === 'user' && (
        <Input
          label="Discount Code (Optional)"
          placeholder="Enter remote employee discount code"
          id="discountCode"
          {...register('discountCode')}
          helper="Enter a discount code from a remote employee to get benefits"
        />
      )}

      <Button
        type="submit"
        className="w-full"
        loading={loading}
        disabled={loading || !isValid}
      >
        Create Account
      </Button>

      <div className="text-center">
        <p className="text-sm text-gray-600">
          Already have an account?{' '}
          <button
            type="button"
            onClick={onSwitchToLogin}
            className="text-material-primary hover:underline font-medium"
          >
            Sign in
          </button>
        </p>
      </div>
    </form>
  );
}