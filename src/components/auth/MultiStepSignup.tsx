
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import BasicInfoStep from './signup-steps/BasicInfoStep';
import StaffDetailsStep from './signup-steps/StaffDetailsStep';
import ConfirmationStep from './signup-steps/ConfirmationStep';

export interface SignupData {
  email: string;
  password: string;
  fullName: string;
  phone: string;
  officeLocation: string;
  roleIntent: 'staff' | 'admin';
  roleSpecificData: Record<string, any>;
}

const MultiStepSignup = () => {
  const { signUp } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [signupData, setSignupData] = useState<SignupData>({
    email: '',
    password: '',
    fullName: '',
    phone: '',
    officeLocation: '',
    roleIntent: 'staff',
    roleSpecificData: {}
  });

  const totalSteps = 3;
  const progress = (currentStep / totalSteps) * 100;

  const updateSignupData = (newData: Partial<SignupData>) => {
    setSignupData(prev => ({ ...prev, ...newData }));
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const { error } = await signUp(
        signupData.email, 
        signupData.password, 
        signupData.fullName
      );
      
      if (!error) {
        console.log('Staff signup successful');
      }
    } catch (error) {
      console.error('Signup error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStepTitle = () => {
    switch (currentStep) {
      case 1: return 'Basic Information';
      case 2: return 'Staff Details';
      case 3: return 'Confirm & Submit';
      default: return 'Staff Registration';
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between mb-4">
            <CardTitle className="text-2xl">{getStepTitle()}</CardTitle>
            <span className="text-sm text-gray-500">
              Step {currentStep} of {totalSteps}
            </span>
          </div>
          <Progress value={progress} className="w-full" />
          <p className="text-sm text-gray-600 mt-2">
            Staff registration - for organization members only
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {currentStep === 1 && (
            <BasicInfoStep
              data={signupData}
              updateData={updateSignupData}
              onNext={nextStep}
            />
          )}
          
          {currentStep === 2 && (
            <StaffDetailsStep
              data={signupData}
              updateData={updateSignupData}
              onNext={nextStep}
              onPrev={prevStep}
            />
          )}
          
          {currentStep === 3 && (
            <ConfirmationStep
              data={signupData}
              onSubmit={handleSubmit}
              onPrev={prevStep}
              isLoading={isLoading}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default MultiStepSignup;
