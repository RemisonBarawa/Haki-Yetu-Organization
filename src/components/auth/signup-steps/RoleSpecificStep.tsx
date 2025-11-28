
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { SignupData } from '../MultiStepSignup';

interface RoleSpecificStepProps {
  data: SignupData;
  updateData: (data: Partial<SignupData>) => void;
  onNext: () => void;
  onPrev: () => void;
}

const RoleSpecificStep = ({ data, updateData, onNext, onPrev }: RoleSpecificStepProps) => {
  const handleNext = () => {
    // For staff role, no additional requirements
    if (data.roleIntent === 'staff') {
      onNext();
      return;
    }
    
    // For admin role, require justification
    if (data.roleIntent === 'admin' && data.roleSpecificData?.justification?.trim()) {
      onNext();
      return;
    }
  };

  const isValid = () => {
    if (data.roleIntent === 'staff') return true;
    if (data.roleIntent === 'admin') {
      return data.roleSpecificData?.justification?.trim();
    }
    return false;
  };

  const updateRoleData = (key: string, value: any) => {
    updateData({
      roleSpecificData: {
        ...data.roleSpecificData,
        [key]: value
      }
    });
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-semibold mb-2">
          {data.roleIntent === 'staff' ? 'Staff Information' : 'Administrator Request'}
        </h3>
        <p className="text-gray-600">
          {data.roleIntent === 'staff' 
            ? 'Complete your staff profile' 
            : 'Administrator access requires additional approval'
          }
        </p>
      </div>

      {data.roleIntent === 'staff' && (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="department">Department (Optional)</Label>
            <Input
              id="department"
              value={data.roleSpecificData?.department || ''}
              onChange={(e) => updateRoleData('department', e.target.value)}
              placeholder="Your department or unit"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="supervisor">Supervisor (Optional)</Label>
            <Input
              id="supervisor"
              value={data.roleSpecificData?.supervisor || ''}
              onChange={(e) => updateRoleData('supervisor', e.target.value)}
              placeholder="Your direct supervisor"
            />
          </div>
        </div>
      )}

      {data.roleIntent === 'admin' && (
        <div className="space-y-4">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h4 className="font-medium text-yellow-800 mb-2">Administrator Access</h4>
            <p className="text-sm text-yellow-700">
              Administrator roles require approval from existing administrators. 
              Please provide justification for why you need admin access.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="justification">Justification *</Label>
            <Textarea
              id="justification"
              value={data.roleSpecificData?.justification || ''}
              onChange={(e) => updateRoleData('justification', e.target.value)}
              placeholder="Explain why you need administrator access..."
              className="min-h-32"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="reference">Reference Contact (Optional)</Label>
            <Input
              id="reference"
              value={data.roleSpecificData?.reference || ''}
              onChange={(e) => updateRoleData('reference', e.target.value)}
              placeholder="Name and contact of someone who can verify your role"
            />
          </div>
        </div>
      )}

      <div className="flex justify-between">
        <Button type="button" variant="outline" onClick={onPrev}>
          Previous
        </Button>
        <Button 
          type="button" 
          onClick={handleNext}
          disabled={!isValid()}
          className="bg-green-600 hover:bg-green-700"
        >
          Continue
        </Button>
      </div>
    </div>
  );
};

export default RoleSpecificStep;
