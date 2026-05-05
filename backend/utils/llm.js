const OpenAI = require("openai");

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

/**
 * Generates a structured AI comparison insight for a set of colleges.
 * We send structured JSON data in the prompt — much better than plain text.
 *
 * @param {Array} colleges - Array of college objects from the DB
 * @returns {Object} - { bestForPlacement, mostAffordable, recommendation }
 */
const generateComparisonInsight = async (colleges) => {
  // If no API key configured, return a mock response (useful for local dev)
  if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === "sk-your-openai-key-here") {
    return getMockInsight(colleges);
  }

  try {
    // Structured prompt: give the LLM clean JSON, ask for clean JSON back
    const prompt = `You are an expert college counselor. Analyze the following colleges and provide a concise comparison insight.

College Data (JSON):
${JSON.stringify(colleges, null, 2)}

Respond ONLY with a valid JSON object in this exact format:
{
  "bestForPlacement": "college name here",
  "mostAffordable": "college name here", 
  "recommendation": "2-3 sentence recommendation covering which college suits what type of student and why"
}

Be specific, data-driven, and concise. Do not add any text outside the JSON.`;

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo", // cheap and fast for this use case
      messages: [{ role: "user", content: prompt }],
      temperature: 0.4, // lower = more consistent output
      max_tokens: 300,
    });

    const rawText = response.choices[0].message.content.trim();

    // Parse the JSON response
    const insight = JSON.parse(rawText);
    return insight;
  } catch (err) {
    console.error("LLM error:", err.message);
    // Fallback to rule-based insight if LLM fails
    return getMockInsight(colleges);
  }
};

// Rule-based fallback — no API needed, useful for demo/dev
const getMockInsight = (colleges) => {
  const sorted = [...colleges];
  const bestPlacement = sorted.sort((a, b) => b.placement_percentage - a.placement_percentage)[0];
  const mostAffordable = [...colleges].sort((a, b) => a.fees - b.fees)[0];

  return {
    bestForPlacement: bestPlacement.name,
    mostAffordable: mostAffordable.name,
    recommendation: `${bestPlacement.name} leads in placement at ${bestPlacement.placement_percentage}%. ${mostAffordable.name} is the most budget-friendly at ₹${mostAffordable.fees.toLocaleString("en-IN")} per year. Choose based on your priority between career outcomes and affordability.`,
  };
};

module.exports = { generateComparisonInsight };