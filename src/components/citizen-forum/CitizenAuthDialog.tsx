
import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';

interface CitizenAuthDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onAuth: (citizenData: any) => void;
}

const CitizenAuthDialog = ({ isOpen, onClose, onAuth }: CitizenAuthDialogProps) => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('signin');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: ''
  });

  const signIn = useMutation({
    mutationFn: async (email: string) => {
      const { data, error } = await supabase
        .from('citizens')
        .select('*')
        .eq('email', email)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      return data;
    },
    onSuccess: (data) => {
      if (data) {
        onAuth(data);
        onClose();
        toast({
          title: "Welcome back!",
          description: "You have been signed in successfully"
        });
      } else {
        toast({
          title: "Account not found",
          description: "Please register first or check your email",
          variant: "destructive"
        });
      }
    },
    onError: (error: any) => {
      console.error('Sign in error:', error);
      toast({
        title: "Error",
        description: "Failed to sign in",
        variant: "destructive"
      });
    }
  });

  const register = useMutation({
    mutationFn: async (citizenData: any) => {
      const { data, error } = await supabase
        .from('citizens')
        .insert(citizenData)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      onAuth(data);
      onClose();
      toast({
        title: "Welcome!",
        description: "Your account has been created successfully"
      });
    },
    onError: (error: any) => {
      console.error('Registration error:', error);
      if (error.code === '23505') {
        toast({
          title: "Email already exists", 
          description: "Please use the sign in option instead",
          variant: "destructive"
        });
        setActiveTab('signin');
      } else {
        toast({
          title: "Error",
          description: "Failed to create account",
          variant: "destructive"
        });
      }
    }
  });

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email.trim()) {
      toast({
        title: "Validation Error",
        description: "Please enter your email",
        variant: "destructive"
      });
      return;
    }
    signIn.mutate(formData.email);
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim()) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }
    register.mutate({
      name: formData.name,
      email: formData.email,
      phone: formData.phone || null
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gray-900 border-gray-700 text-white max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
            Join the Conversation
          </DialogTitle>
        </DialogHeader>
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2 bg-gray-800">
            <TabsTrigger value="signin" className="text-white">Sign In</TabsTrigger>
            <TabsTrigger value="register" className="text-white">Register</TabsTrigger>
          </TabsList>
          
          <TabsContent value="signin" className="space-y-4">
            <form onSubmit={handleSignIn} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="signin-email">Email *</Label>
                <Input
                  id="signin-email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="your@email.com"
                  className="bg-white/10 border-white/20 text-white"
                  required
                />
              </div>
              
              <Button
                type="submit"
                disabled={signIn.isPending}
                className="w-full bg-green-600 hover:bg-green-700"
              >
                {signIn.isPending ? 'Signing in...' : 'Sign In'}
              </Button>
            </form>
          </TabsContent>
          
          <TabsContent value="register" className="space-y-4">
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="register-name">Full Name *</Label>
                <Input
                  id="register-name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Your full name"
                  className="bg-white/10 border-white/20 text-white"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="register-email">Email *</Label>
                <Input
                  id="register-email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="your@email.com"
                  className="bg-white/10 border-white/20 text-white"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="register-phone">Phone (Optional)</Label>
                <Input
                  id="register-phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="Your phone number"
                  className="bg-white/10 border-white/20 text-white"
                />
              </div>
              
              <Button
                type="submit"
                disabled={register.isPending}
                className="w-full bg-green-600 hover:bg-green-700"
              >
                {register.isPending ? 'Creating account...' : 'Create Account'}
              </Button>
            </form>
          </TabsContent>
        </Tabs>
        
        <div className="bg-blue-900/30 border border-blue-500/30 rounded-lg p-3 mt-4">
          <p className="text-blue-300 text-xs">
            <strong>Simple Access:</strong> No passwords required. We use email-based identification 
            to keep things simple while ensuring your posts are attributed to you.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CitizenAuthDialog;
