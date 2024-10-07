'use server'

import { Button } from '@/components/ui/button'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { UpdateUsernameForm } from '@/components/UpdateUsernameForm'
import { serverSupabase } from '@/lib/supabase/server'
import { ChevronDownIcon } from 'lucide-react'

export async function UsernameModal() {
  const {
    data: { user },
  } = await serverSupabase().auth.getUser()

  if (!user || user.user_metadata.username) {
    return null
  }

  // const [open, setOpen] = useState(false)
  return (
    <Dialog open={!user.user_metadata.username}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">
            Welcome
          </DialogTitle>
        </DialogHeader>
        <DialogDescription className="space-y-3">
          <p className="text-sm ">
            This project was created as an experiment in using cutting-edge
            frontend libraries and tooling. In particular, it:
          </p>
          <ul className="list-disc list-inside space-y-1">
            <li>
              Almost the entire app is server-rendered with React Server
              Components. To do so, we're using release candidates of both
              Next.JS and React 19.
            </li>
            <li>
              All of the generative AI is streamed and we end up multiplexing
              the stream to support both images and text.
            </li>
            <li>
              Uses <strong>GPT 4o</strong> to generate the story and{' '}
              <strong>Black Forest Labs' FLUX</strong> for fast image
              generation.
            </li>
            <li>
              Uses <strong>Vercel AI SDK</strong> for model integration.
            </li>
          </ul>
          <Collapsible className="mt-2 border rounded-md">
            <CollapsibleTrigger className="flex items-center justify-between w-full p-3 text-sm font-medium text-left text-gray-700 bg-gray-100 hover:bg-gray-200 focus:outline-none">
              <span>Other technologies</span>
              <ChevronDownIcon className="w-4 h-4 transition-transform duration-200 transform collapsible-chevron" />
            </CollapsibleTrigger>
            <CollapsibleContent className="CollapsibleContent p-2 text-sm bg-white">
              <ul className="space-y-1 list-disc list-inside">
                <li>
                  Uses <strong>Supabase</strong> for authentication and
                  database.
                </li>
                <li>
                  Uses <strong>Shadcn/UI</strong> and <strong>Radix UI</strong>{' '}
                  for UI components.
                </li>
                <li>
                  Uses <strong>React-Flow</strong>, a node-based graph editor
                  for the story. I'm interested in canvasses for AI-based tool
                  as they provide a flexible UX surface for surfacing and
                  interacting with complex workflows.
                </li>
                <li>
                  Uses <strong>Tailwind CSS</strong> for styling.
                </li>
                <li>
                  Hosted on <strong>Cloudflare</strong> and{' '}
                  <strong>Vercel</strong>
                </li>
              </ul>
            </CollapsibleContent>
          </Collapsible>

          <Separator />
          <p className="text-sm text-center">
            Welcome to <strong>Forked Realms</strong>, a text-and-image
            adventure where you'll shape a universe through your choices.
          </p>
          <p className="text-sm text-center">
            Dive into a world where every decision forks a new reality!
          </p>
        </DialogDescription>
        <DialogDescription>
          <UpdateUsernameForm>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-3">
                <Input
                  id="username"
                  name="username"
                  placeholder="Who will you be?"
                  autoComplete="off"
                  required
                  className="text-center"
                />
                <Button className="w-full" type="submit">
                  Begin
                </Button>
              </div>
            </div>
          </UpdateUsernameForm>
        </DialogDescription>
      </DialogContent>
    </Dialog>
  )
}
