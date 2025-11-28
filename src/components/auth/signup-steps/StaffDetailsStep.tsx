
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { SignupData } from '../MultiStepSignup';

interface StaffDetailsStepProps {
  data: SignupData;
  updateData: (data: Partial<SignupData>) => void;
  onNext: () => void;
  onPrev: () => void;
}

const StaffDetailsStep = ({ data, updateData, onNext, onPrev }: StaffDetailsStepProps) => {
  const handleNext = () => {
    if (data.phone && data.officeLocation) {
      onNext();
    }
  };

  const isValid = data.phone.trim() && data.officeLocation.trim();

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="phone">Phone Number *</Label>
          <Input
            id="phone"
            type="tel"
            value={data.phone}
            onChange={(e) => updateData({ phone: e.target.value })}
            placeholder="Your phone number"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="office-location">Office Location *</Label>
          <Input
            id="office-location"
            value={data.officeLocation}
            onChange={(e) => updateData({ officeLocation: e.target.value })}
            placeholder="Your office or work location"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="role">Role</Label>
          <select
            id="role"
            value={data.roleIntent}
            onChange={(e) => updateData({ roleIntent: e.target.value as 'staff' | 'admin' })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="staff">Staff Member</option>
            <option value="admin">Administrator</option>
          </select>
          <p className="text-sm text-gray-500">
            Admin access requires approval from existing administrators
          </p>
        </div>
      </div>

      <div className="flex justify-between">
        <Button type="button" variant="outline" onClick={onPrev}>
          Previous
        </Button>
        <Button 
          type="button" 
          onClick={handleNext}
          disabled={!isValid}
          className="bg-green-600 hover:bg-green-700"
        >
          Continue
        </Button>
      </div>
    </div>
  );
};

export default StaffDetailsStep;
