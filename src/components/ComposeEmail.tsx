import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect, useRef } from "react";
import RichTextEditor from "./RichTextEditor";
import { Paperclip, X } from "lucide-react";
import { Attachment } from "@/types/email";

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
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (isOpen) {
      setTo(defaultTo);
      setSubject(defaultSubject);
      setContent(defaultContent);
      setAttachments([]);
    }
  }, [isOpen, defaultTo, defaultSubject, defaultContent]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newAttachments: Attachment[] = Array.from(files).map(file => ({
        id: Math.random().toString(36).substr(2, 9),
        name: file.name,
        size: file.size,
        type: file.type,
        url: URL.createObjectURL(file)
      }));
      setAttachments(prev => [...prev, ...newAttachments]);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeAttachment = (id: string) => {
    setAttachments(prev => prev.filter(att => att.id !== id));
  };

  const handleSend = () => {
    console.log("Sending email:", { to, subject, content, attachments });
    toast({
      title: "Email sent",
      description: "Your email has been sent successfully.",
    });
    onClose();
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
          <RichTextEditor content={content} onChange={setContent} />
          
          <div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              multiple
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
            >
              <Paperclip className="h-4 w-4 mr-2" />
              Attach files
            </Button>
          </div>

          {attachments.length > 0 && (
            <div className="space-y-2">
              {attachments.map(file => (
                <div key={file.id} className="flex items-center justify-between bg-muted p-2 rounded">
                  <span className="text-sm">{file.name}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeAttachment(file.id)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}

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