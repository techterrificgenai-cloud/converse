
'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Logo } from '@/components/icons';
import { useLocalStorage } from '@/hooks/use-local-storage';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address.'),
  password: z.string().min(1, 'Password is required.'),
});

const ORGANIZER_EMAIL = 'organizer@conferverse.com';
const SPEAKER_EMAIL = 'speaker@conferverse.com';

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [, setAuthStatus] = useLocalStorage('auth-status', { loggedIn: false, role: null });

  const role = searchParams.get('role');
  
  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: role === 'organizer' ? ORGANIZER_EMAIL : (role === 'speaker' ? SPEAKER_EMAIL : ''),
      password: 'password', // dummy password
    },
  });

  useEffect(() => {
    const defaultEmail = role === 'organizer' ? ORGANIZER_EMAIL : (role === 'speaker' ? SPEAKER_EMAIL : '');
    form.setValue('email', defaultEmail);
  }, [role, form]);

  const onSubmit = (values: z.infer<typeof loginSchema>) => {
    if (values.email === ORGANIZER_EMAIL) {
      setAuthStatus({ loggedIn: true, role: 'organizer' });
      router.push('/organizer');
    } else {
      // For this prototype, any other email is treated as a speaker
      setAuthStatus({ loggedIn: true, role: 'speaker' });
      router.push('/speaker');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <div className="flex justify-center items-center gap-2 mb-4">
            <Logo className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold tracking-tight text-foreground">ConferVerse</span>
          </div>
          <CardTitle>Welcome Back</CardTitle>
          <CardDescription>Enter your credentials to access your dashboard.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="organizer@conferverse.com"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full">
                Login
              </Button>
              <div className="mt-4 text-center text-sm">
                Don't have a speaker account?{' '}
                <Link href="/signup" className="underline">
                  Sign up
                </Link>
              </div>
              <div className="mt-2 text-center text-sm">
                <Link href="/" className="underline">
                  Back to Landing Page
                </Link>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
