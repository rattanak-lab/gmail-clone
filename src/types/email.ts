export interface Email {
  id: string;
  from: string;
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