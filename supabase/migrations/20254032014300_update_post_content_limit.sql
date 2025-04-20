-- Migration: Update post content character limit
-- Purpose: Increase the maximum allowed length for post content from 1000 to 5000 characters
-- This change reflects the need for longer post content while maintaining reasonable limits

-- Modify the check constraint for the content column
do $$
begin
    -- Drop existing check constraint if it exists
    if exists (
        select 1
        from information_schema.check_constraints 
        where constraint_name = 'posts_content_length_check'
    ) then
        alter table posts drop constraint if exists posts_content_length_check;
    end if;

    -- Add new check constraint with updated length
    alter table posts add constraint posts_content_length_check 
        check (length(content) <= 5000);
end
$$; 