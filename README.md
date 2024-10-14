# Forked Realms

Forked Realms is an experimental text-and-image adventure project designed to explore cutting-edge frontend technologies and AI integrations.

## Overview

This application allows users to build a story one step at a time, leveraging modern web development tools and AI-generated content.

The use of generative AI here is fairly straightforward. One new-to-me technique here was the combination of server streaming and multiplexing. When you click a story node to add it to your story, we initiate one request which passes back a stream that the client can listen to for updates. The server the kicks off multiple generations in parallel which have different latencies and then multiplexes the results back to the client. This is a light-weight version of what servers have been doing for a long time with WebSockets, which I am very excited to explore further in future projects.

## Technologies

- **React Server Components**: Utilizes React 19 and Next.js App Router for server-side rendering.
- **Streaming Generative AI**: Streams AI-generated text and images, multiplexing content .
- **React Experimental Compiler**: Implements React's experimental compiler for performance optimization.
- **AI Models**: Integrates GPT-4o for story generation and Black Forest Labs' FLUX for image generation.
- **Vercel AI SDK**: Facilitates AI model integration.
- **Supabase**: Handles user authentication and the StoryNodes database.
- **UI Components**: Uses Shadcn/UI and Radix UI for building the interface.
- **React Flow**: Incorporates a node-based graph editor for story visualization.
- **Tailwind CSS**: Applies utility-first CSS for styling.
- **Hosting**: Deployed on Vercel.
