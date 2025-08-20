import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Mail, Eye, EyeOff, User } from 'lucide-react';
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
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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
    console.log('📝 Form submission started:', data);
    setLoading(true);
    setError('');
    
    try {
      console.log('🚀 Calling registerUser with:', {
        email: data.email,
        name: data.name,
        userType,
        hasDiscountCode: !!data.discountCode
      });

      const result = await registerUser(
        data.email, 
        data.password, 
        data.name, 
        userType, 
        data.discountCode
      );
      
      console.log('✅ Registration successful:', result);
    } catch (err) {
      console.error('❌ Registration error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Registration failed. Please try again.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
        {error && (
          <div className="p-3 text-sm text-red-300 bg-red-900/20 rounded-md border border-red-500/20">
            <strong>Registration Error:</strong> {error}
          </div>
        )}

        <Input
          id="register-name"
          autoComplete="name"
          placeholder="Full name"
          leftIcon={<User className="w-5 h-5" />}
          {...register('name', {
            required: 'Full name is required',
            minLength: {
              value: 2,
              message: 'Name must be at least 2 characters long'
            },
            maxLength: {
              value: 50,
              message: 'Name must be less than 50 characters'
            },
            pattern: {
              value: /^[a-zA-Z\s'-]+$/,
              message: 'Name can only contain letters, spaces, hyphens, and apostrophes'
            }
          })}
          error={errors.name?.message}
        />

        <Input
          type="email"
          id="register-email"
          autoComplete="email"
          placeholder="Company email"
          leftIcon={<Mail className="w-5 h-5" />}
          {...register('email', {
            required: 'Email address is required',
            pattern: {
              value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
              message: 'Please enter a valid email address'
            },
            maxLength: {
              value: 254,
              message: 'Email address is too long'
            }
          })}
          error={errors.email?.message}
        />

        <Input
          type={showPassword ? 'text' : 'password'}
          id="register-password"
          autoComplete="new-password"
          placeholder="Password"
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
              value: 8,
              message: 'Password must be at least 8 characters long'
            },
            validate: {
              hasUppercase: (value) => 
                /[A-Z]/.test(value) || 'Password must contain at least one uppercase letter',
              hasLowercase: (value) => 
                /[a-z]/.test(value) || 'Password must contain at least one lowercase letter',
              hasNumber: (value) => 
                /\d/.test(value) || 'Password must contain at least one number',
              hasSpecialChar: (value) => 
                /[@$!%*?&]/.test(value) || 'Password must contain at least one special character (@$!%*?&)'
            }
          })}
          error={errors.password?.message}
        />

        <Input
          type={showConfirmPassword ? 'text' : 'password'}
          id="register-confirm-password"
          autoComplete="new-password"
          placeholder="Confirm email address"
          rightIcon={
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="text-white/60 hover:text-white"
            >
              {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          }
          {...register('confirmPassword', {
            required: 'Please confirm your password',
            validate: (value) => {
              if (value !== watchPassword) {
                return 'Passwords do not match';
              }
              return true;
            }
          })}
          error={errors.confirmPassword?.message}
        />

        {userType === 'user' && (
          <Input
            placeholder="Enter remote employee discount code"
            id="register-discount-code"
            {...register('discountCode', {
              minLength: {
                value: 6,
                message: 'Discount code must be at least 6 characters'
              },
              maxLength: {
                value: 20,
                message: 'Discount code must be less than 20 characters'
              }
            })}
            error={errors.discountCode?.message}
          />
        )}

        <div className="space-y-4">
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              className="remember-checkbox"
            />
            <span className="text-sm text-white/70">
              Keep up with our constant improvements through our newsletter
            </span>
          </label>

          <Button
            type="submit"
            className="w-full"
            variant="gradient"
            loading={loading}
            disabled={loading || !isValid}
          >
            {loading ? 'Creating Account...' : 'Start free 14-day trial'}
          </Button>
        </div>

        <div className="text-center">
          <p className="text-sm text-white/60">
            Already have an account?{' '}
            <button
              type="button"
              onClick={onSwitchToLogin}
              className="text-white hover:underline font-medium"
            >
              Sign in
            </button>
          </p>
        </div>

        <div className="text-center space-y-2">
          <p className="text-xs text-white/50">
            By continuing, you agree to our terms and conditions, Privacy policy.
          </p>
        </div>
      </form>
    </div>
  );
}