import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { letterCategories } from '../../config/database';
import { LetterForm, LetterCategory } from '../../types';

interface LetterGenerationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGenerate: (letter: LetterForm) => Promise<void>;
}

export function LetterGenerationModal({ isOpen, onClose, onGenerate }: LetterGenerationModalProps) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<LetterCategory | ''>('');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<LetterForm>();

  const handleClose = () => {
    setStep(1);
    setSelectedCategory('');
    reset();
    onClose();
  };

  const onSubmit = async (data: LetterForm) => {
    setLoading(true);
    try {
      await onGenerate({ ...data, category: selectedCategory as LetterCategory });
      handleClose();
    } catch (error) {
      console.error('Failed to generate letter:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderStep1 = () => (
    <div className="space-y-4">
      <h4 className="font-semibold text-gray-900 mb-4">Select Letter Category</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {Object.entries(letterCategories).map(([key, category]) => (
          <button
            key={key}
            type="button"
            onClick={() => {
              setSelectedCategory(key as LetterCategory);
              setStep(2);
            }}
            className={`p-4 text-left rounded-lg border-2 transition-all duration-200 hover:border-material-primary hover:shadow-md ${
              selectedCategory === key 
                ? 'border-material-primary bg-blue-50' 
                : 'border-gray-200'
            }`}
          >
            <div className="flex items-center space-x-3">
              <span className="text-2xl">{category.icon}</span>
              <div>
                <h5 className="font-medium text-gray-900">{category.name}</h5>
                <p className="text-sm text-gray-600">{category.description}</p>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );

  const renderStep2 = () => (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Sender Information */}
      <div>
        <h4 className="font-semibold text-gray-900 mb-4">Sender Information</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Full Name"
            {...register('sender_name', { required: 'Name is required' })}
            error={errors.sender_name?.message}
          />
          <Input
            label="Email Address"
            type="email"
            {...register('sender_email', { required: 'Email is required' })}
            error={errors.sender_email?.message}
          />
          <Input
            label="Phone Number"
            {...register('sender_phone', { required: 'Phone is required' })}
            error={errors.sender_phone?.message}
          />
          <Input
            label="Address"
            {...register('sender_address', { required: 'Address is required' })}
            error={errors.sender_address?.message}
          />
          <Input
            label="City"
            {...register('sender_city', { required: 'City is required' })}
            error={errors.sender_city?.message}
          />
          <Input
            label="State"
            {...register('sender_state', { required: 'State is required' })}
            error={errors.sender_state?.message}
          />
          <Input
            label="ZIP Code"
            {...register('sender_zip', { required: 'ZIP code is required' })}
            error={errors.sender_zip?.message}
          />
        </div>
      </div>

      {/* Recipient Information */}
      <div>
        <h4 className="font-semibold text-gray-900 mb-4">Recipient Information</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Recipient Name"
            {...register('recipient_name', { required: 'Recipient name is required' })}
            error={errors.recipient_name?.message}
          />
          <Input
            label="Recipient Address"
            {...register('recipient_address', { required: 'Recipient address is required' })}
            error={errors.recipient_address?.message}
          />
          <Input
            label="City"
            {...register('recipient_city', { required: 'City is required' })}
            error={errors.recipient_city?.message}
          />
          <Input
            label="State"
            {...register('recipient_state', { required: 'State is required' })}
            error={errors.recipient_state?.message}
          />
          <Input
            label="ZIP Code"
            {...register('recipient_zip', { required: 'ZIP code is required' })}
            error={errors.recipient_zip?.message}
          />
        </div>
      </div>

      {/* Letter Details */}
      <div>
        <h4 className="font-semibold text-gray-900 mb-4">Letter Details</h4>
        <div className="space-y-4">
          <Input
            label="Subject"
            {...register('subject', { required: 'Subject is required' })}
            error={errors.subject?.message}
          />
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Details
            </label>
            <textarea
              {...register('details', { required: 'Details are required' })}
              rows={6}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-material-primary focus:border-material-primary"
              placeholder="Provide detailed information about your case..."
            />
            {errors.details && (
              <p className="mt-1 text-sm text-material-error">{errors.details.message}</p>
            )}
          </div>

          {(selectedCategory === 'debt_retrieval' || selectedCategory === 'demand_letters') && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Amount Owed"
                {...register('amount_owed')}
                placeholder="$0.00"
              />
              <Input
                label="Due Date"
                type="date"
                {...register('due_date')}
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Additional Information
            </label>
            <textarea
              {...register('additional_info')}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-material-primary focus:border-material-primary"
              placeholder="Any additional information or special circumstances..."
            />
          </div>
        </div>
      </div>

      <div className="flex justify-between pt-4">
        <Button
          type="button"
          variant="secondary"
          onClick={() => setStep(1)}
        >
          Back
        </Button>
        <Button
          type="submit"
          loading={loading}
        >
          Generate Letter
        </Button>
      </div>
    </form>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={step === 1 ? 'Generate Professional Letter' : `Generate ${letterCategories[selectedCategory as LetterCategory]?.name || ''} Letter`}
      size="xl"
    >
      {step === 1 ? renderStep1() : renderStep2()}
    </Modal>
  );
}