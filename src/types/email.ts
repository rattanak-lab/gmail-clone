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
}

export type Folder = {
  id: string;
  name: string;
  icon: any;
};