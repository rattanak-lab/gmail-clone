import { ScrollArea } from "@/components/ui/scroll-area";
import EmailListItem from "./EmailListItem";
import { Email } from "@/types/email";

interface EmailListProps {
  emails: Email[];
  onEmailClick: (email: Email) => void;
  onStarEmail: (id: string, e: React.MouseEvent) => void;
}

const EmailList = ({ emails, onEmailClick, onStarEmail }: EmailListProps) => {
  return (
    <ScrollArea className="flex-1">
      <div className="divide-y">
        {emails.map((email) => (
          <EmailListItem
            key={email.id}
            email={email}
            onClick={() => onEmailClick(email)}
            onStar={(e) => onStarEmail(email.id, e)}
          />
        ))}
      </div>
    </ScrollArea>
  );
};

export default EmailList;