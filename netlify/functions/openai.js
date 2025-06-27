const axios = require("axios");

exports.handler = async (event, context) => {
  const { messages } = JSON.parse(event.body || "{}");

  if (!messages || !Array.isArray(messages)) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Messages array is required" }),
    };
  }

  try {
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-3.5-turbo",
        messages: messages,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const aiReply = response.data.choices?.[0]?.message?.content;

    return {
      statusCode: 200,
      body: JSON.stringify({ result: aiReply }),
    };
  } catch (err) {
    console.error("OpenAI error:", err.response?.data || err.message);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to get AI response" }),
    };
  }
};
