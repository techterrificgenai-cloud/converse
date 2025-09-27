
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, User } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

// Mock data for the current user's profile
const currentUserProfile = {
    name: 'Alice',
    email: 'alice@example.com',
    dob: new Date('1990-05-15'),
    profession: 'AI Ethics Researcher',
    qualifications: 'Ph.D. in Philosophy',
    bio: 'Expert in AI ethics and responsible AI development. Passionate about creating fair and transparent systems.',
    skills: 'AI Ethics, Responsible AI, Public Speaking, Research',
    preferredTrack: 'AI & ML' as const,
};


const profileSchema = z.object({
    name: z.string().min(2, 'Name is required.'),
    email: z.string().email('Please enter a valid email address.'),
    dob: z.date({
        required_error: "A date of birth is required.",
    }),
    profession: z.string().min(2, 'Profession is required.'),
    qualifications: z.string().min(5, 'Qualifications are required.'),
    bio: z.string().min(20, 'Bio must be at least 20 characters.'),
    skills: z.string().min(3, 'Please list at least one skill.'),
    preferredTrack: z.enum(['AI & ML', 'Cloud Native', 'Frontend', 'DevOps', 'Security']),
});


export default function ProfilePage() {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: currentUserProfile,
  });

  const onSubmit = (values: z.infer<typeof profileSchema>) => {
    console.log('Updated Profile Data:', values);
    toast({
      title: 'Profile Updated!',
      description: 'Your profile information has been successfully saved.',
    });
  };

  return (
    <Card>
        <CardHeader>
            <CardTitle className="flex items-center gap-2"><User /> My Profile</CardTitle>
            <CardDescription>View and update your personal and professional information.</CardDescription>
        </CardHeader>
        <CardContent>
            <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                        <FormField control={form.control} name="name" render={({ field }) => (
                            <FormItem><FormLabel>Full Name</FormLabel><FormControl><Input placeholder="John Doe" {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <FormField control={form.control} name="email" render={({ field }) => (
                            <FormItem><FormLabel>Email</FormLabel><FormControl><Input type="email" placeholder="you@example.com" {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <FormField control={form.control} name="dob" render={({ field }) => (
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
                         <FormField control={form.control} name="bio" render={({ field }) => (
                            <FormItem><FormLabel>Short Bio</FormLabel><FormControl><Textarea placeholder="Tell us a little about yourself..." className="min-h-[120px]" {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                    </div>
                     <div className="space-y-4">
                         <FormField control={form.control} name="profession" render={({ field }) => (
                            <FormItem><FormLabel>Profession / Job Title</FormLabel><FormControl><Input placeholder="e.g., Software Engineer" {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <FormField control={form.control} name="qualifications" render={({ field }) => (
                            <FormItem><FormLabel>Qualifications</FormLabel><FormControl><Input placeholder="e.g., M.Sc. in Computer Science" {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <FormField control={form.control} name="skills" render={({ field }) => (
                            <FormItem><FormLabel>Skills</FormLabel><FormControl><Input placeholder="e.g., React, TypeScript, Node.js" {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <FormField control={form.control} name="preferredTrack" render={({ field }) => (
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
                    </div>
                </div>
                <Button type="submit">Save Changes</Button>
            </form>
            </Form>
        </CardContent>
    </Card>
  );
}

