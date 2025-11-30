-- Add source and meeting_date fields to contacts table
alter table contacts
  add column if not exists source text,
  add column if not exists meeting_date date;

