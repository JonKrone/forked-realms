-- Begin a transaction to ensure atomicity
BEGIN;

-- Step 1: Remove existing primary key, default, and NOT NULL constraints
ALTER TABLE story_node
    DROP CONSTRAINT IF EXISTS story_node_pkey,
    ALTER COLUMN id DROP DEFAULT,
    ALTER COLUMN id DROP NOT NULL;

-- Step 2: Change the 'id' column type to VARCHAR(6) using the first 6 characters of the UUID
ALTER TABLE story_node
    ALTER COLUMN id TYPE VARCHAR(6) USING LEFT(id::TEXT, 6);

-- Step 3: Create a simplified function to generate a random 6-character alphanumeric ID
CREATE OR REPLACE FUNCTION generate_short_id() RETURNS VARCHAR(6) AS $$
DECLARE
  chars TEXT := 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  result VARCHAR(6) := '';
  i INTEGER := 0;
BEGIN
  FOR i IN 1..6 LOOP
    result := result || substr(chars, floor(random() * length(chars) + 1)::integer, 1);
  END LOOP;
  RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Step 4: Set the default value for 'id' to use the new ID generation function
ALTER TABLE story_node
    ALTER COLUMN id SET DEFAULT generate_short_id();

-- Step 5: Reapply the NOT NULL constraint
ALTER TABLE story_node
    ALTER COLUMN id SET NOT NULL;

-- Step 6: Add a unique index to ensure ID uniqueness before setting it as the primary key
CREATE UNIQUE INDEX IF NOT EXISTS idx_story_node_id ON story_node(id);

-- Step 7: Re-add the primary key constraint
ALTER TABLE story_node
    ADD CONSTRAINT story_node_pkey PRIMARY KEY (id);

-- Commit the transaction
COMMIT;
