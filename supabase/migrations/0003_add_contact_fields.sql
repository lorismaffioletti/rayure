-- Add relationship_start_date and source fields to contacts table
alter table contacts
  add column if not exists relationship_start_date date,
  add column if not exists source text;

