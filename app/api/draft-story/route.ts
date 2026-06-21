export async function POST(request: Request) {
  try {
    const { reason, currentRole } = await request.json();

    if (!reason || !currentRole) {
      return Response.json(
        { error: "Reason and current role are required" },
        { status: 400 }
      );
    }

    const prompt = `I stopped being a developer because: ${reason}
    
Now I work as: ${currentRole}

Please write an inspiring and authentic story (200-300 words) about my career transition. The story should:
- Explain why I left development
- Highlight the positive aspects of my new role
- Show that changing careers isn't a failure but a growth opportunity
- Be conversational and genuine
- Inspire others who might be considering a career change

Write only the story, no introductions or meta-commentary.`;

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: "mixtral-8x7b-32768",
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 1024,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error("[v0] Groq error:", error);
      throw new Error("Groq API error");
    }

    const data = await response.json();
    const story = data.choices[0].message.content;

    return Response.json({
      success: true,
      story,
    });
  } catch (error) {
    console.error("[v0] AI draft error:", error);
    return Response.json(
      { error: "Failed to generate story draft" },
      { status: 500 }
    );
  }
}
