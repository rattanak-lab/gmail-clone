import { Button } from "@/components/ui/button";
import { Reply, Forward, Trash2, X } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import ComposeEmail from "./ComposeEmail";
import { Email } from "@/types/email";

interface EmailViewProps {
  email: Email | null;
  thread?: Email[];
  onClose: () => void;
  onDelete: (id: string) => void;
}

const EmailView = ({ email, thread = [], onClose, onDelete }: EmailViewProps) => {
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

  const renderEmailContent = (content: string) => {
    return <div dangerouslySetInnerHTML={{ __html: content || '' }} />;
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
            {[email, ...thread].map((threadEmail, index) => (
              <div key={threadEmail.id} className="border-t first:border-t-0 pt-4 first:pt-0">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <Avatar>
                      <AvatarFallback>{threadEmail.from[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{threadEmail.from}</div>
                      <div className="text-sm text-muted-foreground">{threadEmail.date}</div>
                    </div>
                  </div>
                  
                  {index === 0 && (
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
                  )}
                </div>
                
                <div className="prose prose-sm max-w-none mt-4">
                  {renderEmailContent(threadEmail.content || threadEmail.preview)}
                </div>

                {threadEmail.attachments && threadEmail.attachments.length > 0 && (
                  <div className="mt-4 space-y-2">
                    <div className="text-sm font-medium">Attachments:</div>
                    <div className="flex flex-wrap gap-2">
                      {threadEmail.attachments.map((attachment) => (
                        <a
                          key={attachment.id}
                          href={attachment.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center p-2 bg-muted rounded hover:bg-accent"
                        >
                          <span className="text-sm">{attachment.name}</span>
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
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