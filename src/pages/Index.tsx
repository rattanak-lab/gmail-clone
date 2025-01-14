import { Mail, Inbox, Send, Trash, Star, File, Menu } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import ComposeEmail from "@/components/ComposeEmail";

interface Email {
  id: string;
  from: string;
  subject: string;
  preview: string;
  date: string;
  read: boolean;
}

const mockEmails: Email[] = [
  {
    id: "1",
    from: "John Doe",
    subject: "Weekly Team Meeting",
    preview: "Hi team, Just a reminder about our weekly meeting tomorrow at 10 AM...",
    date: "10:30 AM",
    read: false,
  },
  {
    id: "2",
    from: "Alice Smith",
    subject: "Project Update",
    preview: "Here's the latest update on the project milestone...",
    date: "9:15 AM",
    read: true,
  },
  {
    id: "3",
    from: "Marketing Team",
    subject: "Q2 Marketing Strategy",
    preview: "Please review the attached Q2 marketing strategy document...",
    date: "Yesterday",
    read: true,
  },
];

const Index = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);
  const [isComposeOpen, setIsComposeOpen] = useState(false);

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <div className={`bg-sidebar border-r ${isSidebarOpen ? 'w-64' : 'w-0'} transition-all duration-300 overflow-hidden`}>
        <div className="p-4">
          <Button 
            className="w-full mb-6" 
            size="lg"
            onClick={() => setIsComposeOpen(true)}
          >
            <Mail className="mr-2 h-4 w-4" /> Compose
          </Button>

          <div className="space-y-2">
            <Button variant="ghost" className="w-full justify-start">
              <Inbox className="mr-2 h-4 w-4" /> Inbox
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              <Star className="mr-2 h-4 w-4" /> Starred
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              <Send className="mr-2 h-4 w-4" /> Sent
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              <File className="mr-2 h-4 w-4" /> Drafts
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              <Trash className="mr-2 h-4 w-4" /> Trash
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="border-b p-4 flex items-center">
          <Button variant="ghost" size="icon" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
            <Menu className="h-5 w-5" />
          </Button>
          <div className="flex-1 px-4">
            <input
              type="text"
              placeholder="Search mail"
              className="w-full max-w-xl px-4 py-2 rounded-lg border bg-background"
            />
          </div>
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </header>

        {/* Email List */}
        <ScrollArea className="flex-1">
          <div className="divide-y">
            {mockEmails.map((email) => (
              <div
                key={email.id}
                className={`p-4 hover:bg-accent cursor-pointer ${
                  !email.read ? 'font-semibold bg-accent/50' : ''
                }`}
                onClick={() => setSelectedEmail(email)}
              >
                <div className="flex items-center gap-4">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>{email.from[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm">{email.from}</span>
                      <span className="text-xs text-muted-foreground">{email.date}</span>
                    </div>
                    <div className="text-sm font-medium">{email.subject}</div>
                    <div className="text-sm text-muted-foreground truncate">
                      {email.preview}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>

      <ComposeEmail 
        isOpen={isComposeOpen} 
        onClose={() => setIsComposeOpen(false)} 
      />
    </div>
  );
};

export default Index;