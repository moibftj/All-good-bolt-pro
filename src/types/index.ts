export interface User {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'remote_employee' | 'admin';
  created_at: string;
  updated_at: string;
  tenant_id: string;
}

export interface RegularUser extends User {
  role: 'user';
  subscription_plan?: SubscriptionPlan;
  letters_used: number;
  discount_code?: string;
  referred_by?: string;
}

export interface RemoteEmployee extends User {
  role: 'remote_employee';
  discount_code: string;
  referral_points: number;
  total_commission: number;
  active_referrals: number;
}

export interface AdminUser extends User {
  role: 'admin';
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  letters_limit: number;
  features: string[];
  duration: 'monthly' | 'annual';
}

export interface Letter {
  id: string;
  user_id: string;
  title: string;
  content: string;
  category: LetterCategory;
  status: 'draft' | 'generated' | 'downloaded';
  created_at: string;
  updated_at: string;
}

export type LetterCategory = 
  | 'debt_retrieval'
  | 'hr_employment'
  | 'contract_disputes'
  | 'tenant_landlord'
  | 'consumer_complaints'
  | 'business_disputes'
  | 'cease_desist'
  | 'demand_letters'
  | 'insurance_claims'
  | 'personal_injury';

export interface LetterForm {
  sender_name: string;
  sender_address: string;
  sender_city: string;
  sender_state: string;
  sender_zip: string;
  sender_phone: string;
  sender_email: string;
  recipient_name: string;
  recipient_address: string;
  recipient_city: string;
  recipient_state: string;
  recipient_zip: string;
  subject: string;
  category: LetterCategory;
  details: string;
  amount_owed?: string;
  due_date?: string;
  additional_info?: string;
}

export interface Commission {
  id: string;
  remote_employee_id: string;
  user_id: string;
  subscription_amount: number;
  commission_amount: number;
  status: 'pending' | 'paid' | 'cancelled';
  created_at: string;
}

export interface DatabaseConfig {
  admin: {
    host: string;
    port: number;
    database: string;
    username: string;
    password: string;
    tenant_id: string;
  };
  user: {
    host: string;
    port: number;
    database: string;
    username: string;
    password: string;
    tenant_id: string;
  };
  remote_employee: {
    host: string;
    port: number;
    database: string;
    username: string;
    password: string;
    tenant_id: string;
  };
}