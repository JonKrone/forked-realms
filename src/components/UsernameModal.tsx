import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { serverSupabase } from '@/lib/supabase/server'

export const UsernameModal = async () => {
  const {
    data: { user },
  } = await serverSupabase().auth.getUser()
  if (user?.user_metadata.username) {
    return null
  }

  console.log('user', user)

  const handleSubmit = async (formData: FormData) => {
    'use server'
    console.log(formData)

    // const res = await serverSupabase().auth.signInAnonymously()
    // console.log('res', res)
    const res2 = await serverSupabase().auth.updateUser({
      data: {
        username: formData.get('username'),
      },
    })
    console.log('res2', res2)
  }
  console.log('UsernameModal')

  return (
    <div className="min-h-screen w-full top-0 absolute flex items-center justify-center">
      <Card className="w-[350px] shadow-lg z-50">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Welcome to the Story
          </CardTitle>
        </CardHeader>
        <form action={handleSubmit}>
          <CardContent>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Input
                  id="username"
                  name="username"
                  placeholder="Who will you be?"
                  autoComplete="off"
                  required
                  className="text-center"
                />
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full" type="submit">
              Enter the Story
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
