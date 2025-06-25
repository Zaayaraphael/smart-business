const axios = require("axios");

exports.handler = async (event, context) => {
  const { prompt } = JSON.parse(event.body || "{}");

  if (!prompt) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Prompt is required" }),
    };
  }

  try {
    const openAiKey = process.env.OPENAI_API_KEY;

    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
      },
      {
        headers: {
          Authorization: `Bearer ${openAiKey}`,
          "Content-Type": "application/json",
        },
      }
    );

    return {
      statusCode: 200,
      body: JSON.stringify({
        result: response.data.choices[0].message.content,
      }),
    };
  } catch (err) {
    console.error("OpenAI error:", err.message);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to get AI response" }),
    };
  }
};
