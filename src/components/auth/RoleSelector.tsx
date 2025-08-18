import React from 'react';
import { User, Users, Shield } from 'lucide-react';
import { Card } from '../ui/Card';

interface RoleSelectorProps {
  onSelectRole: (role: 'user' | 'remote_employee' | 'admin') => void;
}

export function RoleSelector({ onSelectRole }: RoleSelectorProps) {
  const roles = [
    {
      type: 'user' as const,
      name: 'Regular User',
      description: 'Generate professional legal letters',
      icon: User,
      color: 'text-blue-600'
    },
    {
      type: 'remote_employee' as const,
      name: 'Remote Employee',
      description: 'Earn commissions through referrals',
      icon: Users,
      color: 'text-green-600'
    },
    {
      type: 'admin' as const,
      name: 'Administrator',
      description: 'System administration access',
      icon: Shield,
      color: 'text-red-600'
    }
  ];

  return (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Choose Your Access Type</h3>
        <p className="text-sm text-gray-600">Select the type of account you need</p>
      </div>

      <div className="grid gap-4">
        {roles.map((role) => {
          const Icon = role.icon;
          return (
            <Card
              key={role.type}
              className="p-4 cursor-pointer hover:shadow-material-2 transition-all duration-200 border-2 hover:border-material-primary"
              onClick={() => onSelectRole(role.type)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onSelectRole(role.type);
                }
              }}
              aria-label={`Select ${role.name} - ${role.description}`}
            >
              <div className="flex items-center space-x-4">
                <div className={`p-3 rounded-full bg-gray-100 ${role.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900">{role.name}</h4>
                  <p className="text-sm text-gray-600">{role.description}</p>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}