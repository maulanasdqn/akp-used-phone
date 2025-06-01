import { FC, ReactElement, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  Button,
  Input,
  Label,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Checkbox,
} from '@/shared/web/components';
import { Eye, EyeOff, Lock, Sparkles, User, Mail } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  userLoginSchema,
  userRegistrationSchema,
} from '@/shared/api/app/client';
import { authClient } from '../../../auth';
import z from 'zod';
import { toast } from 'sonner';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const AuthModal: FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}): ReactElement => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  const loginForm = useForm<z.infer<typeof userLoginSchema>>({
    mode: 'all',
    resolver: zodResolver(userLoginSchema),
  });

  const registerForm = useForm<z.infer<typeof userRegistrationSchema>>({
    mode: 'all',
    resolver: zodResolver(userRegistrationSchema),
  });

  const { signIn, signUp } = authClient;

  const onLoginSubmit = loginForm.handleSubmit(async (data) => {
    await signIn.email(
      {
        email: data.email,
        password: data.password,
        rememberMe: true,
      },
      {
        onSuccess: () => {
          toast.success('Login successful!');
          onSuccess();
          onClose();
        },
        onError: (error) => {
          toast.error(error?.error?.message || 'Login failed');
        },
      }
    );
  });

  const onRegisterSubmit = registerForm.handleSubmit(async (data) => {
    await signUp.email(
      {
        name: data.name,
        email: data.email,
        password: data.password,
        image: 'https://svgsilh.com/svg_v2/659651.svg',
      },
      {
        onSuccess: () => {
          toast.success('Registration successful! Please login.');
          setIsLogin(true);
          registerForm.reset();
        },
        onError: (error) => {
          toast.error(error?.error?.message || 'Registration failed');
        },
      }
    );
  });

  const switchMode = () => {
    setIsLogin(!isLogin);
    setShowPassword(false);
    loginForm.reset();
    registerForm.reset();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-full max-w-md bg-white/95 backdrop-blur-md border-0 rounded-2xl shadow-2xl">
        <DialogHeader className="space-y-4 text-center pb-6">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl flex items-center justify-center mb-4">
            {isLogin ? (
              <Lock className="w-8 h-8 text-white" />
            ) : (
              <User className="w-8 h-8 text-white" />
            )}
          </div>
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            {isLogin ? 'Welcome Back!' : 'Join PhoneMarket'}
          </DialogTitle>
          <p className="text-gray-600">
            {isLogin
              ? 'Sign in to complete your purchase'
              : 'Create an account to get started'}
          </p>
        </DialogHeader>

        <div className="space-y-6">
          {isLogin ? (
            <Form {...loginForm}>
              <form className="space-y-4" onSubmit={onLoginSubmit}>
                <FormField
                  control={loginForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700 font-medium">
                        Email Address
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                          <Input
                            type="email"
                            placeholder="Enter your email"
                            className="pl-10 border-purple-200 focus:ring-purple-500 rounded-xl"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={loginForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700 font-medium">
                        Password
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                          <Input
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Enter your password"
                            className="pl-10 pr-10 border-purple-200 focus:ring-purple-500 rounded-xl"
                            {...field}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? (
                              <EyeOff className="h-4 w-4 text-gray-400" />
                            ) : (
                              <Eye className="h-4 w-4 text-gray-400" />
                            )}
                          </Button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="remember" />
                    <Label
                      htmlFor="remember"
                      className="text-sm text-gray-600 cursor-pointer"
                    >
                      Remember me
                    </Label>
                  </div>
                  <Button
                    variant="link"
                    className="px-0 text-sm text-purple-600 hover:text-purple-700"
                  >
                    Forgot password?
                  </Button>
                </div>

                <Button
                  type="submit"
                  disabled={!loginForm.formState.isValid}
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-xl py-3 font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4" />
                    Sign In
                  </div>
                </Button>
              </form>
            </Form>
          ) : (
            <Form {...registerForm}>
              <form className="space-y-4" onSubmit={onRegisterSubmit}>
                <FormField
                  control={registerForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700 font-medium">
                        Full Name
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                          <Input
                            type="text"
                            placeholder="Enter your full name"
                            className="pl-10 border-purple-200 focus:ring-purple-500 rounded-xl"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={registerForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700 font-medium">
                        Email Address
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                          <Input
                            type="email"
                            placeholder="Enter your email"
                            className="pl-10 border-purple-200 focus:ring-purple-500 rounded-xl"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={registerForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700 font-medium">
                        Password
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                          <Input
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Create a password"
                            className="pl-10 pr-10 border-purple-200 focus:ring-purple-500 rounded-xl"
                            {...field}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? (
                              <EyeOff className="h-4 w-4 text-gray-400" />
                            ) : (
                              <Eye className="h-4 w-4 text-gray-400" />
                            )}
                          </Button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  disabled={!registerForm.formState.isValid}
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-xl py-3 font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4" />
                    Create Account
                  </div>
                </Button>
              </form>
            </Form>
          )}

          <div className="text-center pt-4 border-t border-purple-100">
            <p className="text-sm text-gray-600">
              {isLogin ? "Don't have an account?" : 'Already have an account?'}
              <Button
                variant="link"
                onClick={switchMode}
                className="px-2 text-purple-600 hover:text-purple-700 font-semibold"
              >
                {isLogin ? 'Sign up' : 'Sign in'}
              </Button>
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
