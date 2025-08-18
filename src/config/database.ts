import { DatabaseConfig } from '../types';

export const databaseConfig: DatabaseConfig = {
  admin: {
    host: 'us-west-2.db.thenile.dev',
    port: 5432,
    database: 'adventurous_wheelbarrow',
    username: '0198b26a-4109-7aeb-94b0-77ca8ed099fe',
    password: 'f3c6338e-7260-452a-b855-be5e8e2514a9',
    tenant_id: '0198b265-2f8e-79af-9186-368498548b31'
  },
  user: {
    host: 'us-west-2.db.thenile.dev',
    port: 5432,
    database: 'adventurous_wheelbarrow',
    username: '0198b26d-48f7-7735-a657-eeb1d6fcf785',
    password: 'c0aee8e1-7632-4e1b-82e8-481173c7481b',
    tenant_id: '0198b264-b836-70e5-a48c-5b1ca8928b83'
  },
  remote_employee: {
    host: 'us-west-2.db.thenile.dev',
    port: 5432,
    database: 'adventurous_wheelbarrow',
    username: '0198b26e-b9b1-7cd7-89f5-48308c98ed97',
    password: '9d7ab42c-4317-43c1-9e62-c27133b5dcfd',
    tenant_id: '0198b26b-cbb4-7fab-9bae-2e5cba7a2bcc'
  }
};

export const subscriptionPlans = [
  {
    id: 'basic',
    name: 'Basic Plan',
    price: 199,
    letters_limit: 4,
    duration: 'annual' as const,
    features: [
      '4 Professional Letters per year',
      'Attorney-reviewed templates',
      'PDF Download',
      'Email support'
    ]
  },
  {
    id: 'premium',
    name: 'One-Time Plan',
    price: 199,
    letters_limit: 1,
    duration: 'monthly' as const,
    features: [
      '1 Professional Letter',
      'No subscription required',
      'Instant access',
      'PDF Download'
    ]
  },
  {
    id: 'professional',
    name: 'Professional Plan',
    price: 599,
    letters_limit: 8,
    duration: 'monthly' as const,
    features: [
      '8 Professional Letters per month',
      'Priority support',
      'Advanced templates',
      'Rush delivery'
    ]
  }
];

export const letterCategories = {
  debt_retrieval: {
    name: 'Debt Retrieval',
    description: 'Professional letters for debt collection and payment demands',
    icon: '💰'
  },
  hr_employment: {
    name: 'HR & Employment',
    description: 'Employment-related legal correspondence and workplace issues',
    icon: '👥'
  },
  contract_disputes: {
    name: 'Contract Disputes',
    description: 'Letters addressing contract violations and disputes',
    icon: '📋'
  },
  tenant_landlord: {
    name: 'Tenant & Landlord',
    description: 'Property rental and lease-related legal correspondence',
    icon: '🏠'
  },
  consumer_complaints: {
    name: 'Consumer Complaints',
    description: 'Consumer protection and complaint letters',
    icon: '🛒'
  },
  business_disputes: {
    name: 'Business Disputes',
    description: 'Business-to-business legal correspondence',
    icon: '🏢'
  },
  cease_desist: {
    name: 'Cease & Desist',
    description: 'Stop harassment, infringement, or unwanted behavior',
    icon: '🚫'
  },
  demand_letters: {
    name: 'Demand Letters',
    description: 'Formal demands for action or payment',
    icon: '⚖️'
  },
  insurance_claims: {
    name: 'Insurance Claims',
    description: 'Insurance claim disputes and correspondence',
    icon: '🛡️'
  },
  personal_injury: {
    name: 'Personal Injury',
    description: 'Personal injury claims and correspondence',
    icon: '🏥'
  }
};