import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Checkbox,
  Input,
  Label,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/shared/web/components';
import { Eye, EyeOff, Lock } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router';
import { zodResolver } from '@hookform/resolvers/zod';
import { userRegistrationSchema } from '@/shared/api/app/v1/iam/users/users-schema';
import { authClient } from '../../../../auth';
import z from 'zod';
import { toast } from 'sonner';

export default function Component() {
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<z.infer<typeof userRegistrationSchema>>({
    mode: 'all',
    resolver: zodResolver(userRegistrationSchema),
  });

  const { signUp } = authClient;

  const navigate = useNavigate();

  const onSubmit = form.handleSubmit(async (data) => {
    await signUp.email(
      {
        name: data.name,
        email: data.email,
        password: data.password,
        image: 'https://svgsilh.com/svg_v2/659651.svg',
      },
      {
        onSuccess: () => {
          toast.success('Register Successfully');
          navigate('/auth/login');
        },
        onError: (error) => {
          toast.error(error?.error?.message);
        },
      }
    );
  });

  return (
    <Card className="w-full max-w-md shadow-lg border-0 bg-white/80 backdrop-blur-sm">
      <CardHeader className="space-y-1 text-center pb-8">
        <div className="mx-auto w-12 h-12 bg-gradient-to-br from-slate-900 to-slate-700 rounded-xl flex items-center justify-center mb-4">
          <Lock className="w-6 h-6 text-white" />
        </div>
        <CardTitle className="text-2xl font-semibold tracking-tight">
          AKP Used Phone Backoffice
        </CardTitle>
        <CardDescription className="text-slate-600">
          Register New Account
        </CardDescription>
      </CardHeader>

      <CardContent>
        <Form {...form}>
          <form className="space-y-6" onSubmit={onSubmit}>
            <div className="space-y-4">
              <div className="space-y-2">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Fullname</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="Enter your name"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="space-y-2">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="Enter your email"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="space-y-2">
                <div className="relative">
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Enter your password"
                            {...field}
                          />
                        </FormControl>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-3 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4 text-slate-400" />
                          ) : (
                            <Eye className="h-4 w-4 text-slate-400" />
                          )}
                        </Button>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox id="remember" />
                <Label
                  htmlFor="remember"
                  className="text-sm font-medium text-slate-600 cursor-pointer"
                >
                  Remember me
                </Label>
              </div>
              <Button
                variant="link"
                className="px-0 text-sm text-slate-600 hover:text-slate-900"
              >
                Forgot password?
              </Button>
            </div>

            <Button
              disabled={!form.formState.isValid}
              className="w-full h-11 bg-slate-900 hover:bg-slate-800 text-white font-medium"
            >
              Sign Up
            </Button>
          </form>
        </Form>
      </CardContent>

      <CardFooter className="flex flex-col space-y-4 pt-6">
        <div className="text-center text-sm text-slate-600">
          Already have an account?{' '}
          <Link to="/auth/login">
            <Button
              variant="link"
              className="px-0 text-slate-900 hover:text-slate-700 cursor-pointer font-medium"
            >
              Sign In
            </Button>
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
}
