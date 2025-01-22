import { ScrollArea } from "@/components/ui/scroll-area";
import EmailListItem from "./EmailListItem";
import { Email } from "@/types/email";
import { DragDropContext, Droppable, Draggable, DropResult } from "react-beautiful-dnd";

interface EmailListProps {
  emails: Email[];
  onEmailClick: (email: Email) => void;
  onStarEmail: (id: string, e: React.MouseEvent) => void;
  onDragEnd?: (result: DropResult) => void;
}

const EmailList = ({ emails, onEmailClick, onStarEmail, onDragEnd }: EmailListProps) => {
  const handleDragEnd = (result: DropResult) => {
    if (!result.destination || !onDragEnd) return;
    onDragEnd(result);
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId="emails">
        {(provided) => (
          <ScrollArea className="flex-1">
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className="divide-y"
            >
              {emails.map((email, index) => (
                <Draggable key={email.id} draggableId={email.id} index={index}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                    >
                      <EmailListItem
                        email={email}
                        onClick={() => onEmailClick(email)}
                        onStar={(e) => onStarEmail(email.id, e)}
                      />
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          </ScrollArea>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default EmailList;