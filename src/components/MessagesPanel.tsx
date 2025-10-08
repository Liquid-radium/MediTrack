import { X, Send, Phone, Video, MoreVertical } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { ScrollArea } from './ui/scroll-area';
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar';
import { cn } from './ui/utils';

interface MessagesPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const messages = [
  {
    id: 1,
    sender: 'Dr. Sarah Chen',
    avatar: 'SC',
    message: 'Patient in Room 205 is requesting pain medication review.',
    time: '2 min ago',
    unread: true,
    urgent: true
  },
  {
    id: 2,
    sender: 'Nurse Martinez',
    avatar: 'NM',
    message: 'Pre-op checklist completed for tomorrow\'s surgery.',
    time: '5 min ago',
    unread: true
  },
  {
    id: 3,
    sender: 'Dr. Williams',
    avatar: 'DW',
    message: 'Lab results are ready for patient ID 4782.',
    time: '12 min ago',
    unread: false
  },
  {
    id: 4,
    sender: 'Admin Team',
    avatar: 'AT',
    message: 'Monthly compliance report is due by Friday.',
    time: '1 hour ago',
    unread: false
  },
  {
    id: 5,
    sender: 'Dr. Kim',
    avatar: 'DK',
    message: 'Can you review the discharge plan for Mrs. Johnson?',
    time: '2 hours ago',
    unread: false
  }
];

export function MessagesPanel({ isOpen, onClose }: MessagesPanelProps) {
  if (!isOpen) return null;

  return (
    <div className="w-80 bg-card border-l border-border flex flex-col shadow-lg">
      {/* Header */}
      <div className="p-4 border-b border-border flex items-center justify-between">
        <h2 className="font-semibold text-healthcare-primary">Messages</h2>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" className="text-healthcare-primary hover:bg-healthcare-light">
            <Phone className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" className="text-healthcare-primary hover:bg-healthcare-light">
            <Video className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={onClose} className="text-healthcare-primary hover:bg-healthcare-light">
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Messages List */}
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                "flex gap-3 p-3 rounded-lg cursor-pointer transition-colors",
                message.unread 
                  ? "bg-healthcare-light/50 border border-healthcare-light" 
                  : "hover:bg-muted/50"
              )}
            >
              <Avatar className="h-10 w-10">
                <AvatarFallback className="bg-healthcare-secondary text-white text-sm">
                  {message.avatar}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h4 className={cn(
                    "text-sm truncate",
                    message.unread ? "font-semibold text-healthcare-primary" : "font-medium"
                  )}>
                    {message.sender}
                  </h4>
                  <div className="flex items-center gap-1">
                    {message.urgent && (
                      <div className="w-2 h-2 bg-alert-high rounded-full"></div>
                    )}
                    <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                      <MoreVertical className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground line-clamp-2 mb-1">
                  {message.message}
                </p>
                <span className="text-xs text-muted-foreground">{message.time}</span>
              </div>
              
              {message.unread && (
                <div className="w-2 h-2 bg-healthcare-secondary rounded-full mt-2"></div>
              )}
            </div>
          ))}
        </div>
      </ScrollArea>

      {/* Message Input */}
      <div className="p-4 border-t border-border">
        <div className="flex gap-2">
          <Input
            placeholder="Type a message..."
            className="flex-1 bg-healthcare-light/30"
          />
          <Button size="sm" className="bg-healthcare-secondary hover:bg-healthcare-primary">
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}