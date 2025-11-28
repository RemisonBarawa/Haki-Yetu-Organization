
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { Json } from '@/integrations/supabase/types';

interface SignupWorkflow {
  id: string;
  user_id: string;
  current_step: number;
  role_intent: 'client' | 'volunteer' | 'staff' | 'admin' | null;
  signup_data: Record<string, any>;
  status: string | null;
  created_at: string;
  updated_at: string;
}

export const useSignupWorkflow = () => {
  const { user } = useAuth();
  const [workflow, setWorkflow] = useState<SignupWorkflow | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchWorkflow();
    } else {
      setLoading(false);
    }
  }, [user]);

  const convertJsonToRecord = (json: Json): Record<string, any> => {
    if (json === null || typeof json !== 'object' || Array.isArray(json)) {
      return {};
    }
    return json as Record<string, any>;
  };

  const fetchWorkflow = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('signup_workflows')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching signup workflow:', error);
      } else if (data) {
        const convertedWorkflow: SignupWorkflow = {
          ...data,
          signup_data: convertJsonToRecord(data.signup_data)
        };
        setWorkflow(convertedWorkflow);
      }
    } catch (error) {
      console.error('Error fetching signup workflow:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateWorkflow = async (updates: Partial<SignupWorkflow>) => {
    if (!user || !workflow) return;

    try {
      const { data, error } = await supabase
        .from('signup_workflows')
        .update(updates)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) {
        console.error('Error updating signup workflow:', error);
        return { error };
      }

      if (data) {
        const convertedWorkflow: SignupWorkflow = {
          ...data,
          signup_data: convertJsonToRecord(data.signup_data)
        };
        setWorkflow(convertedWorkflow);
      }
      return { data };
    } catch (error) {
      console.error('Error updating signup workflow:', error);
      return { error };
    }
  };

  const completeSignup = async (roleIntent: 'client' | 'volunteer' | 'staff', roleData: Record<string, any>) => {
    if (!user) return;

    try {
      // Update workflow as completed
      await updateWorkflow({
        role_intent: roleIntent,
        signup_data: roleData,
        status: roleIntent === 'staff' ? 'requires_approval' : 'completed',
        current_step: 4
      });

      // Assign role if not staff (staff requires approval)
      if (roleIntent !== 'staff') {
        const { error: roleError } = await supabase
          .from('user_roles')
          .insert({
            user_id: user.id,
            role: roleIntent
          });

        if (roleError) {
          console.error('Error assigning role:', roleError);
        }
      } else {
        // Create approval request for staff
        const { error: approvalError } = await supabase
          .from('approval_requests')
          .insert({
            user_id: user.id,
            requested_role: 'staff',
            justification: roleData.justification || 'Staff access request'
          });

        if (approvalError) {
          console.error('Error creating approval request:', approvalError);
        }
      }

      return { success: true };
    } catch (error) {
      console.error('Error completing signup:', error);
      return { error };
    }
  };

  return {
    workflow,
    loading,
    updateWorkflow,
    completeSignup,
    refetch: fetchWorkflow
  };
};
