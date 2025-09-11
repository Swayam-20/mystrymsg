import { createOpenAI } from '@ai-sdk/openai';
import { streamText } from 'ai';

// Initialize OpenAI client
const openai = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY!, // make sure this is set
});

// Function to stream a greeting message
export async function POST(req: Request) {
  const prompt = `
Generate a short, friendly, and creative welcome message for a new user who just signed up for a productivity app. 
The message should:
- Feel personal and encouraging.
- Motivate the user to get started right away.
- Be no longer than 20 words.
- Randomize tone and wording each time so the message feels unique.
`;

  try {
    const result = await streamText({
      model: openai('gpt-4o-mini'), // ✅ good for fast streaming
      messages: [{ role: 'user', content: prompt }]
    });

    // Send back as a streaming response
    return result.toTextStreamResponse();
  } catch (error) {
    if (error instanceof Error && error.message === 'The request timed out.') {
      console.log('message timeout error');
      const { name, message, cause } = error;
      return Response.json(
        {
          name,
          message,
          cause,
        },
        { status: 408 },
      );
    } else {
      console.error(error);
      return Response.json(
        {
          success: false,
          message: 'Internal Server Error',
          status: 500,
          data: null,
        },
        { status: 500 },
      );
    }
  }
}
