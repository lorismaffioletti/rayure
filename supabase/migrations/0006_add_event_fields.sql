-- Add new fields to events table
alter table events
  add column if not exists start_time timestamptz,
  add column if not exists end_time timestamptz,
  add column if not exists setup_time timestamptz,
  add column if not exists provenance text,
  add column if not exists has_beer_truck boolean,
  add column if not exists stand_count integer;

