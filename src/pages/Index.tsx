import { Menu, Search as SearchIcon, Inbox, Send, Trash, Star, File } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import ComposeEmail from "@/components/ComposeEmail";
import EmailView from "@/components/EmailView";
import { Input } from "@/components/ui/input";
import Sidebar from "@/components/Sidebar";
import EmailList from "@/components/EmailList";
import { Email, Folder } from "@/types/email";

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

const folders: Folder[] = [
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
      if (currentFolder === "starred") {
        return email.starred;
      }
      return email.folder === currentFolder;
    })
    .filter((email) => {
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
      <div className={`bg-sidebar border-r ${isSidebarOpen ? 'w-64' : 'w-0'} transition-all duration-300 overflow-hidden`}>
        <Sidebar
          folders={folders}
          labels={labels}
          currentFolder={currentFolder}
          selectedLabels={selectedLabels}
          onComposeClick={() => setIsComposeOpen(true)}
          onFolderClick={setCurrentFolder}
          onLabelClick={handleLabelClick}
        />
      </div>

      <div className="flex-1 flex flex-col">
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

        <EmailList
          emails={filteredEmails}
          onEmailClick={handleEmailClick}
          onStarEmail={handleStarEmail}
        />
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
