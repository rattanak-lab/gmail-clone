-- Create a new storage bucket for email attachments
INSERT INTO storage.buckets (id, name)
VALUES ('email-attachments', 'email-attachments')
ON CONFLICT (id) DO NOTHING;

-- Set up storage policy to allow authenticated users to upload files
CREATE POLICY "Allow authenticated users to upload files"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'email-attachments');

-- Allow authenticated users to read files
CREATE POLICY "Allow authenticated users to read files"
ON storage.objects FOR SELECT TO authenticated
USING (bucket_id = 'email-attachments');