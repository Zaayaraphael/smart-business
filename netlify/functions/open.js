const generateAIAdvice = async () => {
  setLoading(true);
  setSummary('');
  try {
    // Send a POST request to your Netlify function
    const response = await fetch('/.netlify/functions/openai', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt: 'Analyze my business sales' }),
    });

    const data = await response.json();

    // Handle the response and update the summary
    setSummary(data.result);
  } catch (error) {
    console.error('AI summary error:', error);
    setSummary('⚠️ Something went wrong while generating the AI summary.');
  } finally {
    setLoading(false);
  }
};
