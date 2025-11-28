
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Users, Shield } from 'lucide-react';
import { SignupData } from '../MultiStepSignup';

interface RoleSelectionStepProps {
  data: SignupData;
  updateData: (data: Partial<SignupData>) => void;
  onNext: () => void;
}

const RoleSelectionStep = ({ data, updateData, onNext }: RoleSelectionStepProps) => {
  const roles = [
    {
      id: 'staff' as const,
      title: 'Staff Member',
      description: 'Regular staff member with standard access',
      icon: Users,
      color: 'border-blue-200 hover:border-blue-400'
    },
    {
      id: 'admin' as const,
      title: 'Administrator',
      description: 'Full administrative access (requires approval)',
      icon: Shield,
      color: 'border-purple-200 hover:border-purple-400'
    }
  ];

  const handleRoleSelect = (roleId: 'staff' | 'admin') => {
    updateData({ roleIntent: roleId });
  };

  const handleNext = () => {
    if (data.roleIntent) {
      onNext();
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-semibold mb-2">Select Your Role</h3>
        <p className="text-gray-600">Choose the role that best describes your position</p>
      </div>

      <div className="grid gap-4">
        {roles.map((role) => {
          const Icon = role.icon;
          return (
            <Card
              key={role.id}
              className={`cursor-pointer transition-colors ${role.color} ${
                data.roleIntent === role.id ? 'ring-2 ring-blue-500 bg-blue-50' : ''
              }`}
              onClick={() => handleRoleSelect(role.id)}
            >
              <CardContent className="p-4">
                <div className="flex items-start space-x-3">
                  <Icon className="h-6 w-6 mt-1 text-gray-600" />
                  <div className="flex-1">
                    <h4 className="font-medium">{role.title}</h4>
                    <p className="text-sm text-gray-600 mt-1">{role.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Button 
        onClick={handleNext}
        disabled={!data.roleIntent}
        className="w-full bg-green-600 hover:bg-green-700"
      >
        Continue
      </Button>
    </div>
  );
};

export default RoleSelectionStep;
