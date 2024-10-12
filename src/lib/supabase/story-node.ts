import { createClient } from '@/lib/supabase/server'
import { User } from '@/lib/supabase/user'
import { camelizeKeys } from '@/lib/utils'
import {
  Tables,
  TablesInsert,
  TablesUpdate,
} from '../../../supabase/supabase.types'

export type StoryNodeCreateParams = Omit<TablesInsert<'story_node'>, 'user_id'>

export const StoryNode = {
  create: async (params: StoryNodeCreateParams) => {
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
      .maybeSingle()

    if (error) {
      throw error
    }
    return data ? camelizeKeys(data) : null
  },
  // Get all of the story nodes in the story tree starting from a root node
  getStoryTree: async (rootId: string) => {
    const supabase = createClient()

    // A recursive SQL query to get all of the nodes from a root node.
    // See supabase/migrations/20241011192819_add_recursive_story_tree_function.sql
    const { data, error } = await supabase.rpc('get_story_subtree', {
      start_node_id: rootId,
    })
    if (error) {
      throw error
    }

    return data.map((d) => camelizeKeys(d))
  },
}
