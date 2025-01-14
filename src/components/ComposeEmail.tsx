import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";

interface ComposeEmailProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTo?: string;
  defaultSubject?: string;
  defaultContent?: string;
}

const ComposeEmail = ({ 
  isOpen, 
  onClose, 
  defaultTo = "", 
  defaultSubject = "", 
  defaultContent = "" 
}: ComposeEmailProps) => {
  const [to, setTo] = useState(defaultTo);
  const [subject, setSubject] = useState(defaultSubject);
  const [content, setContent] = useState(defaultContent);
  const { toast } = useToast();

  useEffect(() => {
    if (isOpen) {
      setTo(defaultTo);
      setSubject(defaultSubject);
      setContent(defaultContent);
    }
  }, [isOpen, defaultTo, defaultSubject, defaultContent]);

  const handleSend = () => {
    console.log("Sending email:", { to, subject, content });
    toast({
      title: "Email sent",
      description: "Your email has been sent successfully.",
    });
    onClose();
    setTo("");
    setSubject("");
    setContent("");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>New Message</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 pt-4">
          <Input
            placeholder="To"
            value={to}
            onChange={(e) => setTo(e.target.value)}
          />
          <Input
            placeholder="Subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
          />
          <Textarea
            placeholder="Write your message here..."
            className="min-h-[200px]"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={onClose}>
              Discard
            </Button>
            <Button onClick={handleSend}>Send</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ComposeEmail;