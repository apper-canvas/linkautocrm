import apper from "https://cdn.apper.io/actions/apper-actions.js";
import OpenAI from "npm:openai";

apper.serve(async (req) => {
  try {
    // Validate request method
    if (req.method !== "POST") {
      return new Response(
        JSON.stringify({
          success: false,
          error: "Method not allowed. Use POST."
        }),
        { 
          status: 405,
          headers: { "Content-Type": "application/json" }
        }
      );
    }

    // Parse and validate request body
    let body;
    try {
      body = await req.json();
    } catch (parseError) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "Invalid JSON in request body"
        }),
        { 
          status: 400,
          headers: { "Content-Type": "application/json" }
        }
      );
    }

    const { dealName, dealValue, contactName } = body;

    // Validate required fields
    if (!dealName || !dealValue || !contactName) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "Missing required fields: dealName, dealValue, and contactName are required"
        }),
        { 
          status: 422,
          headers: { "Content-Type": "application/json" }
        }
      );
    }

    // Validate data types
    if (typeof dealName !== "string" || typeof contactName !== "string") {
      return new Response(
        JSON.stringify({
          success: false,
          error: "dealName and contactName must be strings"
        }),
        { 
          status: 422,
          headers: { "Content-Type": "application/json" }
        }
      );
    }

    const value = parseFloat(dealValue);
    if (isNaN(value) || value <= 0) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "dealValue must be a positive number"
        }),
        { 
          status: 422,
          headers: { "Content-Type": "application/json" }
        }
      );
    }

    // Get OpenAI API key from secrets
    const apiKey = await apper.getSecret("OPENAI_API_KEY");
    if (!apiKey) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "OpenAI API key not configured. Please add OPENAI_API_KEY to your secrets."
        }),
        { 
          status: 500,
          headers: { "Content-Type": "application/json" }
        }
      );
    }

    // Initialize OpenAI client
    const openai = new OpenAI({ apiKey });

    // Format currency for prompt
    const formattedValue = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD"
    }).format(value);

    // Generate email using OpenAI
    let completion;
    try {
      completion = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: "You are a professional business email writer. Generate congratulatory emails for won deals that are warm, professional, and express genuine appreciation. Keep emails concise (3-4 paragraphs) and appropriate for business communication."
          },
          {
            role: "user",
            content: `Generate a professional congratulatory email for winning a deal with the following details:
- Deal Name: ${dealName}
- Deal Value: ${formattedValue}
- Contact Name: ${contactName}

The email should:
1. Congratulate the contact on closing the deal
2. Reference the specific deal name and value
3. Express appreciation for their business
4. Look forward to future collaboration
5. Be warm but professional in tone
6. Include appropriate greeting and closing

Format the email with proper structure (greeting, body paragraphs, closing).`
          }
        ],
        temperature: 0.7,
        max_tokens: 500
      });
    } catch (openaiError) {
      return new Response(
        JSON.stringify({
          success: false,
          error: `OpenAI API error: ${openaiError.message}`
        }),
        { 
          status: 502,
          headers: { "Content-Type": "application/json" }
        }
      );
    }

    // Extract generated email
    const generatedEmail = completion.choices[0]?.message?.content;
    
    if (!generatedEmail) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "Failed to generate email content from OpenAI"
        }),
        { 
          status: 500,
          headers: { "Content-Type": "application/json" }
        }
      );
    }

    // Return successful response
    return new Response(
      JSON.stringify({
        success: true,
        email: generatedEmail,
        metadata: {
          model: completion.model,
          tokensUsed: completion.usage?.total_tokens || 0
        }
      }),
      { 
        status: 200,
        headers: { "Content-Type": "application/json" }
      }
    );

  } catch (error) {
    // Catch any unexpected errors
    return new Response(
      JSON.stringify({
        success: false,
        error: `Unexpected error: ${error.message}`
      }),
      { 
        status: 500,
        headers: { "Content-Type": "application/json" }
      }
    );
  }
});