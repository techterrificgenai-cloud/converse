import { Button } from "@/components/ui/button";
import { speakers } from "@/lib/data";
import { Download, Award } from 'lucide-react';

const currentUser = speakers[0];

export default function CertificatePage() {
    return (
        <div className="flex flex-col items-center gap-8">
            <h1 className="text-3xl font-bold tracking-tight">Your Certificate of Appreciation</h1>
            <div className="w-full max-w-4xl p-8 border-4 border-primary/50 bg-background rounded-lg shadow-2xl relative aspect-[1.414]">
                <div className="absolute inset-0 bg-[url('/grid.svg')] bg-repeat opacity-5" style={{backgroundSize: '30px'}}></div>
                <div className="relative flex flex-col items-center justify-center h-full text-center">
                    <Award className="w-24 h-24 text-amber-400 mb-4" />
                    <p className="text-lg text-muted-foreground">This certificate is proudly presented to</p>
                    <p className="text-5xl font-bold text-primary my-6 font-serif tracking-wider">{currentUser.name}</p>
                    <p className="text-lg text-muted-foreground">
                        In recognition of your valuable contribution as a speaker at
                    </p>
                    <h2 className="text-4xl font-semibold mt-2">ConferVerse 2024</h2>
                    <div className="mt-auto flex justify-between w-full pt-8 text-sm">
                        <div>
                            <p className="border-t-2 border-muted-foreground/50 pt-2 font-semibold">Event Organizer</p>
                            <p>ConferVerse Team</p>
                        </div>
                        <div>
                            <p className="border-t-2 border-muted-foreground/50 pt-2 font-semibold">Date</p>
                            <p>{new Date().toLocaleDateString()}</p>
                        </div>
                    </div>
                </div>
            </div>
            <Button>
                <Download className="mr-2 h-4 w-4" /> Download as PDF
            </Button>
        </div>
    );
}
