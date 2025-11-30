-- Add inventory start and end fields to event_inventory
alter table event_inventory
  add column if not exists inventory_start_quantity integer,
  add column if not exists inventory_end_quantity integer,
  add column if not exists inventory_start_full integer default 0,
  add column if not exists inventory_start_opened integer default 0,
  add column if not exists inventory_start_empty integer default 0,
  add column if not exists inventory_end_full integer default 0,
  add column if not exists inventory_end_opened integer default 0,
  add column if not exists inventory_end_empty integer default 0;

-- Add a flag to identify futs (barrels) products
-- We'll use a naming convention or add a category field to products
-- For now, we'll check if the product name contains "fut" or "barrel"
-- This can be improved later with a proper category system

