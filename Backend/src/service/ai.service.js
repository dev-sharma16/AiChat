const { GoogleGenerativeAI  } = require("@google/generative-ai")

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function generateResponse(chatHistory) {
    // const response = await ai.models.generateContent({
    //     model: "gemini-2.0-flash",
    //     contents: prompt
    // })
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" })
    const result = await model.generateContent({
        contents: chatHistory, 
    });
    const response = result.response;

    return response.text()
}

module.exports = generateResponse;