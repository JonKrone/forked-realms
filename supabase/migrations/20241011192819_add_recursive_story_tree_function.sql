-- Migration: Create get_story_subtree function

-- Drop the function if it already exists to avoid conflicts
DROP FUNCTION IF EXISTS public.get_story_subtree(VARCHAR(6));

CREATE FUNCTION public.get_story_subtree(start_node_id VARCHAR(6))
RETURNS SETOF public.story_node AS
$BODY$
    WITH RECURSIVE subtree AS (
        -- Anchor member: Select the starting node
        SELECT
            s.*
        FROM
            public.story_node s
        WHERE
            s.id = start_node_id

        UNION ALL

        -- Recursive member: Select child nodes
        SELECT
            sn.*
        FROM
            public.story_node sn
            INNER JOIN subtree st ON sn.parent_id = st.id
    )
    SELECT
        *
    FROM
        subtree;
$BODY$
LANGUAGE sql STABLE;
