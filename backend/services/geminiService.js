const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const generateCycleInsight = async (cycleData, prediction) => {
  try {
    const prompt = `
You are a supportive menstrual cycle wellness assistant.

Use the user's cycle information and the calculated prediction below to provide a short, clear, personalized wellness insight.

User cycle information:
- Cycle length: ${cycleData.cycleLength} days
- Flow: ${cycleData.flow}
- Symptoms: ${
      cycleData.symptoms && cycleData.symptoms.length > 0
        ? cycleData.symptoms.join(", ")
        : "None"
    }
- Pain level: ${cycleData.pain}/5

Calculated prediction:
- Next period: ${prediction.nextPeriod}
- Ovulation date: ${prediction.ovulationDate}
- Fertile window: ${
      prediction.fertileWindow?.start || "Not available"
    } to ${prediction.fertileWindow?.end || "Not available"}

Give:
1. A brief observation about the logged cycle.
2. One or two practical wellness suggestions.
3. A short note explaining that these are estimates and not medical advice.

Keep the response under 120 words.
Do not diagnose any medical condition.
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
    });

    return response.text;
  } catch (error) {
    console.error("Gemini cycle insight error:", error);
    throw error;
  }
};

module.exports = {
  generateCycleInsight,
};