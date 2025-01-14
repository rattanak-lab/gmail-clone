import { Button } from "@/components/ui/button";
import { Mail, Inbox, Send, Trash, Star, File, Tag } from "lucide-react";
import { Folder } from "@/types/email";

interface SidebarProps {
  folders: Folder[];
  labels: string[];
  currentFolder: string;
  selectedLabels: string[];
  onComposeClick: () => void;
  onFolderClick: (folder: string) => void;
  onLabelClick: (label: string) => void;
}

const Sidebar = ({
  folders,
  labels,
  currentFolder,
  selectedLabels,
  onComposeClick,
  onFolderClick,
  onLabelClick,
}: SidebarProps) => {
  return (
    <div className="p-4">
      <Button 
        className="w-full mb-6" 
        size="lg"
        onClick={onComposeClick}
      >
        <Mail className="mr-2 h-4 w-4" /> Compose
      </Button>

      <div className="space-y-2">
        {folders.map((folder) => (
          <Button
            key={folder.id}
            variant={currentFolder === folder.id ? "secondary" : "ghost"}
            className="w-full justify-start"
            onClick={() => onFolderClick(folder.id)}
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
              onClick={() => onLabelClick(label)}
            >
              <Tag className="mr-2 h-4 w-4" /> {label}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;