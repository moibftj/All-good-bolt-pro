import React, { useState } from 'react';
import { Shield, Users, FileText, DollarSign, TrendingUp, Activity } from 'lucide-react';
import { Navbar } from '../components/layout/Navbar';
import { Sidebar, SidebarItem } from '../components/layout/Sidebar';
import { StatsCard } from '../components/dashboard/StatsCard';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { useAuth } from '../hooks/useAuth';

type TabType = 'overview' | 'users' | 'letters' | 'employees' | 'revenue';

export function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const { user } = useAuth();

  // Mock data for admin dashboard
  const mockUsers = [
    { id: '1', name: 'John Doe', email: 'john@example.com', plan: 'Basic', letters_used: 2, created_at: '2024-01-15' },
    { id: '2', name: 'Jane Smith', email: 'jane@example.com', plan: 'Professional', letters_used: 5, created_at: '2024-01-10' },
    { id: '3', name: 'Bob Johnson', email: 'bob@example.com', plan: 'One-Time', letters_used: 1, created_at: '2024-01-05' }
  ];

  const mockEmployees = [
    { 
      id: '1', 
      name: 'Alice Wilson', 
      email: 'alice@company.com', 
      discount_code: 'REMOTE001', 
      referrals: 12, 
      commission: 245.50 
    },
    { 
      id: '2', 
      name: 'Charlie Brown', 
      email: 'charlie@company.com', 
      discount_code: 'REMOTE002', 
      referrals: 8, 
      commission: 156.75 
    }
  ];

  const mockLetters = [
    { 
      id: '1', 
      user_name: 'John Doe', 
      title: 'Debt Collection Letter', 
      category: 'debt_retrieval', 
      status: 'generated',
      created_at: '2024-01-15T10:30:00Z'
    },
    { 
      id: '2', 
      user_name: 'Jane Smith', 
      title: 'Employment Dispute', 
      category: 'hr_employment', 
      status: 'downloaded',
      created_at: '2024-01-12T14:20:00Z'
    },
    { 
      id: '3', 
      user_name: 'Bob Johnson', 
      title: 'Contract Dispute', 
      category: 'contract_disputes', 
      status: 'generated',
      created_at: '2024-01-10T09:15:00Z'
    }
  ];

  const renderOverview = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        <div className="text-right">
          <p className="text-sm text-gray-600">Welcome back,</p>
          <p className="text-lg font-semibold text-gray-900">{user?.name}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Users"
          value={mockUsers.length}
          icon={<Users className="w-6 h-6" />}
          color="blue"
          subtitle="Active subscribers"
        />
        <StatsCard
          title="Letters Generated"
          value={mockLetters.length}
          icon={<FileText className="w-6 h-6" />}
          color="green"
          subtitle="This month"
        />
        <StatsCard
          title="Remote Employees"
          value={mockEmployees.length}
          icon={<Users className="w-6 h-6" />}
          color="yellow"
          subtitle="Active referrers"
        />
        <StatsCard
          title="Total Revenue"
          value="$2,847"
          icon={<DollarSign className="w-6 h-6" />}
          color="purple"
          subtitle="This month"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <Users className="w-4 h-4 text-green-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">New user registration</p>
                <p className="text-xs text-gray-500">john@example.com signed up for Basic plan</p>
              </div>
              <span className="text-xs text-gray-500">2h ago</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <FileText className="w-4 h-4 text-blue-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Letter generated</p>
                <p className="text-xs text-gray-500">Employment dispute letter created</p>
              </div>
              <span className="text-xs text-gray-500">4h ago</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                <DollarSign className="w-4 h-4 text-purple-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Commission earned</p>
                <p className="text-xs text-gray-500">$29.95 commission via REMOTE001</p>
              </div>
              <span className="text-xs text-gray-500">1d ago</span>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Platform Statistics</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">User Conversion Rate</span>
              <span className="font-semibold text-green-600">18.5%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Avg. Letters per User</span>
              <span className="font-semibold">2.8</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Most Popular Category</span>
              <span className="font-semibold">Debt Collection</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Employee Success Rate</span>
              <span className="font-semibold text-blue-600">12.3%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">System Uptime</span>
              <span className="font-semibold text-green-600">99.9%</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );

  const renderUsers = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
        <Button>Add New User</Button>
      </div>
      
      <Card className="p-6">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3">Name</th>
                <th className="text-left py-3">Email</th>
                <th className="text-left py-3">Plan</th>
                <th className="text-left py-3">Letters Used</th>
                <th className="text-left py-3">Created</th>
                <th className="text-left py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {mockUsers.map(user => (
                <tr key={user.id} className="border-b">
                  <td className="py-3 font-medium">{user.name}</td>
                  <td className="py-3 text-gray-600">{user.email}</td>
                  <td className="py-3">
                    <span className={`px-2 py-1 rounded text-xs ${
                      user.plan === 'Professional' ? 'bg-purple-100 text-purple-800' :
                      user.plan === 'Basic' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {user.plan}
                    </span>
                  </td>
                  <td className="py-3">{user.letters_used}</td>
                  <td className="py-3 text-gray-600">
                    {new Date(user.created_at).toLocaleDateString()}
                  </td>
                  <td className="py-3">
                    <div className="flex space-x-2">
                      <Button variant="ghost" size="sm">View</Button>
                      <Button variant="ghost" size="sm">Edit</Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );

  const renderLetters = () => (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Letter Management</h1>
      
      <Card className="p-6">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3">User</th>
                <th className="text-left py-3">Title</th>
                <th className="text-left py-3">Category</th>
                <th className="text-left py-3">Status</th>
                <th className="text-left py-3">Created</th>
                <th className="text-left py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {mockLetters.map(letter => (
                <tr key={letter.id} className="border-b">
                  <td className="py-3 font-medium">{letter.user_name}</td>
                  <td className="py-3">{letter.title}</td>
                  <td className="py-3">
                    <span className="px-2 py-1 rounded text-xs bg-gray-100 text-gray-800">
                      {letter.category.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="py-3">
                    <span className={`px-2 py-1 rounded text-xs ${
                      letter.status === 'downloaded' ? 'bg-blue-100 text-blue-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {letter.status}
                    </span>
                  </td>
                  <td className="py-3 text-gray-600">
                    {new Date(letter.created_at).toLocaleDateString()}
                  </td>
                  <td className="py-3">
                    <div className="flex space-x-2">
                      <Button variant="ghost" size="sm">View</Button>
                      <Button variant="ghost" size="sm">Download</Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );

  const renderEmployees = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Remote Employee Management</h1>
        <Button>Add New Employee</Button>
      </div>
      
      <Card className="p-6">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3">Name</th>
                <th className="text-left py-3">Email</th>
                <th className="text-left py-3">Discount Code</th>
                <th className="text-left py-3">Referrals</th>
                <th className="text-left py-3">Total Commission</th>
                <th className="text-left py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {mockEmployees.map(employee => (
                <tr key={employee.id} className="border-b">
                  <td className="py-3 font-medium">{employee.name}</td>
                  <td className="py-3 text-gray-600">{employee.email}</td>
                  <td className="py-3">
                    <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono">
                      {employee.discount_code}
                    </code>
                  </td>
                  <td className="py-3">{employee.referrals}</td>
                  <td className="py-3 font-semibold text-green-600">
                    ${employee.commission.toFixed(2)}
                  </td>
                  <td className="py-3">
                    <div className="flex space-x-2">
                      <Button variant="ghost" size="sm">View</Button>
                      <Button variant="ghost" size="sm">Edit</Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );

  const renderRevenue = () => (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Revenue Analytics</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Revenue"
          value="$12,450"
          icon={<DollarSign className="w-6 h-6" />}
          color="green"
          subtitle="All time"
        />
        <StatsCard
          title="This Month"
          value="$2,847"
          icon={<TrendingUp className="w-6 h-6" />}
          color="blue"
          subtitle="January 2024"
        />
        <StatsCard
          title="Commission Paid"
          value="$402.25"
          icon={<DollarSign className="w-6 h-6" />}
          color="purple"
          subtitle="To employees"
        />
        <StatsCard
          title="Net Profit"
          value="$11,047.75"
          icon={<Activity className="w-6 h-6" />}
          color="yellow"
          subtitle="After commissions"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Revenue by Plan</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Basic Plan ($199/year)</span>
              <span className="font-semibold">$7,960 (64%)</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Professional Plan ($599/month)</span>
              <span className="font-semibold">$3,595 (29%)</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">One-Time Plan ($199)</span>
              <span className="font-semibold">$895 (7%)</span>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Growth Metrics</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Monthly Growth Rate</span>
              <span className="font-semibold text-green-600">+15.3%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Customer Lifetime Value</span>
              <span className="font-semibold">$342</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Churn Rate</span>
              <span className="font-semibold text-red-600">2.1%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Avg. Revenue per User</span>
              <span className="font-semibold">$248</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'overview': return renderOverview();
      case 'users': return renderUsers();
      case 'letters': return renderLetters();
      case 'employees': return renderEmployees();
      case 'revenue': return renderRevenue();
      default: return renderOverview();
    }
  };

  return (
    <div className="gradient-bg min-h-screen">
      <Navbar />
      <div className="flex">
        <Sidebar>
          <SidebarItem
            icon={<Shield className="w-5 h-5" />}
            label="Overview"
            active={activeTab === 'overview'}
            onClick={() => setActiveTab('overview')}
          />
          <SidebarItem
            icon={<Users className="w-5 h-5" />}
            label="Users"
            active={activeTab === 'users'}
            onClick={() => setActiveTab('users')}
          />
          <SidebarItem
            icon={<FileText className="w-5 h-5" />}
            label="Letters"
            active={activeTab === 'letters'}
            onClick={() => setActiveTab('letters')}
          />
          <SidebarItem
            icon={<Users className="w-5 h-5" />}
            label="Remote Employees"
            active={activeTab === 'employees'}
            onClick={() => setActiveTab('employees')}
          />
          <SidebarItem
            icon={<DollarSign className="w-5 h-5" />}
            label="Revenue"
            active={activeTab === 'revenue'}
            onClick={() => setActiveTab('revenue')}
          />
        </Sidebar>
        
        <main className="flex-1 p-6">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}