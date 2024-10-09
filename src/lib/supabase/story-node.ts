import { createClient } from '@/lib/supabase/server'
import { TablesUpdate } from '../../../supabase/supabase.types'

export const StoryNode = {
  upsert: async (params: TablesUpdate<'story_node'>) => {
    const supabase = createClient()

    console.log('updating storynode params', params)
    const { data, error } = await supabase.from('story_node').upsert(params)

    if (error) {
      throw error
    }
    return data
  },
  get: async (storyId: string) => {
    const supabase = createClient()
    // const { data: userData, error: userError } = await supabase.auth.getUser()

    // if (userError || !userData) {
    //   throw userError
    // }

    const { data, error } = await supabase
      .from('story_node')
      .select('*')
      .eq('story_id', storyId)
    // .eq('user_id', userData.user.id)

    if (error) {
      throw error
    }
    return data
  },
}
