import { Button } from "@/components/ui/button";
import { Reply, Forward, Trash2, X } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import ComposeEmail from "./ComposeEmail";

interface EmailViewProps {
  email: {
    id: string;
    from: string;
    subject: string;
    preview: string;
    date: string;
    read: boolean;
  } | null;
  onClose: () => void;
  onDelete: (id: string) => void;
}

const EmailView = ({ email, onClose, onDelete }: EmailViewProps) => {
  const { toast } = useToast();
  const [isReplyOpen, setIsReplyOpen] = useState(false);
  const [isForwardOpen, setIsForwardOpen] = useState(false);

  if (!email) return null;

  const handleDelete = () => {
    onDelete(email.id);
    toast({
      title: "Email deleted",
      description: "The email has been moved to trash.",
    });
    onClose();
  };

  return (
    <>
      <Sheet open={true} onOpenChange={onClose}>
        <SheetContent className="w-full sm:w-3/4 sm:max-w-2xl overflow-y-auto">
          <SheetHeader className="space-y-4">
            <div className="flex items-center justify-between">
              <SheetTitle className="text-xl">{email.subject}</SheetTitle>
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </SheetHeader>
          
          <div className="mt-6 space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Avatar>
                  <AvatarFallback>{email.from[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium">{email.from}</div>
                  <div className="text-sm text-muted-foreground">{email.date}</div>
                </div>
              </div>
              
              <div className="flex space-x-2">
                <Button variant="outline" onClick={() => setIsReplyOpen(true)}>
                  <Reply className="mr-2 h-4 w-4" />
                  Reply
                </Button>
                <Button variant="outline" onClick={() => setIsForwardOpen(true)}>
                  <Forward className="mr-2 h-4 w-4" />
                  Forward
                </Button>
                <Button variant="outline" onClick={handleDelete}>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </Button>
              </div>
            </div>
            
            <div className="prose prose-sm max-w-none">
              {email.preview}
            </div>
          </div>
        </SheetContent>
      </Sheet>

      <ComposeEmail 
        isOpen={isReplyOpen}
        onClose={() => setIsReplyOpen(false)}
        defaultTo={email.from}
        defaultSubject={`Re: ${email.subject}`}
        defaultContent={`\n\nOn ${email.date}, ${email.from} wrote:\n${email.preview}`}
      />

      <ComposeEmail
        isOpen={isForwardOpen}
        onClose={() => setIsForwardOpen(false)}
        defaultSubject={`Fwd: ${email.subject}`}
        defaultContent={`\n\n---------- Forwarded message ---------\nFrom: ${email.from}\nDate: ${email.date}\nSubject: ${email.subject}\n\n${email.preview}`}
      />
    </>
  );
};

export default EmailView;