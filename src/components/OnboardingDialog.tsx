'use client'

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
import { UpdateUsernameForm } from '@/components/UpdateUsernameForm'
import { ChevronDownIcon } from 'lucide-react'
import { useState } from 'react'

export function OnboardingDialog() {
  const [currentPage, setCurrentPage] = useState(0)

  const handleNextPage = () => {
    setCurrentPage((p) => p + 1)
  }

  const handlePreviousPage = () => {
    setCurrentPage((p) => p - 1)
  }

  return (
    <Dialog open={true}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">
            Welcome
          </DialogTitle>
        </DialogHeader>
        {currentPage === 0 && (
          <>
            <DialogDescription>
              Welcome to <strong>Forked Realms</strong>, a text-and-image
              adventure where you'll build a story one step at a time.
            </DialogDescription>
            <DialogDescription>
              Dive into a world where every decision forks a new reality!
            </DialogDescription>
            <div className="flex justify-end">
              <Button onClick={handleNextPage}>Next</Button>
            </div>
          </>
        )}
        {currentPage === 1 && (
          <>
            <DialogDescription className="space-y-3">
              This project was created as an experiment in using cutting-edge
              frontend libraries and tooling. In particular:
            </DialogDescription>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
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
                React's experimental compiler is used to optimize performance
                and simplify the DX.
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
            <Collapsible className="mt-2 border rounded-md text-muted-foreground">
              <CollapsibleTrigger className="flex items-center justify-between w-full p-3 text-sm font-medium text-left text-gray-700 bg-gray-100 hover:bg-gray-200 focus:outline-none">
                <span>Other technologies</span>
                <ChevronDownIcon className="w-4 h-4 transition-transform duration-200 transform collapsible-chevron" />
              </CollapsibleTrigger>
              <CollapsibleContent className="CollapsibleContent p-2 text-sm bg-white">
                <ul className="space-y-1 list-disc list-inside">
                  <li>
                    Uses <strong>Supabase</strong> for authentication.
                  </li>
                  <li>
                    Uses <strong>Shadcn/UI</strong> and{' '}
                    <strong>Radix UI</strong> for UI components.
                  </li>
                  <li>
                    Uses <strong>React-Flow</strong>, a node-based graph editor
                    for the story. I'm interested in canvases for AI-based tool
                    as they provide a flexible UX for surfacing information and
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
            <div className="flex justify-between">
              <Button variant="ghost" onClick={handlePreviousPage}>
                Back
              </Button>
              <Button onClick={handleNextPage}>Next</Button>
            </div>
          </>
        )}
        {currentPage === 2 && (
          <UpdateUsernameForm>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-3">
                <Input
                  id="username"
                  name="username"
                  placeholder="Who will you be?"
                  autoComplete="off"
                  autoFocus
                  required
                  className="text-center"
                />
                <div className="flex justify-between">
                  <Button
                    variant="ghost"
                    type="button" // tell the form we're not related to it
                    onClick={handlePreviousPage}
                  >
                    Back
                  </Button>
                  <Button type="submit">Begin</Button>
                </div>
              </div>
            </div>
          </UpdateUsernameForm>
        )}
      </DialogContent>
    </Dialog>
  )
}
