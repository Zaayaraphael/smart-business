const axios = require("axios");

exports.handler = async (event) => {
  const { prompt } = JSON.parse(event.body || "{}");
  const apiKey = process.env.OPENAI_API_KEY;

  try {
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
      },
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
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
  } catch (error) {
    console.error("OpenAI error:", error.message);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "AI call failed" }),
    };
  }
};
