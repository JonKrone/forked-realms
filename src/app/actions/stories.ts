'use server'

import { models } from '@/lib/ai-models'
import { replicate } from '@/lib/replicate'
import { actionClient } from '@/lib/safe-action'
import { StoryNode, StoryNodeCreateParams } from '@/lib/supabase/story-node'
import { APICallError, generateId, RetryError, streamObject } from 'ai'
import { createStreamableValue } from 'ai/rsc'
import { ApiError as ReplicateApiError } from 'replicate'
import { z } from 'zod'

export type ClientDelta =
  | {
      type: 'new-node'
      payload: { id: string; text: string; characterDescriptions: string }
    }
  | {
      type: 'image-generated'
      payload: { id: string; imageUrl: string; imagePrompt: string }
    }

export type ClientErrors =
  | { error: 'rate-limit-exceeded' }
  | { error: 'something-went-wrong' }

export const generateImage = actionClient
  .schema(z.object({ prompt: z.string() }))
  .action(async ({ parsedInput: { prompt } }) => {
    const imageUrl = await _generateImage(prompt)
    return { imageUrl }
  })

export const generateContinuations = actionClient
  .schema(
    z.object({
      parentId: z.string().optional(),
      storyNodes: z.array(
        z.object({
          id: z.string().optional(),
          text: z.string(),
          root: z.boolean(),
          leaf: z.boolean(),
          characterDescriptions: z.string().optional(),
          imageUrl: z.string().nullable().optional(),
          imagePrompt: z.string().nullable().optional(),
        })
      ),
    })
  )
  .action(async ({ parsedInput: { parentId, storyNodes } }) => {
    const stream = createStreamableValue<string, ClientErrors>('')

    const storySteps = storyNodes
      .map((node) => `<story-step>${node.text}</story-step>`)
      .join('\n')
    const characterDescriptions = storyNodes.at(-1)?.characterDescriptions || ''

    // Kick off the continuation generation in the background. Don't want to block the stream
    generateStoryContinuations(
      stream,
      storySteps,
      characterDescriptions,
      parentId
    )

    return { stream: stream.value }
  })

type ContinuationsStream = ReturnType<
  typeof createStreamableValue<string, ClientErrors>
>
async function generateStoryContinuations(
  stream: ContinuationsStream,
  storySteps: string,
  characterDescriptions: string,
  parentId?: string
) {
  let streamErrored = false
  let imageGenerationPromises: Promise<void>[] = []

  try {
    const continuations = await _generateContinuations(
      storySteps,
      characterDescriptions
    )

    for await (const continuation of continuations.elementStream) {
      if (streamErrored) break

      const nodeParams: StoryNodeCreateParams = {
        id: generateId(6),
        parent_id: parentId,
        text: continuation.nextPartOfTheStory,
        character_descriptions: continuation.characterDescriptions,
        image_prompt: continuation.imagePrompt,
      }

      console.log('New Continuation:', nodeParams.id)

      // Tell the client about the new node
      stream.update(
        JSON.stringify({
          type: 'new-node',
          payload: {
            id: nodeParams.id,
            text: nodeParams.text,
            characterDescriptions: nodeParams.character_descriptions,
          },
        })
      )

      // Create the node but don't await it, we want to stream the node as soon as possible
      StoryNode.create(nodeParams).catch((error) => {
        streamErrored = true
        console.error('Error creating node', nodeParams.id, error)
        handleError(error, stream)
      })

      // Generate an image for this story node, send it to the client, and save it to the database
      const imagePromise = generateImageForNode(nodeParams, stream).catch(
        (error) => {
          streamErrored = true
          console.error('Error generating image for node', nodeParams.id, error)
          handleError(error, stream)
        }
      )

      // Keep track of the image generations so we can wait for them all to complete before ending
      // the stream
      imageGenerationPromises.push(imagePromise)
    }

    await Promise.allSettled(imageGenerationPromises)

    if (!streamErrored) {
      stream.done()
    }
  } catch (error) {
    streamErrored = true
    console.error('Error generating continuations', error)
    handleError(error, stream)
  }
}

async function generateImageForNode(
  nodeParams: StoryNodeCreateParams,
  stream: ContinuationsStream
) {
  const imageUrl = await _generateImage(nodeParams.image_prompt!)

  // Tell the client about the new image URL
  stream.update(
    JSON.stringify({
      type: 'image-generated',
      payload: {
        id: nodeParams.id,
        imageUrl,
        imagePrompt: nodeParams.image_prompt,
      },
    })
  )

  // Update the story node with the image URL
  StoryNode.update({ id: nodeParams.id, image_url: imageUrl })
}

async function _generateContinuations(
  storySteps: string,
  characterDescriptions: string
) {
  const result = await streamObject({
    model: models.openai.gpt4o,
    output: 'array',
    schema: z.object({
      nextPartOfTheStory: z.string().describe('The next part of the story'),
      characterDescriptions: z
        .string()
        .describe(
          'The descriptions of characters or entities in the story so far'
        ),
      imagePrompt: z.string().describe('The prompt for the image'),
    }),
    maxRetries: 1,
    system: `Generate 3 creative and unique continuations of a given story, drawing inspiration from previous segments where relevant or humorous. The tone should be quirky, intuitive, and appealing to an audience of 25-40-year-old tech-savvy individuals.

# Steps

1. **Review Story Steps**: Thoroughly review the provided series of story steps to understand the plot, characters, and setting.
2. **Review Previous Character Descriptions**: Review the provided descriptions of any main characters or significant entities in the story so far.
3. **Identify Key Elements**: Note any particularly funny or relevant elements in previous segments that can be incorporated into the new continuations.
4. **Generate Continuations**: Create 3 potential continuations of the story, ensuring they are creative and unique. Stick to 2 sentences or less.
5. **Generate Character Descriptions**: Provide concise descriptions of any main characters or significant entities in the story so far. These descriptions should be detailed enough to aid in visual representation.
6. **Generate Image Prompt**: Create a prompt for an image that would fit the next part of the story. Ensure it is a high-quality image suitable for a storybook. Include the character descriptions in the prompt to improve image consistency.
7. **Maintain Tone**: Ensure that the continuations are quirky and intuitive, consistent with the intended vibe for the target audience.

# Output Format

Provide:

- **Continuations**: 3 short paragraphs that creatively extend the story. Do not prefix them with numbering.
- **Character Descriptions**: Concise descriptions of any main characters or significant entities in the story so far.
- **Image Prompt**: A prompt for an image representing the next part of the story, incorporating the character descriptions. The image prompt should be suitable for a high-quality storybook illustration.

# Examples

## Input

Story Steps:

1. The eccentric inventor built a robot out of used coffee machines.
2. The robot, named Caffeine, developed a peculiar obsession with brewing the perfect cup of joe.
3. Caffeine decided to venture out into the world to find the mythical "perfect bean."

Previous Character Descriptions:

- **Caffeine**: A quirky robot made from gleaming coffee machine parts, featuring a percolator body, steam-powered limbs, and a digital display for expressions.
- **The Eccentric Inventor**: A wild-haired genius in mismatched socks, sporting goggles and a lab coat stained with coffee and ink.

## Output

**Continuations**:

- Just as Caffeine's sensors picked up the aroma of the legendary bean, they stumbled into an underground café run by sentient espresso machines.
- While hacking into a global coffee database, Caffeine accidentally initiated a worldwide hunt for the perfect bean, turning baristas into bounty hunters.
- Caffeine joined forces with a Wi-Fi-enabled toaster, and together they embarked on a quest that blended caffeine and code.

**Character Descriptions**:

- **Caffeine**: A quirky robot made from gleaming coffee machine parts, featuring a percolator body, steam-powered limbs, and a digital display for expressions.
- **The Eccentric Inventor**: A wild-haired genius in mismatched socks, sporting goggles and a lab coat stained with coffee and ink.
- **Wi-Fi-enabled Toaster**: A sleek, metallic toaster with LED lights, antennae, and a friendly digital interface.

**Image Prompt**:

"Illustrate Caffeine—a robot built from coffee machines with a percolator body and steam-powered limbs—standing beside a futuristic toaster with LED lights, as they navigate an underground café filled with sentient espresso machines. The setting is illuminated by the warm glow of vintage bulbs, capturing a whimsical and tech-savvy atmosphere suitable for a storybook."

# Notes

- The continuations should draw on established story elements and introduce new, interesting twists or comedic elements.

- Keep in mind the tech-savvy nature of the audience and incorporate tech-related humor or scenarios where applicable.

- Do not prefix your continuations with numbering such as "1.", "2.", etc.`,
    prompt: `<story-steps>${storySteps}</story-steps>
    <previous-character-descriptions>${characterDescriptions || 'None so far.'}</previous-character-descriptions>`,
  })

  return result
}

async function _generateImage(prompt: string) {
  const [imageUrl] = (await replicate.run(models.blackForestLabs.schnell, {
    input: {
      prompt,
      aspect_ratio: '1:1', // 3:4, 2:3, 3:4, 9:21
    },
  })) as string[]

  return imageUrl
}

function handleError(error: any, stream: ContinuationsStream) {
  if (isOpenAIRateLimitError(error) || isReplicateRateLimitError(error)) {
    stream.error({ error: 'rate-limit-exceeded' })
  } else {
    stream.error({ error: 'something-went-wrong' })
  }
}

function isOpenAIRateLimitError(error: any): error is RetryError {
  return (
    error instanceof RetryError &&
    error.lastError instanceof APICallError &&
    error.lastError.statusCode === 429
  )
}

function isReplicateRateLimitError(error: any) {
  return (error as ReplicateApiError)?.response?.status === 402
}
