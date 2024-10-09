-- Create the story_node table
CREATE TABLE IF NOT EXISTS story_node (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    text TEXT NOT NULL,
    image_url TEXT,
    character_descriptions TEXT,
    image_prompt TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Create an index on user_id for faster queries
CREATE INDEX idx_story_node_user_id ON story_node(user_id);

-- Enable Row Level Security
ALTER TABLE story_node ENABLE ROW LEVEL SECURITY;

-- Create a policy to allow users to see only their own story nodes
CREATE POLICY "Users can view their own story nodes" ON story_node
    FOR SELECT
    USING (auth.uid() = user_id);

-- Create a policy to allow users to insert their own story nodes
CREATE POLICY "Users can insert their own story nodes" ON story_node
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Create a policy to allow users to update their own story nodes
CREATE POLICY "Users can update their own story nodes" ON story_node
    FOR UPDATE
    USING (auth.uid() = user_id);

-- Create a policy to allow users to delete their own story nodes
CREATE POLICY "Users can delete their own story nodes" ON story_node
    FOR DELETE
    USING (auth.uid() = user_id);
