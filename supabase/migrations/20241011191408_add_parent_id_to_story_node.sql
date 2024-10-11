-- Add parent_id column to story_node table
ALTER TABLE story_node
ADD COLUMN parent_id character varying(6);

-- Add foreign key constraint
ALTER TABLE story_node
ADD CONSTRAINT fk_story_node_parent
FOREIGN KEY (parent_id)
REFERENCES story_node(id)
ON DELETE SET NULL;

-- Create index on parent_id for better query performance
CREATE INDEX idx_story_node_parent_id ON story_node(parent_id);

-- Add comment to explain the column
COMMENT ON COLUMN story_node.parent_id IS 'ID of the parent story node. Null for root nodes.';
