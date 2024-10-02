# Forked Realms

## Description

Create an online platform where users collaboratively build a text-based adventure story. The story starts with a broad beginning, such as:

> "And thus, the universe was created."

At each step:

- An LLM (Language Model) provides 3-5 options for the next action
- Users can choose from these options or enter their own continuation
- Users have the ability to "fork" the universe, creating alternative story paths

## Why This Project?

- Easy Interaction
  - Text-based adventures are accessible
  - Requires minimal effort from users
- LLM Integration
  - Incorporates AI-generated content
  - Demonstrates proficiency in integrating LLMs
- Showcases React Server Features
  - Server Components
    - Render story content and options on the server side
  - Server Functions
    - Handle user input and LLM API calls securely on the server

## Key Features

- [ ] Collaborative storytelling
- [ ] AI-generated story options
- [ ] User-created continuations
- [ ] Universe forking
- [ ] Server-side rendering and processing

Project Overview
Objective: Build a collaborative text adventure application where users can contribute to an evolving story. The application includes user authentication, dynamic storytelling with LLM integration, and an interactive UI.

Tech Stack:

Frontend: React 19 with Server Components, Next.js App Router
State Management: React Query
Backend Services:
Supabase: User authentication and database
OpenAI API: Language model for generating story continuations
UI Components: shadcn/ui, Radix UI
Styling: Tailwind CSS
Deployment: Next.js application

User Journey Breakdown
Landing Page:

Displays a dark, starry background (pearlescent miasma of gas and dust).
Presents a floating card in the center with username input and "Enter the Story" button.
If already signed in, skips to the story root.
Story Root:

Shows the initial story text: "And thus, the universe was created."
Displays 3-5 continuation options connected via lines.
Option for the user to enter their own continuation.
Story Continuation:

On selecting or submitting a continuation, sends it to an LLM (OpenAI).
Generates the next set of 3-5 options.
The cycle repeats.
