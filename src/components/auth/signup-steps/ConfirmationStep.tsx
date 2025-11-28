
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, Check, AlertCircle } from 'lucide-react';
import { SignupData } from '../MultiStepSignup';

interface ConfirmationStepProps {
  data: SignupData;
  onSubmit: () => void;
  onPrev: () => void;
  isLoading: boolean;
}

const ConfirmationStep = ({ data, onSubmit, onPrev, isLoading }: ConfirmationStepProps) => {
  const getRoleTitle = () => {
    switch (data.roleIntent) {
      case 'staff': return 'Staff Member';
      case 'admin': return 'Administrator';
      default: return 'Unknown Role';
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-semibold mb-2">Confirm Your Registration</h3>
        <p className="text-gray-600">Please review your information before submitting</p>
      </div>

      <Card>
        <CardContent className="p-6 space-y-4">
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-500">Full Name</label>
              <p className="text-gray-900">{data.fullName}</p>
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-500">Email</label>
              <p className="text-gray-900">{data.email}</p>
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-500">Phone</label>
              <p className="text-gray-900">{data.phone}</p>
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-500">Office Location</label>
              <p className="text-gray-900">{data.officeLocation}</p>
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-500">Role</label>
              <p className="text-gray-900">{getRoleTitle()}</p>
            </div>

            {data.roleIntent === 'admin' && data.roleSpecificData?.justification && (
              <div>
                <label className="text-sm font-medium text-gray-500">Admin Justification</label>
                <p className="text-gray-900 text-sm">{data.roleSpecificData.justification}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {data.roleIntent === 'admin' && (
        <Card className="border-yellow-200 bg-yellow-50">
          <CardContent className="p-4">
            <div className="flex items-start space-x-3">
              <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-yellow-800">Pending Approval</h4>
                <p className="text-sm text-yellow-700 mt-1">
                  Your administrator request will be reviewed by existing administrators. 
                  You'll receive an email notification once your request is processed.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {data.roleIntent === 'staff' && (
        <Card className="border-green-200 bg-green-50">
          <CardContent className="p-4">
            <div className="flex items-start space-x-3">
              <Check className="h-5 w-5 text-green-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-green-800">Ready to Register</h4>
                <p className="text-sm text-green-700 mt-1">
                  Your staff account will be created immediately after email verification.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="flex justify-between">
        <Button type="button" variant="outline" onClick={onPrev}>
          Previous
        </Button>
        <Button 
          onClick={onSubmit}
          disabled={isLoading}
          className="bg-green-600 hover:bg-green-700"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating Account...
            </>
          ) : (
            'Create Account'
          )}
        </Button>
      </div>
    </div>
  );
};

export default ConfirmationStep;
