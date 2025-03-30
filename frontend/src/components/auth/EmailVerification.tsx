
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';

// Form validation schema
const verifyEmailSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

type VerifyEmailFormValues = z.infer<typeof verifyEmailSchema>;

const EmailVerification: React.FC = () => {
  const { verifyEmail } = useAuth();
  const navigate = useNavigate();
  const [isVerified, setIsVerified] = useState(false);
  
  const form = useForm<VerifyEmailFormValues>({
    resolver: zodResolver(verifyEmailSchema),
    defaultValues: {
      email: '',
    }
  });
  
  const onSubmit = async (values: VerifyEmailFormValues) => {
    try {
      await verifyEmail(values.email);
      setIsVerified(true);
      
      // Reset form
      form.reset();
    } catch (error) {
      // Error is handled in the auth context
    }
  };
  
  return (
    <Card className="auth-card">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Verify Your Email</CardTitle>
        <CardDescription>
          {isVerified 
            ? "Your email has been verified successfully!" 
            : "Enter your email to verify your account"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isVerified ? (
          <div className="text-center space-y-4">
            <div className="bg-green-100 text-green-800 p-4 rounded-md">
              Your email has been verified successfully!
            </div>
            <Button onClick={() => navigate('/login')} className="w-full">
              Proceed to Login
            </Button>
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="john.doe@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? 'Verifying...' : 'Verify Email'}
              </Button>
              
              <p className="text-sm text-gray-500 text-center">
                In a real application, you would receive an email with a verification link.
                For this demo, we're simulating email verification.
              </p>
            </form>
          </Form>
        )}
      </CardContent>
      <CardFooter className="flex justify-center">
        <p className="text-sm text-gray-500">
          <Link to="/login" className="text-primary font-medium hover:underline">
            Back to Login
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
};

export default EmailVerification;
