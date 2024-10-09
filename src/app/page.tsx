import { generateId } from 'ai'
import { redirect } from 'next/navigation'

export default function Home() {
  const rootId = generateId()
  redirect(`/story/${rootId}`)
}
