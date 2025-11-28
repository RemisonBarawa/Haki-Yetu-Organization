
import { useAuth } from '@/hooks/useAuth';
import DashboardHeader from '@/components/DashboardHeader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, FileText, Calendar, MessageSquare, Settings, Upload } from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { userRole } = useAuth();

  const getWelcomeMessage = () => {
    switch (userRole) {
      case 'admin':
        return 'Welcome to the Admin Dashboard. You have full access to all system features including content management.';
      case 'staff':
        return 'Welcome to the Staff Portal. Manage cases, clients, content, and community programs.';
      case 'volunteer':
        return 'Welcome to the Volunteer Portal. Access training materials and assignment details.';
      default:
        return 'Welcome to your Client Portal. Track your case status and access resources.';
    }
  };

  const getDashboardCards = () => {
    const baseCards = [
      {
        title: 'My Profile',
        description: 'Update your personal information',
        icon: Users,
        action: 'View Profile',
        href: '/profile'
      }
    ];

    if (userRole === 'admin' || userRole === 'staff') {
      return [
        ...baseCards,
        {
          title: 'Content Management',
          description: 'Manage articles, programs, events, and resources',
          icon: Settings,
          action: 'Manage Content',
          href: '/cms'
        },
        {
          title: 'Case Management',
          description: 'Track and manage legal cases',
          icon: FileText,
          action: 'View Cases',
          href: '/cases'
        },
        {
          title: 'Events & Programs',
          description: 'Organize community activities',
          icon: Calendar,
          action: 'Manage Events',
          href: '/events'
        },
        {
          title: 'Communications',
          description: 'Send updates and alerts',
          icon: MessageSquare,
          action: 'Send Messages',
          href: '/communications'
        }
      ];
    }

    if (userRole === 'volunteer') {
      return [
        ...baseCards,
        {
          title: 'My Assignments',
          description: 'View your volunteer tasks',
          icon: Calendar,
          action: 'View Tasks',
          href: '/assignments'
        },
        {
          title: 'Training Materials',
          description: 'Access learning resources',
          icon: FileText,
          action: 'View Materials',
          href: '/training'
        },
        {
          title: 'Upload Resources',
          description: 'Share materials with the team',
          icon: Upload,
          action: 'Upload Files',
          href: '/upload'
        }
      ];
    }

    return [
      ...baseCards,
      {
        title: 'My Cases',
        description: 'Track your case progress',
        icon: FileText,
        action: 'View Cases',
        href: '/my-cases'
      },
      {
        title: 'Resources',
        description: 'Access helpful information',
        icon: MessageSquare,
        action: 'View Resources',
        href: '/resources'
      }
    ];
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader />
      
      <main className="p-6">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            {userRole === 'admin' ? 'Admin Dashboard' : 
             userRole === 'staff' ? 'Staff Portal' :
             userRole === 'volunteer' ? 'Volunteer Portal' : 'Client Portal'}
          </h2>
          <p className="text-gray-600">{getWelcomeMessage()}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {getDashboardCards().map((card, index) => {
            const Icon = card.icon;
            return (
              <Link key={index} to={card.href}>
                <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                  <CardHeader className="flex flex-row items-center space-y-0 pb-2">
                    <div className="flex-1">
                      <CardTitle className="text-lg">{card.title}</CardTitle>
                      <CardDescription className="mt-1">
                        {card.description}
                      </CardDescription>
                    </div>
                    <Icon className="h-8 w-8 text-green-600" />
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-green-600 font-medium hover:underline">
                      {card.action} →
                    </p>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
