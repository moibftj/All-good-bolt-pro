import React, { useState } from 'react';
import { FileText, CreditCard, PlusCircle, User, Download, Mail } from 'lucide-react';
import { Navbar } from '../components/layout/Navbar';
import { Sidebar, SidebarItem } from '../components/layout/Sidebar';
import { StatsCard } from '../components/dashboard/StatsCard';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { LetterGenerationModal } from '../components/letter/LetterGenerationModal';
import { LetterPreview } from '../components/letter/LetterPreview';
import { useAuth } from '../hooks/useAuth';
import { LetterForm } from '../types';
import { subscriptionPlans } from '../config/database';
import { MainContent } from '../components/layout/FocusableLayout';
import { LoadingAnnouncer } from '../components/accessibility/FocusManager';

type TabType = 'home' | 'letters' | 'generate' | 'subscriptions' | 'profile';

export function UserDashboard() {
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [isLetterModalOpen, setIsLetterModalOpen] = useState(false);
  const [isGeneratingLetter, setIsGeneratingLetter] = useState(false);
  const [userLetters, setUserLetters] = useState([
    {
      id: '1',
      user_id: 'user-1',
      title: 'Debt Collection Letter - ABC Company',
      content: 'Dear Sir/Madam, This letter serves as formal notice...',
      category: 'debt_retrieval' as const,
      status: 'generated' as const,
      created_at: '2024-01-15T10:30:00Z',
      updated_at: '2024-01-15T10:30:00Z'
    },
    {
      id: '2',
      user_id: 'user-1',
      title: 'Employment Dispute - Wrongful Termination',
      content: 'To Whom It May Concern, I am writing to formally dispute...',
      category: 'hr_employment' as const,
      status: 'downloaded' as const,
      created_at: '2024-01-10T14:15:00Z',
      updated_at: '2024-01-10T14:15:00Z'
    }
  ]);

  const { user } = useAuth();

  const handleGenerateLetter = async (letterData: LetterForm) => {
    // Simulate letter generation
    setIsGeneratingLetter(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const newLetter = {
      id: Date.now().toString(),
      user_id: user?.id || '',
      title: `${letterData.category.replace('_', ' ')} - ${letterData.recipient_name}`,
      content: `Professional letter content for ${letterData.subject}...`,
      category: letterData.category,
      status: 'generated' as const,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    setUserLetters(prev => [newLetter, ...prev]);
    setIsGeneratingLetter(false);
  };

  const renderHome = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Welcome back, {user?.name}!</h1>
        <Button onClick={() => setIsLetterModalOpen(true)} className="flex items-center">
          <PlusCircle className="w-4 h-4 mr-2" />
          Generate Letter
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Letters Generated"
          value={userLetters.length}
          icon={<FileText className="w-6 h-6" />}
          color="blue"
        />
        <StatsCard
          title="Letters Remaining"
          value={4 - userLetters.length}
          icon={<Mail className="w-6 h-6" />}
          color="green"
          subtitle="This month"
        />
        <StatsCard
          title="Active Plan"
          value="Basic"
          icon={<CreditCard className="w-6 h-6" />}
          color="purple"
          subtitle="$199/year"
        />
        <StatsCard
          title="Downloads"
          value={userLetters.filter(l => l.status === 'downloaded').length}
          icon={<Download className="w-6 h-6" />}
          color="yellow"
        />
      </div>

      <Card className="p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Letters</h2>
        {userLetters.length > 0 ? (
          <div className="grid gap-4">
            {userLetters.slice(0, 3).map(letter => (
              <LetterPreview
                key={letter.id}
                letter={letter}
                onDownload={() => console.log('Download letter:', letter.id)}
                onView={() => console.log('View letter:', letter.id)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No letters yet</h3>
            <p className="text-gray-600 mb-4">Generate your first professional legal letter</p>
            <Button onClick={() => setIsLetterModalOpen(true)}>
              <PlusCircle className="w-4 h-4 mr-2" />
              Create Letter
            </Button>
          </div>
        )}
      </Card>
    </div>
  );

  const renderLetters = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">My Letters</h1>
        <Button onClick={() => setIsLetterModalOpen(true)}>
          <PlusCircle className="w-4 h-4 mr-2" />
          Generate New Letter
        </Button>
      </div>

      {userLetters.length > 0 ? (
        <div className="grid gap-4">
          {userLetters.map(letter => (
            <LetterPreview
              key={letter.id}
              letter={letter}
              onDownload={() => console.log('Download letter:', letter.id)}
              onView={() => console.log('View letter:', letter.id)}
            />
          ))}
        </div>
      ) : (
        <Card className="p-8 text-center">
          <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-gray-900 mb-2">No letters generated</h3>
          <p className="text-gray-600 mb-6">Start by creating your first professional legal letter</p>
          <Button onClick={() => setIsLetterModalOpen(true)} size="lg">
            <PlusCircle className="w-5 h-5 mr-2" />
            Generate Your First Letter
          </Button>
        </Card>
      )}
    </div>
  );

  const renderSubscriptions = () => (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">My Subscriptions</h1>
      
      <Card className="p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Current Plan</h2>
        <div className="border rounded-lg p-4 bg-blue-50">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-gray-900">Basic Plan</h3>
              <p className="text-gray-600">4 letters per year</p>
              <p className="text-sm text-gray-500">Renewed annually on Dec 15, 2024</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-gray-900">$199</p>
              <p className="text-sm text-gray-600">per year</p>
            </div>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Available Plans</h2>
        <div className="grid gap-4">
          {subscriptionPlans.map(plan => (
            <div key={plan.id} className="border rounded-lg p-4 hover:border-material-primary transition-colors">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-gray-900">{plan.name}</h3>
                <div className="text-right">
                  <p className="text-xl font-bold text-gray-900">${plan.price}</p>
                  <p className="text-sm text-gray-600">per {plan.duration === 'annual' ? 'year' : 'month'}</p>
                </div>
              </div>
              <ul className="text-sm text-gray-600 space-y-1 mb-4">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-center">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2"></span>
                    {feature}
                  </li>
                ))}
              </ul>
              <Button variant="secondary" size="sm" className="w-full">
                {plan.id === 'basic' ? 'Current Plan' : 'Upgrade'}
              </Button>
            </div>
          ))}
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
        </div>
      </Card>

      <Card className="p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Account Settings</h2>
        <div className="space-y-4">
          <Button variant="secondary">Change Password</Button>
          <Button variant="secondary">Update Profile</Button>
          <Button variant="danger">Delete Account</Button>
        </div>
      </Card>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'home': return renderHome();
      case 'letters': return renderLetters();
      case 'generate': return renderLetters(); // Same as letters but modal opens
      case 'subscriptions': return renderSubscriptions();
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
            icon={<FileText className="w-5 h-5" />}
            label="Dashboard"
            active={activeTab === 'home'}
            onClick={() => setActiveTab('home')}
          />
          <SidebarItem
            icon={<Mail className="w-5 h-5" />}
            label="My Letters"
            active={activeTab === 'letters'}
            onClick={() => setActiveTab('letters')}
          />
          <SidebarItem
            icon={<PlusCircle className="w-5 h-5" />}
            label="Generate Letters"
            active={activeTab === 'generate'}
            onClick={() => {
              setActiveTab('generate');
              setIsLetterModalOpen(true);
            }}
          />
          <SidebarItem
            icon={<CreditCard className="w-5 h-5" />}
            label="My Subscriptions"
            active={activeTab === 'subscriptions'}
            onClick={() => setActiveTab('subscriptions')}
          />
          <SidebarItem
            icon={<User className="w-5 h-5" />}
            label="Profile Settings"
            active={activeTab === 'profile'}
            onClick={() => setActiveTab('profile')}
          />
        </Sidebar>
        
        <MainContent className="flex-1 p-6">
          <LoadingAnnouncer 
            isLoading={isGeneratingLetter}
            loadingMessage="Generating your legal letter, please wait"
            completedMessage="Letter generated successfully"
          />
          {renderContent()}
        </MainContent>
      </div>

      <LetterGenerationModal
        isOpen={isLetterModalOpen}
        onClose={() => setIsLetterModalOpen(false)}
        onGenerate={handleGenerateLetter}
      />
    </div>
  );
}