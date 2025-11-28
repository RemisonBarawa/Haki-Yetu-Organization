
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, Eye, Download, FileText, File } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const ResourcesList = () => {
  const { toast } = useToast();

  const { data: resources, isLoading, refetch } = useQuery({
    queryKey: ['resources'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('resources')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });

  const deleteResource = async (id: string) => {
    const { error } = await supabase
      .from('resources')
      .delete()
      .eq('id', id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to delete resource",
        variant: "destructive"
      });
    } else {
      toast({
        title: "Success",
        description: "Resource deleted successfully"
      });
      refetch();
    }
  };

  const getCategoryLabel = (category: string) => {
    const labels = {
      legal_guide: 'Legal Guide',
      case_study: 'Case Study',
      report: 'Report',
      form: 'Form',
      other: 'Other'
    };
    return labels[category as keyof typeof labels] || category;
  };

  const getFileIcon = (fileType: string) => {
    if (fileType.includes('pdf')) return <FileText className="h-5 w-5" />;
    return <File className="h-5 w-5" />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (isLoading) {
    return <div className="text-center py-8">Loading resources...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Resources</h2>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Upload Resource
        </Button>
      </div>

      <div className="grid gap-4">
        {resources?.map((resource) => (
          <Card key={resource.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 p-2 bg-gray-100 rounded-lg">
                  {getFileIcon(resource.file_type)}
                </div>
                
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{resource.title}</CardTitle>
                      <CardDescription className="mt-1">
                        {getCategoryLabel(resource.category)}
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={resource.is_public ? 'default' : 'secondary'}>
                        {resource.is_public ? 'Public' : 'Private'}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {resource.description && (
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">{resource.description}</p>
              )}
              
              <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-4">
                <span>Type: {resource.file_type}</span>
                {resource.file_size && (
                  <span>Size: {formatFileSize(resource.file_size)}</span>
                )}
                <span>Downloads: {resource.download_count}</span>
              </div>

              {resource.tags && resource.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {resource.tags.map((tag, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}

              <div className="flex justify-between items-center">
                <Button variant="outline" size="sm" className="flex items-center gap-1">
                  <Download className="h-4 w-4" />
                  Download
                </Button>
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
                    onClick={() => deleteResource(resource.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        
        {(!resources || resources.length === 0) && (
          <Card className="text-center py-12">
            <CardContent>
              <Download className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No resources yet</h3>
              <p className="text-gray-600 mb-4">Upload documents, guides, and other resources</p>
              <Button className="flex items-center gap-2 mx-auto">
                <Plus className="h-4 w-4" />
                Upload First Resource
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default ResourcesList;
