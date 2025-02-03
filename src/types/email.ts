export interface Email {
  id: string;
  from_email: string;  // Changed from 'from' to 'from_email'
  subject: string;
  preview: string;
  date: string;
  read: boolean;
  folder: string;
  labels: string[];
  starred: boolean;
  content?: string;
  attachments?: Attachment[];
  threadId?: string;
  parentId?: string;
}

export type Folder = {
  id: string;
  name: string;
  icon: any;
};

export interface Attachment {
  id: string;
  name: string;
  size: number;
  type: string;
  url: string;
}