import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { Email } from "@/types/email";

interface EmailListItemProps {
  email: Email;
  onClick: () => void;
  onStar: (e: React.MouseEvent) => void;
}

const EmailListItem = ({ email, onClick, onStar }: EmailListItemProps) => {
  return (
    <div
      className={`p-4 hover:bg-accent cursor-pointer ${
        !email.read ? 'font-semibold bg-accent/50' : ''
      }`}
      onClick={onClick}
    >
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={onStar}
        >
          <Star className={cn("h-4 w-4", email.starred && "fill-yellow-400 text-yellow-400")} />
        </Button>
        <Avatar className="h-8 w-8">
          <AvatarFallback>{email.from_email[0]}</AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm">{email.from_email}</span>
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
  );
};

export default EmailListItem;