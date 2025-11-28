
-- Add category column to articles table
ALTER TABLE public.articles 
ADD COLUMN category TEXT CHECK (category IN ('Press Statements', 'Haki Yetu Blog', 'Publications')) DEFAULT 'Press Statements';
