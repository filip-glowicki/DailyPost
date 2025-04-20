-- Migration: Fix post content length constraint
-- Purpose: Properly update the existing content length constraint from 1000 to 5000 characters
-- This migration handles dropping the old constraint and adding the new one

-- Drop the existing constraint
alter table posts drop constraint if exists posts_content_check;
alter table posts drop constraint if exists posts_content_length_check;

-- Add the new constraint with 5000 character limit
alter table posts add constraint posts_content_check 
    check (length(content) <= 5000); 