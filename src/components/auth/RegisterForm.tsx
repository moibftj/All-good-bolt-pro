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
  const [debugInfo, setDebugInfo] = useState('');
  const { register: registerUser } = useAuth();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid, isDirty },
    trigger,
    getValues
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

  // Debug function to check form state
  const debugFormState = () => {
    const values = getValues();
    const debugData = {
      formValues: values,
      isValid,
      isDirty,
      errors: Object.keys(errors),
      loading
    };
    console.log('🔍 Form Debug Info:', debugData);
    setDebugInfo(JSON.stringify(debugData, null, 2));
  };

  const onSubmit = async (data: RegisterFormData) => {
    console.log('📝 Form submission started:', data);
    setLoading(true);
    setError('');
    setDebugInfo('');
    
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
      setDebugInfo(`Error: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  const handleFormError = (errors: any) => {
    console.error('🚨 Form validation errors:', errors);
    setDebugInfo(`Validation errors: ${JSON.stringify(errors, null, 2)}`);
  };

  // Manual validation trigger for debugging
  const validateForm = async () => {
    console.log('🔍 Manual validation triggered');
    const result = await trigger();
    console.log('Validation result:', result);
    debugFormState();
  };

  return (
    <div className="space-y-4">
      {/* Debug Panel (only in development) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="bg-gray-100 p-3 rounded text-xs">
          <div className="flex gap-2 mb-2">
            <button 
              type="button" 
              onClick={debugFormState}
              className="bg-blue-500 text-white px-2 py-1 rounded text-xs"
            >
              Debug Form
            </button>
            <button 
              type="button" 
              onClick={validateForm}
              className="bg-green-500 text-white px-2 py-1 rounded text-xs"
            >
              Validate
            </button>
          </div>
          {debugInfo && (
            <pre className="whitespace-pre-wrap text-xs bg-white p-2 rounded">
              {debugInfo}
            </pre>
          )}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit, handleFormError)} className="space-y-4" noValidate>
        {error && (
          <div className="p-3 text-sm text-red-700 bg-red-100 rounded-md">
            <strong>Registration Error:</strong> {error}
          </div>
        )}

        <Input
          label="Full Name"
          id="register-name"
          autoComplete="name"
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
          placeholder="Enter your full name"
        />

        <Input
          label="Email Address"
          type="email"
          id="register-email"
          autoComplete="email"
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
          placeholder="Enter your email address"
        />

        <Input
          label="Password"
          type="password"
          id="register-password"
          autoComplete="new-password"
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
          placeholder="Create a strong password"
        />

        <Input
          label="Confirm Password"
          type="password"
          id="register-confirm-password"
          autoComplete="new-password"
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
          placeholder="Confirm your password"
        />

        {userType === 'user' && (
          <Input
            label="Discount Code (Optional)"
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
            helper="Enter a discount code from a remote employee to get benefits"
          />
        )}

        <div className="space-y-2">
          <Button
            type="submit"
            className="w-full"
            loading={loading}
            disabled={loading || !isValid || !isDirty}
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </Button>
          
          {/* Debug info for button state */}
          {process.env.NODE_ENV === 'development' && (
            <div className="text-xs text-gray-500">
              Button state: isValid={isValid.toString()}, isDirty={isDirty.toString()}, loading={loading.toString()}
            </div>
          )}
        </div>

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
    </div>
  );
}