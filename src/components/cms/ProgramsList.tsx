
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, Eye } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const ProgramsList = () => {
  const { toast } = useToast();

  const { data: programs, isLoading, refetch } = useQuery({
    queryKey: ['programs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('programs')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });

  const deleteProgram = async (id: string) => {
    const { error } = await supabase
      .from('programs')
      .delete()
      .eq('id', id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to delete program",
        variant: "destructive"
      });
    } else {
      toast({
        title: "Success",
        description: "Program deleted successfully"
      });
      refetch();
    }
  };

  const getThematicAreaLabel = (area: string) => {
    const labels = {
      land_housing: 'Land & Housing',
      gender_law: 'Gender & Law',
      governance: 'Governance',
      cohesion: 'Social Cohesion'
    };
    return labels[area as keyof typeof labels] || area;
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      active: 'default',
      completed: 'secondary',
      planned: 'outline'
    } as const;
    
    return <Badge variant={variants[status as keyof typeof variants]}>{status}</Badge>;
  };

  if (isLoading) {
    return <div className="text-center py-8">Loading programs...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Programs</h2>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          New Program
        </Button>
      </div>

      <div className="grid gap-4">
        {programs?.map((program) => (
          <Card key={program.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <CardTitle className="text-lg">{program.title}</CardTitle>
                  <CardDescription className="mt-1">
                    {getThematicAreaLabel(program.thematic_area)}
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2 ml-4">
                  {getStatusBadge(program.status)}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                {program.description}
              </p>
              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-600">
                  {program.objectives?.length || 0} objectives • {program.activities?.length || 0} activities
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="destructive" 
                    size="sm"
                    onClick={() => deleteProgram(program.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        
        {(!programs || programs.length === 0) && (
          <Card className="text-center py-12">
            <CardContent>
              <Plus className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No programs yet</h3>
              <p className="text-gray-600 mb-4">Create programs for your thematic areas</p>
              <Button className="flex items-center gap-2 mx-auto">
                <Plus className="h-4 w-4" />
                Create First Program
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default ProgramsList;
