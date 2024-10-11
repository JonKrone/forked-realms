import { createClient } from '@/lib/supabase/server'
import {
  Tables,
  TablesInsert,
  TablesUpdate,
} from '../../../supabase/supabase.types'

export const StoryNode = {
  create: async (params: Omit<TablesInsert<'story_node'>, 'user_id'>) => {
    const supabase = createClient()

    const user = await User.get()
    const { data, error } = await supabase
      .from('story_node')
      .insert({ ...params, user_id: user.id } as Tables<'story_node'>)
      .select()
      .single()
    if (error) {
      throw error
    }
    return camelizeKeys(data)
  },
  update: async (params: TablesUpdate<'story_node'>) => {
    const supabase = createClient()

    const { data, error } = await supabase
      .from('story_node')
      .update(params as Tables<'story_node'>)
      .eq('id', params.id!)
      .select()
      .single()
    if (error) {
      throw error
    }
    return camelizeKeys(data)
  },
  get: async (storyId: string) => {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('story_node')
      .select('*')
      .eq('id', storyId)
      .single()

    if (error) {
      throw error
    }
    return camelizeKeys(data)
  },
  // Get all of the story nodes in the story tree starting from a root node
  getStoryTree: async (rootId: string) => {
    const supabase = createClient()

    // Get all nodes. Obviously not efficient for large trees, but we're okay with it.
    const { data, error } = await supabase.from('story_node').select('*')
    if (error) {
      throw error
    }

    const storyNodes = data.map((d) => camelizeKeys(d)) as typeof data

    const buildTree = (
      nodes: typeof storyNodes,
      parentId: string | null = null
    ) => {
      return nodes
        .filter((node) => node.parentId === parentId)
        .map((node) => ({
          ...node,
          children: buildTree(nodes, node.id),
        }))
    }

    return buildTree(storyNodes, rootId)

    // A variation that uses async recursion to fetch children.
    // async function fetchChildren(parentId: string): Promise<any> {
    //   const { data, error } = await supabase
    //     .from('story_node')
    //     .select('*')
    //     .eq('parent_id', parentId);

    //   if (error) {
    //     throw error;
    //   }

    //   const nodes = camelizeKeys(data);

    //   // Recursively fetch children for each node
    //   const nodesWithChildren = await Promise.all(
    //     nodes.map(async (node) => ({
    //       ...node,
    //       children: await fetchChildren(node.id),
    //     }))
    //   );

    //   return nodesWithChildren;
    // }

    // return fetchChildren(rootId);
  },
}

export const User = {
  get: async () => {
    const supabase = createClient()
    const { data, error } = await supabase.auth.getUser()
    if (error) {
      throw error
    }
    return data.user
  },
}

const snakeCaseKeys = (obj: Record<string, any>) => {
  return Object.keys(obj).reduce(
    (acc, key) => {
      acc[camelToSnake(key)] = obj[key]
      return acc
    },
    {} as Record<string, any>
  )
}

const camelToSnake = (str: string) => {
  return str.replace(/([A-Z])/g, '_$1').toLowerCase()
}

const camelizeKeys = (obj: Record<string, any>) => {
  return Object.keys(obj).reduce(
    (acc, key) => {
      acc[snakeToCamel(key)] = obj[key]
      return acc
    },
    {} as Record<string, any>
  )
}

const snakeToCamel = (str: string) => {
  return str.replace(/_([a-z])/g, (match, letter) => letter.toUpperCase())
}
