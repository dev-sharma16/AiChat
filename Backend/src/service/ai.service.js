const { GoogleGenerativeAI  } = require("@google/generative-ai")
const MCPTools = require('./mcp.service');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const mcpTools = new MCPTools();

async function generateResponse(chatHistory, userMessage) {
    try {
        // Check if user message requires tool usage
        const toolRequests = mcpTools.parseUserMessage(userMessage);
        let toolData = [];

        // Execute any required tools
        if (toolRequests.length > 0) {
            console.log('Executing tools:', toolRequests);
            
            for (const request of toolRequests) {
                try {
                    const result = await mcpTools.executeTool(request.tool, request.params);
                    toolData.push({
                        tool: request.tool,
                        result
                    });
                } catch (error) {
                    console.error('Tool execution error:', error);
                    toolData.push({
                        tool: request.tool,
                        error: error.message
                    });
                }
            }
        }

        // Enhance chat history with tool data if available
        let enhancedHistory = [...chatHistory];
        
        if (toolData.length > 0) {
            const toolContext = toolData.map(tool => 
                tool.error 
                    ? `${tool.tool} failed: ${tool.error}`
                    : `${tool.tool} result: ${JSON.stringify(tool.result, null, 2)}`
            ).join('\n\n');

            // Add tool context to the latest user message
            const lastUserIndex = enhancedHistory.length - 1;
            enhancedHistory[lastUserIndex] = {
                role: "user",
                parts: [{ 
                    text: `${userMessage}\n\nReal-time data context:\n${toolContext}`
                }]
            };
        }

        // Generate response with Gemini
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
        const result = await model.generateContent({
            contents: enhancedHistory,
        });
        
        const response = result.response;
        return {
            text: response.text(),
            toolsUsed: toolData
        };
    } catch (error) {
        console.error('Error in generateResponse:', error);
        throw error;
    }
    // const response = await ai.models.generateContent({
    //     model: "gemini-2.0-flash",
    //     contents: prompt
    // })

    // const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" })
    // const result = await model.generateContent({
    //     contents: chatHistory, 
    // });
    // const response = result.response;

    // return response.text()
}

module.exports = generateResponse;