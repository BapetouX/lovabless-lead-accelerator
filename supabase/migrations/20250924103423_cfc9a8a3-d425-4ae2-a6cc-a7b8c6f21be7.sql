-- Allow INSERT operations on Leads Linkedin table for service role and authenticated users
CREATE POLICY "Allow insert access to leads"
ON public."Leads Linkedin"
FOR INSERT
WITH CHECK (true);

-- Allow UPDATE operations on Leads Linkedin table for service role and authenticated users  
CREATE POLICY "Allow update access to leads"
ON public."Leads Linkedin"
FOR UPDATE
USING (true)
WITH CHECK (true);

-- Allow DELETE operations on Leads Linkedin table for service role and authenticated users
CREATE POLICY "Allow delete access to leads"
ON public."Leads Linkedin"
FOR DELETE
USING (true);

-- Allow INSERT operations on Posts table for service role and authenticated users
CREATE POLICY "Allow insert access to posts"
ON public."Posts"
FOR INSERT
WITH CHECK (true);

-- Allow DELETE operations on Posts table for service role and authenticated users
CREATE POLICY "Allow delete access to posts"
ON public."Posts"
FOR DELETE
USING (true);