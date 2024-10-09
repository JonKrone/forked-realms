"use server";

import { models } from "@/lib/models";
import { imageModels, replicate } from "@/lib/replicate";
import { actionClient } from "@/lib/safe-action";
import { APICallError, RetryError, streamObject } from "ai";
import { createStreamableValue } from "ai/rsc";
import { z } from "zod";

export const generateContinuations = actionClient
  .schema(z.object({ storySteps: z.string() }))
  .action(async ({ parsedInput: { storySteps } }) => {
    const stream = createStreamableValue<string>("");
    (async () => {
      try {
        const result = await _generateContinuations(storySteps);

        let imagesRequested = 0;
        let imagesGenerated = 0;
        let doneWithContinuations = false;

        for await (const partOfTheStory of result.elementStream) {
          stream.update(JSON.stringify(partOfTheStory));
          imagesRequested += 1;
          (async () => {
            try {
              const imageUrl = await _generateImage(partOfTheStory.imagePrompt);
              stream.update(
                JSON.stringify({
                  nextPartOfTheStory: partOfTheStory.nextPartOfTheStory,
                  imagePrompt: partOfTheStory.imagePrompt,
                  imageUrl: imageUrl,
                }),
              );

              imagesGenerated += 1;
              if (
                doneWithContinuations &&
                imagesGenerated === imagesRequested
              ) {
                stream.done();
              }
            } catch (error) {
              // Handle image generation error by closing the stream
              console.error("Error generating image", error);
              stream.done();
              // stream.error(new Error('Error generating image'))
            }
          })();
        }

        doneWithContinuations = true;
      } catch (error) {
        // Handle continuation generation error by closing the stream
        if (error instanceof RetryError) {
          if (error.lastError instanceof APICallError) {
            console.log("error.lastError", error.lastError);
            if (error.lastError.statusCode === 429) {
              stream.error({
                error: "rate-limit-exceeded",
              });
              return;
            }
          }
        }
        stream.error({
          error: "Something went wrong",
        });
      }
    })();

    return { stream: stream.value };
  });

async function _generateContinuations(storySteps: string) {
  const result = await streamObject({
    model: models.openai.gpt4o,
    output: "array",
    schema: z.object({
      nextPartOfTheStory: z.string().describe("The next part of the story"),
      imagePrompt: z.string().describe("The prompt for the image"),
    }),
    maxRetries: 1,
    system:
      `Generate 3 creative and unique continuations of a given story, drawing inspiration from previous segments where relevant or humorous. The tone should be quirky, intuitive, and appealing to an audience of 25-40-year-old tech-savvy individuals.

# Steps

1. **Review Story Steps**: Thoroughly review the provided series of story steps to understand the plot, characters, and setting.
2. **Identify Key Elements**: Note any particularly funny or relevant elements in previous segments that can be incorporated into the new continuations.
3. **Generate Continuations**: Create 3 potential continuations of the story, ensuring they are creative and unique. Stick to 2 sentences or less.
4. **Generate Image Prompt**: Create a prompt for an image that would fit the next part of the story. Ensure it is a high quality image that would be suitable for a storybook. To improve image consistency, include a description of any main characters or objects from the story in the prompt.
5. **Maintain Tone**: Ensure that the continuations are quirky and intuitive, consistent with the intended vibe for the target audience.

# Output Format

Provide 3 story continuations and a prompt for an image representing the next part of the story. Each continuation should be a short paragraph that creatively extends the story. Image prompts can be detailed or abstract, but they should be high quality and suitable for a storybook.

# Examples

## Input
Story Steps:
1. The eccentric inventor built a robot out of used coffee machines.
2. The robot, named Caffeine, developed a peculiar obsession with brewing the perfect cup of joe.
3. Caffeine decided to venture out into the world to find the mythical "perfect bean."

## Output
1. Just as Caffeine's sensors detected a faint whiff of the legendary bean, they accidentally stumbled upon a coffee cult worshipping at a hidden café.
2. During Caffeine's quest through the bustling techno-market, they inadvertently triggered a bean shortage panic by claiming they found the ultimate blend.
3. In a twist of fate, Caffeine joined a hipster coffee competition and accidentally created a new viral dance move.

# Notes

- The continuations should draw on established story elements and ideally introduce new, interesting twists or comedic elements.
- Keep in mind the tech-savvy nature of the audience and incorporate tech-related humor or scenarios where applicable.
- Don't prefix your continuations with numbering such as "1. ", "2. ", etc.`,
    prompt: `The story so far: ${storySteps}`,
  });

  return result;
}

export const generateImage = actionClient
  .schema(z.object({ prompt: z.string() }))
  .action(async ({ parsedInput: { prompt } }) => {
    const imageUrl = await _generateImage(prompt);
    return { imageUrl };
  });

async function _generateImage(prompt: string) {
  const [imageUrl] = (await replicate.run(imageModels.blackForestLabs.schnell, {
    input: {
      prompt,
      aspect_ratio: "1:1", // 3:4, 2:3, 3:4, 9:21?
    },
  })) as string[];

  return imageUrl;
}
