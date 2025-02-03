import { Menu, Search as SearchIcon, Inbox, Send, Trash, Star, File } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import ComposeEmail from "@/components/ComposeEmail";
import EmailView from "@/components/EmailView";
import { Input } from "@/components/ui/input";
import Sidebar from "@/components/Sidebar";
import EmailList from "@/components/EmailList";
import { Email, Folder } from "@/types/email";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useQueryClient } from "@tanstack/react-query";

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
  const [currentFolder, setCurrentFolder] = useState("inbox");
  const [selectedLabels, setSelectedLabels] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch emails from Supabase
  const { data: emails = [], isLoading } = useQuery({
    queryKey: ['emails', currentFolder, selectedLabels],
    queryFn: async () => {
      console.log('Fetching emails for folder:', currentFolder);
      let query = supabase
        .from('emails')
        .select(`
          *,
          attachments (*)
        `)
        .order('date', { ascending: false });

      if (currentFolder === 'starred') {
        query = query.eq('starred', true);
      } else {
        query = query.eq('folder', currentFolder);
      }

      if (selectedLabels.length > 0) {
        query = query.contains('labels', selectedLabels);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching emails:', error);
        toast({
          title: "Error fetching emails",
          description: error.message,
          variant: "destructive",
        });
        return [];
      }

      return data || [];
    },
  });

  // Set up real-time subscription
  useEffect(() => {
    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'emails'
        },
        (payload) => {
          console.log('Real-time update received:', payload);
          queryClient.invalidateQueries({ queryKey: ['emails'] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  const filteredEmails = emails
    .filter((email) =>
      searchQuery === "" ||
      email.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      email.from_email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      email.preview.toLowerCase().includes(searchQuery.toLowerCase())
    );

  const handleEmailClick = async (email: Email) => {
    setSelectedEmail(email);
    if (!email.read) {
      const { error } = await supabase
        .from('emails')
        .update({ read: true })
        .eq('id', email.id);

      if (error) {
        console.error('Error marking email as read:', error);
        toast({
          title: "Error",
          description: "Failed to mark email as read",
          variant: "destructive",
        });
      }
    }
  };

  const handleDeleteEmail = async (id: string) => {
    const { error } = await supabase
      .from('emails')
      .update({ folder: 'trash' })
      .eq('id', id);

    if (error) {
      console.error('Error moving email to trash:', error);
      toast({
        title: "Error",
        description: "Failed to move email to trash",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Email moved to trash",
      description: "The email has been moved to the trash folder",
    });
  };

  const handleStarEmail = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const email = emails.find(e => e.id === id);
    if (!email) return;

    const { error } = await supabase
      .from('emails')
      .update({ starred: !email.starred })
      .eq('id', id);

    if (error) {
      console.error('Error updating star status:', error);
      toast({
        title: "Error",
        description: "Failed to update star status",
        variant: "destructive",
      });
    }
  };

  const handleLabelClick = (label: string) => {
    setSelectedLabels(prev => 
      prev.includes(label) 
        ? prev.filter(l => l !== label)
        : [...prev, label]
    );
  };

  if (isLoading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

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