import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Users, Calendar, Mic, Bot, BarChart2 } from 'lucide-react';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Logo } from '@/components/icons';

export default function Home() {
  const heroImage = PlaceHolderImages.find((img) => img.id === 'hero');

  const features = [
    {
      icon: <Bot className="h-8 w-8 text-primary" />,
      title: 'AI-Powered Reviews',
      description: 'Leverage AI to score proposals on relevance, clarity, and depth.',
    },
    {
      icon: <Calendar className="h-8 w-8 text-primary" />,
      title: 'Intelligent Agenda Building',
      description: 'Drag-and-drop sessions and get insights on agenda balance.',
    },
    {
      icon: <Mic className="h-8 w-8 text-primary" />,
      title: 'Streamlined Speaker Tools',
      description: 'A dedicated dashboard for speakers to manage their engagement.',
    },
    {
      icon: <BarChart2 className="h-8 w-8 text-primary" />,
      title: 'Actionable Analytics',
      description: 'Visualize event data, from track distribution to attendee feedback.',
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-4 lg:px-6 h-16 flex items-center bg-background/80 backdrop-blur-sm border-b">
        <Link href="/" className="flex items-center justify-center gap-2">
          <Logo className="h-6 w-6 text-primary" />
          <span className="text-xl font-bold tracking-tight text-foreground">ConferVerse</span>
        </Link>
      </header>

      <main className="flex-1">
        <section className="relative w-full py-24 md:py-32 lg:py-40">
          {heroImage && (
            <Image
              src={heroImage.imageUrl}
              alt={heroImage.description}
              fill
              className="object-cover z-0"
              data-ai-hint={heroImage.imageHint}
              priority
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent z-10" />
          <div className="container px-4 md:px-6 grid gap-6 text-center relative z-20">
            <div className="space-y-4">
              <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl text-foreground">
                The Future of Conference Management
              </h1>
              <p className="max-w-[700px] mx-auto text-muted-foreground md:text-xl">
                ConferVerse is an all-in-one platform that streamlines everything from session submissions to post-event analytics.
              </p>
            </div>
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Button asChild size="lg">
                <Link href="/login?role=organizer">Enter as Organizer</Link>
              </Button>
              <Button asChild size="lg" variant="secondary">
                <Link href="/login?role=speaker">Enter as Speaker</Link>
              </Button>
            </div>
          </div>
        </section>

        <section id="features" className="w-full py-12 md:py-24 lg:py-32 bg-background">
          <div className="container px-4 md:px-6">
            <div className="text-center space-y-4 mb-12">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
                A Smarter Way to Run Your Event
              </h2>
              <p className="max-w-[700px] mx-auto text-muted-foreground md:text-lg">
                Discover features designed to save time, enhance quality, and improve engagement for everyone involved.
              </p>
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {features.map((feature, index) => (
                <Card key={index} className="flex flex-col items-center text-center p-6">
                  {feature.icon}
                  <h3 className="text-xl font-bold mt-4 mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} ConferVerse. All rights reserved.
        </p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link href="#" className="text-xs hover:underline underline-offset-4">
            Terms of Service
          </Link>
          <Link href="#" className="text-xs hover:underline underline-offset-4">
            Privacy
          </Link>
        </nav>
      </footer>
    </div>
  );
}
