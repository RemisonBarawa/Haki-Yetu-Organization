
import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, Shield } from 'lucide-react';
import MultiStepSignup from './MultiStepSignup';

const AuthPage = () => {
  const { user, loading, signIn } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  // Redirect if already authenticated
  if (!loading && user) {
    return <Navigate to="/dashboard" replace />;
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    
    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    await signIn(email, password);
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to-green-900 px-4 py-8">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Shield className="h-12 w-12 text-green-400 mr-3" />
            <h1 className="text-3xl font-bold text-white">Haki Yetu</h1>
          </div>
          <p className="text-gray-400">Staff Authentication Portal</p>
          <p className="text-sm text-gray-500 mt-2">
            For organization staff and administrators only
          </p>
        </div>

        <Tabs defaultValue="signin" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-gray-800">
            <TabsTrigger value="signin" className="text-white data-[state=active]:bg-green-600">
              Sign In
            </TabsTrigger>
            <TabsTrigger value="signup" className="text-white data-[state=active]:bg-green-600">
              Staff Registration
            </TabsTrigger>
          </TabsList>

          <TabsContent value="signin">
            <div className="flex justify-center">
              <div className="w-full max-w-md">
                <Card className="bg-gray-800 border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-white">Staff Sign In</CardTitle>
                    <CardDescription className="text-gray-400">
                      Access your staff dashboard and administrative tools
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSignIn} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="signin-email" className="text-white">Email</Label>
                        <Input
                          id="signin-email"
                          name="email"
                          type="email"
                          placeholder="staff@hakiyetu.org"
                          className="bg-gray-700 border-gray-600 text-white"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="signin-password" className="text-white">Password</Label>
                        <Input
                          id="signin-password"
                          name="password"
                          type="password"
                          className="bg-gray-700 border-gray-600 text-white"
                          required
                        />
                      </div>
                      <Button 
                        type="submit" 
                        className="w-full bg-green-600 hover:bg-green-700"
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Signing in...
                          </>
                        ) : (
                          'Sign In'
                        )}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="signup">
            <MultiStepSignup />
          </TabsContent>
        </Tabs>

        <div className="mt-8 text-center">
          <p className="text-gray-500 text-sm">
            Looking to share your voice as a citizen?{' '}
            <a href="/community" className="text-green-400 hover:text-green-300">
              Visit our Community Forum
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
