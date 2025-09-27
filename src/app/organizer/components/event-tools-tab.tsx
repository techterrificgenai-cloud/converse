'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { speakers as initialSpeakers } from '@/lib/data';
import type { Speaker } from '@/lib/types';
import { MockQRCode } from '@/components/mock-qr-code';
import { Shirt, CheckCircle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

export function EventToolsTab() {
  const [speakers, setSpeakers] = useState<Speaker[]>(initialSpeakers);

  const handleCheckInToggle = (speakerId: string, checked: boolean) => {
    setSpeakers((prev) =>
      prev.map((s) => (s.id === speakerId ? { ...s, checkedIn: checked } : s))
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
            <Shirt className="h-5 w-5" /> Speaker Check-in & Swag
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {speakers.map((speaker) => (
            <Card key={speaker.id}>
              <CardHeader className="flex flex-row items-center gap-4">
                <Avatar>
                  <AvatarImage src={speaker.avatarUrl} alt={speaker.name} />
                  <AvatarFallback>
                    {speaker.name.split(' ').map((n) => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="font-bold">{speaker.name}</p>
                  <p className="text-sm text-muted-foreground">{speaker.email}</p>
                </div>
              </CardHeader>
              <CardContent className="flex flex-col items-center gap-4">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="w-full">View QR Code</Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-xs">
                    <DialogHeader>
                      <DialogTitle>Check-in for {speaker.name}</DialogTitle>
                    </DialogHeader>
                    <div className="flex justify-center p-4">
                        <MockQRCode value={speaker.id} size={200} />
                    </div>
                  </DialogContent>
                </Dialog>
                
                <div className="flex items-center space-x-2">
                  <Switch
                    id={`check-in-${speaker.id}`}
                    checked={speaker.checkedIn}
                    onCheckedChange={(checked) => handleCheckInToggle(speaker.id, checked)}
                  />
                  <Label htmlFor={`check-in-${speaker.id}`} className="flex items-center gap-2">
                    {speaker.checkedIn ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : null}
                     Checked-in
                  </Label>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
