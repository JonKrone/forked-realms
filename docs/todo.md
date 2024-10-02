# Todo

## Flow

- User opens site
- The background is dark and starry, like a pearlescent miasma of gas and dust
- User sets their username, a floating card in the middle of the screen with a text input and "enter the story" button. This is just an anonymous supabase sign-in and we set their username.
  - If they are already signed in, we get their username and skip the card.
- User is redirected to the story root.
- It reads "And thus, the universe was created."
- Below that, connected via lines, we show 3-5 options for how to continue the story.
- Or the user may enter their own continuation.
- On submitting any of those, we send it to an LLM and ask it to generate the next 3-5 options.
- Then the cycle continues.

Component Breakdown and Task List

2. Supabase Setup
   Task 2.1: Create Supabase Project

   - Sign up for Supabase and create a new project.
   - Retrieve the Supabase API URL and public API key.

   Task 2.2: Configure Supabase in Next.js

   - Install Supabase client libraries.
   - Create a Supabase client instance with environment variables.
   - Set up authentication and authorization middleware.

   Task 2.3: Enable Anonymous Sign-in

   - In Supabase dashboard, enable anonymous authentication.

   Task 2.4: Set Up User Profiles Table

   - Create a profiles table in Supabase:
     - id: uuid (primary key)
     - username: text, unique
     - created_at: timestamp

3. User Authentication and Profile Management
   Task 3.2: Handle New User Sign-In

   - On form submission:
     - Use Supabase client to sign in anonymously.
     - Store the session data securely.
     - Insert the username into the profiles table with the user's ID.
     - Validate username uniqueness and handle errors.

   Task 3.3: Handle Returning Users

   - Check for an existing Supabase session on app load.
   - If the user is already signed in, fetch and display their username.
   - Skip the username entry card and redirect to the story root.

4. Design and Implement Background
   Task 4.1: Create Starry Background

   - Use Tailwind CSS and custom CSS to design a dark, starry background.
   - Implement animations for a pearlescent miasma effect using CSS animations or Canvas.

5. Story Root Page
   Task 5.1: Display Initial Story Text

   - Create a server component that renders "And thus, the universe was created."
   - Style the text using shadcn/ui typography components.

   Task 5.2: Fetch and Display Continuation Options

   - Query the database for the initial story node and its options.
   - Display 3-5 options connected via lines (use SVG or Canvas for lines).
   - Style options using shadcn/ui components.

   Task 5.3: Implement User Input for Custom Continuation

   - Provide a text input below the options for users to enter their own continuation.
   - Include validation to prevent empty submissions.

6. Story Continuation Logic
   Task 6.1: Create Story Nodes and Options in Database

   - Define stories table with fields:
     - id: UUID, primary key
     - parent_id: UUID, references stories.id (nullable for root)
     - content: Text
     - created_by: UUID, references profiles.id
     - created_at: Timestamp
   - Define options table with fields:
     - id: UUID, primary key
     - story_id: UUID, references stories.id
     - content: Text
     - created_at: Timestamp

   Task 6.2: Handle Option Selection

   - On user selecting an option:
     - Fetch the corresponding story node from the database.
     - Update the UI to display the new story content and its options.

   Task 6.3: Handle Custom Continuation Submission

   - On user submitting a custom continuation:
     - Insert a new story node into the stories table.
     - Set parent_id to the current story node's ID.
     - Associate the new node with the user.

7. OpenAI Integration
   Task 7.1: Set Up OpenAI API Client

   - Install OpenAI Node.js library.
   - Securely store the OpenAI API key using environment variables.

   Task 7.2: Create API Route for Generating Options

   - In Next.js, create an API route (e.g., /api/generate-options).
   - The API route should:
     - Accept the current story content as input.
     - Call the OpenAI API to generate 3-5 continuation options.
     - Return the options as a JSON response.

   Task 7.3: Implement OpenAI API Call

   - Craft a prompt that includes the current story and instructs the model to generate continuation options.
   - Example prompt:
     The story so far:
     "And thus, the universe was created."

     Provide 3 options for what happens next, numbered 1 to 3.

   - Ensure the response is parsed correctly to extract the options.

   Task 7.4: Handle AI-Generated Options

   - Insert AI-generated options into the options table associated with the current story node.
   - Display these options to the user.

8. React Query Integration
   Task 8.1: Configure React Query Client

   - Set up React Query provider in the application root.

   Task 8.2: Create Data Fetching Hooks

   - Use useQuery for fetching story nodes and options.
   - Use useMutation for creating new story nodes and options.

   Task 8.3: Implement Optimistic Updates

   - When users submit continuations or select options, optimistically update the UI.
   - Rollback changes if mutations fail.

9. Server Components and Data Fetching
   Task 9.1: Identify Server Components

   - Components that render story content and options can be server components.

   Task 9.2: Implement Server-Side Data Fetching

   - In server components, fetch data directly from Supabase using server-side code.
   - Pass data to client components as props.

10. Routing and Navigation
    Task 10.1: Implement Dynamic Routing with App Router

    - Use Next.js dynamic routes for story nodes (e.g., /story/[id]).
    - On navigation, fetch and display the story node corresponding to the id.

    Task 10.2: Update Navigation Logic

    - When users select an option or submit a continuation, navigate to the new story node's route.
    - Use Next.js useRouter for client-side navigation.

11. UI Enhancements
    Task 11.1: Visual Connections Between Options

    - Use SVG or Canvas to draw lines connecting the current story text to the options.
    - Ensure responsiveness and cross-browser compatibility.

    Task 11.2: Style Inputs and Buttons

    - Use shadcn/ui components for inputs and buttons.
    - Ensure accessibility and keyboard navigation support.

    Task 11.3: Implement Animations

    - Add subtle animations for transitions between story nodes.
    - Use Tailwind CSS utility classes for animations.

12. Error Handling and Validation
    Task 12.1: Handle API Errors

    - Implement try-catch blocks around API calls.
    - Display user-friendly error messages.

    Task 12.2: Validate User Input

    - Check for inappropriate content in user submissions.
    - Implement input sanitization to prevent XSS attacks.

    Task 12.3: Rate Limiting

    - Implement basic rate limiting to prevent abuse of the OpenAI API.

13. Security Considerations
    Task 13.1: Secure API Keys

    - Store OpenAI and Supabase keys in environment variables.
    - Ensure they are not exposed to the client-side code.

    Task 13.2: Protect API Routes

    - Use Next.js API route middlewares to verify user authentication.
    - Ensure only authenticated requests can create or modify data.
