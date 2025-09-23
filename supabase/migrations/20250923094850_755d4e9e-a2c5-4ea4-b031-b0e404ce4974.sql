-- Enable Row Level Security on Posts table
ALTER TABLE public."Posts" ENABLE ROW LEVEL SECURITY;

-- Create policy to allow everyone to read posts (since this seems to be public content)
CREATE POLICY "Allow public read access to posts" 
ON public."Posts" 
FOR SELECT 
USING (true);

-- Also enable RLS on Leads Linkedin table for security
ALTER TABLE public."Leads Linkedin" ENABLE ROW LEVEL SECURITY;

-- Create policy for leads (this should probably be user-specific, but for now allowing read access)
CREATE POLICY "Allow public read access to leads" 
ON public."Leads Linkedin" 
FOR SELECT 
USING (true);