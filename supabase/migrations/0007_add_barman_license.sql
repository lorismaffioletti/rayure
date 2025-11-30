-- Add license field to barmans table
alter table barmans
  add column if not exists has_license boolean not null default false;

