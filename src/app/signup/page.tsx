
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Logo } from '@/components/icons';
import { useToast } from '@/hooks/use-toast';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import Link from 'next/link';

const step1Schema = z.object({
    name: z.string().min(2, 'Name is required.'),
    email: z.string().email('Please enter a valid email address.'),
    password: z.string().min(8, 'Password must be at least 8 characters.'),
    dob: z.date({
        required_error: "A date of birth is required.",
    }),
});

const step2Schema = z.object({
    profession: z.string().min(2, 'Profession is required.'),
    qualifications: z.string().min(5, 'Qualifications are required.'),
    bio: z.string().min(20, 'Bio must be at least 20 characters.'),
});

const step3Schema = z.object({
    skills: z.string().min(3, 'Please list at least one skill.'),
    preferredTrack: z.enum(['AI & ML', 'Cloud Native', 'Frontend', 'DevOps', 'Security']),
});

type Step1Data = z.infer<typeof step1Schema>;
type Step2Data = z.infer<typeof step2Schema>;
type Step3Data = z.infer<typeof step3Schema>;


export default function SignUpPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [, setAuthStatus] = useLocalStorage('auth-status', { loggedIn: false, role: null });
  const [step, setStep] = useState(1);

  const [step1Data, setStep1Data] = useState<Partial<Step1Data>>({});
  const [step2Data, setStep2Data] = useState<Partial<Step2Data>>({});

  const formStep1 = useForm<Step1Data>({ resolver: zodResolver(step1Schema) });
  const formStep2 = useForm<Step2Data>({ resolver: zodResolver(step2Schema) });
  const formStep3 = useForm<Step3Data>({ resolver: zodResolver(step3Schema) });

  const handleNextStep1 = (data: Step1Data) => {
    setStep1Data(data);
    setStep(2);
  };

  const handleNextStep2 = (data: Step2Data) => {
    setStep2Data(data);
    setStep(3);
  };
  
  const handleFinalSubmit = (data: Step3Data) => {
    // In a real app, you would compile all data and send to a server
    const finalData = { ...step1Data, ...step2Data, ...data };
    console.log('Final Registration Data:', finalData);

    // For the prototype, we just log in the user as a speaker
    setAuthStatus({ loggedIn: true, role: 'speaker' });
    toast({
        title: 'Registration Successful!',
        description: 'Welcome to ConferVerse! You are now logged in.',
    });
    router.push('/speaker');
  };
  

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
            <Form {...formStep1}>
                <form onSubmit={formStep1.handleSubmit(handleNextStep1)} className="space-y-4">
                    <FormField control={formStep1.control} name="name" render={({ field }) => (
                        <FormItem><FormLabel>Full Name</FormLabel><FormControl><Input placeholder="John Doe" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={formStep1.control} name="email" render={({ field }) => (
                        <FormItem><FormLabel>Email</FormLabel><FormControl><Input type="email" placeholder="you@example.com" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={formStep1.control} name="password" render={({ field }) => (
                        <FormItem><FormLabel>Password</FormLabel><FormControl><Input type="password" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={formStep1.control} name="dob" render={({ field }) => (
                        <FormItem className="flex flex-col"><FormLabel>Date of Birth</FormLabel>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <FormControl>
                                        <Button variant={"outline"} className={cn("pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>
                                            {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                        </Button>
                                    </FormControl>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                    <Calendar mode="single" selected={field.value} onSelect={field.onChange} disabled={(date) => date > new Date() || date < new Date("1900-01-01")} initialFocus />
                                </PopoverContent>
                            </Popover>
                        <FormMessage /></FormItem>
                    )} />
                    <Button type="submit" className="w-full">Next</Button>
                </form>
            </Form>
        );
      case 2:
        return (
            <Form {...formStep2}>
                <form onSubmit={formStep2.handleSubmit(handleNextStep2)} className="space-y-4">
                    <FormField control={formStep2.control} name="profession" render={({ field }) => (
                        <FormItem><FormLabel>Profession / Job Title</FormLabel><FormControl><Input placeholder="e.g., Software Engineer" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={formStep2.control} name="qualifications" render={({ field }) => (
                        <FormItem><FormLabel>Qualifications</FormLabel><FormControl><Input placeholder="e.g., M.Sc. in Computer Science" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={formStep2.control} name="bio" render={({ field }) => (
                        <FormItem><FormLabel>Short Bio</FormLabel><FormControl><Textarea placeholder="Tell us a little about yourself..." {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <div className="flex gap-4">
                        <Button variant="outline" onClick={() => setStep(1)} className="w-full">Back</Button>
                        <Button type="submit" className="w-full">Next</Button>
                    </div>
                </form>
            </Form>
        );
      case 3:
        return (
            <Form {...formStep3}>
                <form onSubmit={formStep3.handleSubmit(handleFinalSubmit)} className="space-y-4">
                    <FormField control={formStep3.control} name="skills" render={({ field }) => (
                        <FormItem><FormLabel>Skills</FormLabel><FormControl><Input placeholder="e.g., React, TypeScript, Node.js" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={formStep3.control} name="preferredTrack" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Preferred Domain/Track</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl><SelectTrigger><SelectValue placeholder="Select a domain" /></SelectTrigger></FormControl>
                                <SelectContent>
                                    <SelectItem value="AI & ML">AI & ML</SelectItem>
                                    <SelectItem value="Cloud Native">Cloud Native</SelectItem>
                                    <SelectItem value="Frontend">Frontend</SelectItem>
                                    <SelectItem value="DevOps">DevOps</SelectItem>
                                    <SelectItem value="Security">Security</SelectItem>
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )} />
                    <div className="flex gap-4">
                        <Button variant="outline" onClick={() => setStep(2)} className="w-full">Back</Button>
                        <Button type="submit" className="w-full">Finish Sign Up</Button>
                    </div>
                </form>
            </Form>
        );
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center items-center gap-2 mb-4">
            <Logo className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold tracking-tight text-foreground">ConferVerse</span>
          </div>
          <CardTitle>Create Speaker Account</CardTitle>
          <CardDescription>Step {step} of 3: {step === 1 ? 'Personal Details' : step === 2 ? 'Professional Info' : 'Skills & Preferences'}</CardDescription>
        </CardHeader>
        <CardContent>
            {renderStep()}
        </CardContent>
        <CardFooter className="flex-col items-center gap-2">
            <div className="text-center text-sm">
                Already have an account?{' '}
                <Link href="/login" className="underline">
                    Login
                </Link>
            </div>
        </CardFooter>
      </Card>
    </div>
  );
}

