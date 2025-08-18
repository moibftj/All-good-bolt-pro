import React, { useState } from 'react';
import { Users, DollarSign, Award, User, Copy, Check } from 'lucide-react';
import { Navbar } from '../components/layout/Navbar';
import { Sidebar, SidebarItem } from '../components/layout/Sidebar';
import { StatsCard } from '../components/dashboard/StatsCard';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { useAuth } from '../hooks/useAuth';

type TabType = 'home' | 'revenue' | 'profile';

export function RemoteEmployeeDashboard() {
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [codeCopied, setCodeCopied] = useState(false);
  const { user } = useAuth();

  const copyDiscountCode = async () => {
    if (user?.discount_code) {
      await navigator.clipboard.writeText(user.discount_code);
      setCodeCopied(true);
      setTimeout(() => setCodeCopied(false), 2000);
    }
  };

  const mockCommissions = [
    {
      id: '1',
      user_email: 'john@example.com',
      subscription_amount: 199,
      commission_amount: 9.95,
      status: 'paid',
      created_at: '2024-01-15T10:30:00Z'
    },
    {
      id: '2',
      user_email: 'jane@example.com',
      subscription_amount: 599,
      commission_amount: 29.95,
      status: 'pending',
      created_at: '2024-01-10T14:15:00Z'
    },
    {
      id: '3',
      user_email: 'bob@example.com',
      subscription_amount: 199,
      commission_amount: 9.95,
      status: 'paid',
      created_at: '2024-01-05T09:20:00Z'
    }
  ];

  const totalEarnings = mockCommissions
    .filter(c => c.status === 'paid')
    .reduce((sum, c) => sum + c.commission_amount, 0);

  const pendingEarnings = mockCommissions
    .filter(c => c.status === 'pending')
    .reduce((sum, c) => sum + c.commission_amount, 0);

  const renderHome = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Remote Employee Dashboard</h1>
        <div className="text-right">
          <p className="text-sm text-gray-600">Welcome back,</p>
          <p className="text-lg font-semibold text-gray-900">{user?.name}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Referral Points"
          value={user?.referral_points || 0}
          icon={<Award className="w-6 h-6" />}
          color="yellow"
          subtitle="Total signups"
        />
        <StatsCard
          title="Active Referrals"
          value={user?.active_referrals || 0}
          icon={<Users className="w-6 h-6" />}
          color="blue"
          subtitle="Subscribed users"
        />
        <StatsCard
          title="Total Commission"
          value={`$${totalEarnings.toFixed(2)}`}
          icon={<DollarSign className="w-6 h-6" />}
          color="green"
          subtitle="Lifetime earnings"
        />
        <StatsCard
          title="Pending Payout"
          value={`$${pendingEarnings.toFixed(2)}`}
          icon={<DollarSign className="w-6 h-6" />}
          color="purple"
          subtitle="Next payout"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Your Discount Code</h2>
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 border-2 border-dashed border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Share this code with potential users</p>
                <p className="text-2xl font-bold text-material-primary font-mono">
                  {user?.discount_code}
                </p>
                <p className="text-sm text-green-600 mt-1">Gives 20% discount + you earn 5% commission</p>
              </div>
              <Button
                variant="secondary"
                onClick={copyDiscountCode}
                className="ml-4"
              >
                {codeCopied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {codeCopied ? 'Copied!' : 'Copy'}
              </Button>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Conversion Rate</span>
              <span className="font-semibold">15.2%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Avg. Commission</span>
              <span className="font-semibold">$16.62</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Best Month</span>
              <span className="font-semibold">January 2024</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Total Referrals</span>
              <span className="font-semibold">{user?.referral_points || 0}</span>
            </div>
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Commissions</h2>
        {mockCommissions.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2">User</th>
                  <th className="text-left py-2">Subscription</th>
                  <th className="text-left py-2">Commission</th>
                  <th className="text-left py-2">Status</th>
                  <th className="text-left py-2">Date</th>
                </tr>
              </thead>
              <tbody>
                {mockCommissions.slice(0, 5).map(commission => (
                  <tr key={commission.id} className="border-b">
                    <td className="py-2">{commission.user_email}</td>
                    <td className="py-2">${commission.subscription_amount}</td>
                    <td className="py-2 font-semibold text-green-600">
                      ${commission.commission_amount.toFixed(2)}
                    </td>
                    <td className="py-2">
                      <span className={`px-2 py-1 rounded text-xs ${
                        commission.status === 'paid' 
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {commission.status}
                      </span>
                    </td>
                    <td className="py-2 text-gray-600">
                      {new Date(commission.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8">
            <DollarSign className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No commissions yet</h3>
            <p className="text-gray-600">Start sharing your discount code to earn commissions</p>
          </div>
        )}
      </Card>
    </div>
  );

  const renderRevenue = () => (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">My Revenue</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatsCard
          title="Total Earnings"
          value={`$${totalEarnings.toFixed(2)}`}
          icon={<DollarSign className="w-6 h-6" />}
          color="green"
          subtitle="All time"
        />
        <StatsCard
          title="This Month"
          value="$29.95"
          icon={<DollarSign className="w-6 h-6" />}
          color="blue"
          subtitle="January 2024"
        />
        <StatsCard
          title="Pending Payout"
          value={`$${pendingEarnings.toFixed(2)}`}
          icon={<DollarSign className="w-6 h-6" />}
          color="yellow"
          subtitle="Processing"
        />
      </div>

      <Card className="p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Commission History</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3">Date</th>
                <th className="text-left py-3">User</th>
                <th className="text-left py-3">Plan</th>
                <th className="text-left py-3">Subscription Amount</th>
                <th className="text-left py-3">Commission (5%)</th>
                <th className="text-left py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {mockCommissions.map(commission => (
                <tr key={commission.id} className="border-b">
                  <td className="py-3">
                    {new Date(commission.created_at).toLocaleDateString()}
                  </td>
                  <td className="py-3">{commission.user_email}</td>
                  <td className="py-3">
                    {commission.subscription_amount === 199 ? 'Basic' : 
                     commission.subscription_amount === 599 ? 'Professional' : 'One-Time'}
                  </td>
                  <td className="py-3">${commission.subscription_amount}</td>
                  <td className="py-3 font-semibold text-green-600">
                    ${commission.commission_amount.toFixed(2)}
                  </td>
                  <td className="py-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      commission.status === 'paid' 
                        ? 'bg-green-100 text-green-800'
                        : commission.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {commission.status.charAt(0).toUpperCase() + commission.status.slice(1)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Card className="p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Payout Information</h2>
        <div className="bg-blue-50 rounded-lg p-4 mb-4">
          <h3 className="font-medium text-blue-900 mb-2">Next Payout</h3>
          <p className="text-blue-700">
            Your next payout of ${pendingEarnings.toFixed(2)} will be processed on the 1st of next month.
          </p>
        </div>
        <div className="space-y-2">
          <p className="text-sm text-gray-600">
            <strong>Payout Schedule:</strong> Monthly on the 1st
          </p>
          <p className="text-sm text-gray-600">
            <strong>Minimum Payout:</strong> $10.00
          </p>
          <p className="text-sm text-gray-600">
            <strong>Commission Rate:</strong> 5% of subscription amount
          </p>
        </div>
      </Card>
    </div>
  );

  const renderProfile = () => (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Profile Settings</h1>
      
      <Card className="p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <input
              type="text"
              value={user?.name || ''}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              readOnly
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
            <input
              type="email"
              value={user?.email || ''}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              readOnly
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Discount Code</label>
            <input
              type="text"
              value={user?.discount_code || ''}
              className="w-full px-3 py-2 border border-gray-300 rounded-md font-mono"
              readOnly
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Member Since</label>
            <input
              type="text"
              value={new Date().toLocaleDateString()}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              readOnly
            />
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Account Settings</h2>
        <div className="space-y-4">
          <Button variant="secondary">Change Password</Button>
          <Button variant="secondary">Update Profile</Button>
          <Button variant="secondary">Payout Settings</Button>
        </div>
      </Card>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'home': return renderHome();
      case 'revenue': return renderRevenue();
      case 'profile': return renderProfile();
      default: return renderHome();
    }
  };

  return (
    <div className="gradient-bg min-h-screen">
      <Navbar />
      <div className="flex">
        <Sidebar>
          <SidebarItem
            icon={<Users className="w-5 h-5" />}
            label="Dashboard"
            active={activeTab === 'home'}
            onClick={() => setActiveTab('home')}
          />
          <SidebarItem
            icon={<DollarSign className="w-5 h-5" />}
            label="My Revenue"
            active={activeTab === 'revenue'}
            onClick={() => setActiveTab('revenue')}
          />
          <SidebarItem
            icon={<User className="w-5 h-5" />}
            label="Profile Settings"
            active={activeTab === 'profile'}
            onClick={() => setActiveTab('profile')}
          />
        </Sidebar>
        
        <main className="flex-1 p-6">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}