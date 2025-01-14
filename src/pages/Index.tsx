import { Mail, Inbox, Send, Trash, Star, File, Menu, Search as SearchIcon, Tag } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import ComposeEmail from "@/components/ComposeEmail";
import EmailView from "@/components/EmailView";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface Email {
  id: string;
  from: string;
  subject: string;
  preview: string;
  date: string;
  read: boolean;
  folder: string;
  labels: string[];
  starred: boolean;
}

const mockEmails: Email[] = [
  {
    id: "1",
    from: "John Doe",
    subject: "Weekly Team Meeting",
    preview: "Hi team, Just a reminder about our weekly meeting tomorrow at 10 AM. Please come prepared with your weekly updates and any blockers you'd like to discuss.",
    date: "10:30 AM",
    read: false,
    folder: "inbox",
    labels: ["work", "important"],
    starred: false,
  },
  {
    id: "2",
    from: "Alice Smith",
    subject: "Project Update",
    preview: "Here's the latest update on the project milestone. We've made significant progress on the key deliverables and are on track to meet our deadlines.",
    date: "9:15 AM",
    read: true,
    folder: "inbox",
    labels: ["work"],
    starred: true,
  },
  {
    id: "3",
    from: "Marketing Team",
    subject: "Q2 Marketing Strategy",
    preview: "Please review the attached Q2 marketing strategy document. We've incorporated the feedback from last quarter and added new initiatives for growth.",
    date: "Yesterday",
    read: true,
    folder: "inbox",
    labels: ["marketing"],
    starred: false,
  },
];

const folders = [
  { id: "inbox", name: "Inbox", icon: Inbox },
  { id: "starred", name: "Starred", icon: Star },
  { id: "sent", name: "Sent", icon: Send },
  { id: "drafts", name: "Drafts", icon: File },
  { id: "trash", name: "Trash", icon: Trash },
];

const labels = ["work", "personal", "important", "marketing"];

const Index = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);
  const [isComposeOpen, setIsComposeOpen] = useState(false);
  const [emails, setEmails] = useState(mockEmails);
  const [currentFolder, setCurrentFolder] = useState("inbox");
  const [selectedLabels, setSelectedLabels] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredEmails = emails
    .filter((email) => {
      // Filter by folder
      if (currentFolder === "starred") {
        return email.starred;
      }
      return email.folder === currentFolder;
    })
    .filter((email) => {
      // Filter by selected labels
      if (selectedLabels.length === 0) return true;
      return selectedLabels.every((label) => email.labels.includes(label));
    })
    .filter(
      (email) =>
        searchQuery === "" ||
        email.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
        email.from.toLowerCase().includes(searchQuery.toLowerCase()) ||
        email.preview.toLowerCase().includes(searchQuery.toLowerCase())
    );

  const handleEmailClick = (email: Email) => {
    setSelectedEmail(email);
    const updatedEmails = emails.map((e) =>
      e.id === email.id ? { ...e, read: true } : e
    );
    setEmails(updatedEmails);
  };

  const handleDeleteEmail = (id: string) => {
    setEmails(emails.map(email => 
      email.id === id ? { ...email, folder: "trash" } : email
    ));
  };

  const handleStarEmail = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setEmails(emails.map(email =>
      email.id === id ? { ...email, starred: !email.starred } : email
    ));
  };

  const handleLabelClick = (label: string) => {
    setSelectedLabels(prev => 
      prev.includes(label) 
        ? prev.filter(l => l !== label)
        : [...prev, label]
    );
  };

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
            {folders.map((folder) => (
              <Button
                key={folder.id}
                variant={currentFolder === folder.id ? "secondary" : "ghost"}
                className="w-full justify-start"
                onClick={() => setCurrentFolder(folder.id)}
              >
                <folder.icon className="mr-2 h-4 w-4" /> {folder.name}
              </Button>
            ))}

            <div className="pt-4">
              <div className="text-sm font-medium text-muted-foreground px-3 py-2">
                Labels
              </div>
              {labels.map((label) => (
                <Button
                  key={label}
                  variant={selectedLabels.includes(label) ? "secondary" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => handleLabelClick(label)}
                >
                  <Tag className="mr-2 h-4 w-4" /> {label}
                </Button>
              ))}
            </div>
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
            <div className="relative max-w-xl">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search emails"
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </header>

        {/* Email List */}
        <ScrollArea className="flex-1">
          <div className="divide-y">
            {filteredEmails.map((email) => (
              <div
                key={email.id}
                className={`p-4 hover:bg-accent cursor-pointer ${
                  !email.read ? 'font-semibold bg-accent/50' : ''
                }`}
                onClick={() => handleEmailClick(email)}
              >
                <div className="flex items-center gap-4">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={(e) => handleStarEmail(email.id, e)}
                  >
                    <Star className={cn("h-4 w-4", email.starred && "fill-yellow-400 text-yellow-400")} />
                  </Button>
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
                    {email.labels.length > 0 && (
                      <div className="flex gap-2 mt-2">
                        {email.labels.map((label) => (
                          <span
                            key={label}
                            className="px-2 py-1 rounded-full text-xs bg-accent"
                          >
                            {label}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>

      {selectedEmail && (
        <EmailView
          email={selectedEmail}
          onClose={() => setSelectedEmail(null)}
          onDelete={handleDeleteEmail}
        />
      )}

      <ComposeEmail 
        isOpen={isComposeOpen} 
        onClose={() => setIsComposeOpen(false)} 
      />
    </div>
  );
};

export default Index;