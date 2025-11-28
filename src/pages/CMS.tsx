
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import DashboardHeader from '@/components/DashboardHeader';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, FileText, Calendar, Users, Download, Settings } from 'lucide-react';
import ArticlesList from '@/components/cms/ArticlesList';
import ProgramsList from '@/components/cms/ProgramsList';
import EventsList from '@/components/cms/EventsList';
import TeamMembersList from '@/components/cms/TeamMembersList';
import ResourcesList from '@/components/cms/ResourcesList';

const CMS = () => {
  const { userRole } = useAuth();
  const [activeTab, setActiveTab] = useState('articles');

  // Only admins and staff can access CMS
  if (userRole !== 'admin' && userRole !== 'staff') {
    return (
      <div className="min-h-screen bg-gray-50">
        <DashboardHeader />
        <div className="p-6">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
            <p className="text-gray-600">You don't have permission to access the Content Management System.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader />
      
      <main className="p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Content Management System</h1>
          <p className="text-gray-600">Manage articles, programs, events, team members, and resources</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="articles" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Articles
            </TabsTrigger>
            <TabsTrigger value="programs" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Programs
            </TabsTrigger>
            <TabsTrigger value="events" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Events
            </TabsTrigger>
            <TabsTrigger value="team" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Team
            </TabsTrigger>
            <TabsTrigger value="resources" className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Resources
            </TabsTrigger>
          </TabsList>

          <TabsContent value="articles">
            <ArticlesList />
          </TabsContent>

          <TabsContent value="programs">
            <ProgramsList />
          </TabsContent>

          <TabsContent value="events">
            <EventsList />
          </TabsContent>

          <TabsContent value="team">
            <TeamMembersList />
          </TabsContent>

          <TabsContent value="resources">
            <ResourcesList />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default CMS;
