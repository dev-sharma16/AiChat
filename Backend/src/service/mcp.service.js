const axios = require('axios');

class MCPTools {
    constructor(){
        this.tools = {
            'get_stock_price': this.getStockPrice.bind(this),
            'get_crypto_price': this.getCryptoPrice.bind(this),
            'get_weather': this.getWeather.bind(this),
            'get_current_time': this.getCurrentTime.bind(this)
        }
    }

    // tools
    getAvailableTools(){
        return [
            {
                name: 'get_stock_price',
                description: 'Get current stock price for a company',
                parameters: ['symbol']
            },
            {
                name: 'get_weather',
                description: 'Get current weather for a city',
                parameters: ['city']
            },
            {
                name: 'get_crypto_price',
                description: 'Get cryptocurrency price',
                parameters: ['symbol']
            },
            {
                name: 'get_current_time',
                description: 'Get current date and time',
                parameters: []
            }
        ]
    }

    // tool execution
    async executeTool(toolName, parameters = {}){
        if (!this.tools[toolName]) {
            throw new Error(`Tool '${toolName}' not found`);
        }

        try {
            return await this.tools[toolName](parameters);
        } catch (error) {
            console.error(`Error executing tool ${toolName}:`, error);
            return { error: error.message };
        }
    }

    // tools implementation
    async getStockPrice({ symbol }) {  // for stock price
        try {
            const apiKey = process.env.VANTAGE_API_KEY;
            const response = await axios.get(
                `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${symbol}&outputsize=compact&apikey=${apiKey}`
            );
        
            const data = response.data;
        
            if (!data || !data["Time Series (Daily)"]) {
                throw new Error("Invalid API response or symbol not found");
            }
        
            const timeSeries = data["Time Series (Daily)"];
            const dates = Object.keys(timeSeries).sort((a, b) => new Date(b) - new Date(a));
        
            const latestDate = dates[0];
            const previousDate = dates[1];
        
            const latestClose = parseFloat(timeSeries[latestDate]["4. close"]);
            const previousClose = parseFloat(timeSeries[previousDate]["4. close"]);
        
            const change = latestClose - previousClose;
            const changePercent = ((change / previousClose) * 100).toFixed(2);
        
            return {
                symbol: symbol.toUpperCase(),
                exchange: "BSE",
                price: latestClose.toFixed(2),
                change: change.toFixed(2),
                changePercent: `${changePercent}%`,
                currency: "INR",
                marketState: "CLOSED", // You can enhance this based on IST and market hours
                lastUpdated: new Date().toLocaleString("en-IN", {
                    timeZone: "Asia/Kolkata"
                })
            };
        } catch (error) {
            throw new Error(`Failed to fetch stock price for ${symbol}: ${error.message}`);
        }
    }

    async getCryptoPrice({ symbol, market = 'USD' }) { // for crypto price
        try {
            const apiKey = process.env.VANTAGE_API_KEY;
            const response = await axios.get(
                `https://www.alphavantage.co/query?function=DIGITAL_CURRENCY_DAILY&symbol=${symbol.toUpperCase()}&market=${market.toUpperCase()}&apikey=${apiKey}`
            );

            const data = response.data;

            if (!data["Time Series (Digital Currency Daily)"]) {
                throw new Error(`No data found for ${symbol} in market ${market}`);
            }

            const timeSeries = data["Time Series (Digital Currency Daily)"];
            const latestDate = Object.keys(timeSeries)[0];
            const latestData = timeSeries[latestDate];

            return {
                symbol: symbol.toUpperCase(),
                price: parseFloat(latestData["4. close"]),
                open: parseFloat(latestData["1. open"]),
                high: parseFloat(latestData["2. high"]),
                low: parseFloat(latestData["3. low"]),
                volume: parseFloat(latestData["5. volume"]),
                currency: market.toUpperCase(),
                lastUpdated: new Date(latestDate).toLocaleDateString()
            };

        } catch (error) {
            console.error(error);
            throw new Error(`Failed to get crypto price for ${symbol}`);
        }
    }

    async getWeather({ city }) { // for current weather
        try {
            const API_KEY = process.env.WEATHER_API_KEY;
            if (!API_KEY) {
                return { error: 'Weather API key not configured' };
            }

            const response = await axios.get(
                `http://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${city}`
            );

            const data = response.data;

            return {
                city: data.location.name,
                region: data.location.region,
                country: data.location.country,
                temperature: `${data.current.temp_c}°C`,
                condition: data.current.condition.text,
                icon: `https:${data.current.condition.icon}`,
                feelsLike: `${data.current.feelslike_c}°C`,
                humidity: `${data.current.humidity}%`,
                windSpeed: `${data.current.wind_kph} km/h`,
                windDirection: data.current.wind_dir,
                pressure: `${data.current.pressure_mb} mb`,
                uvIndex: data.current.uv,
                lastUpdated: data.current.last_updated
            };
        } catch (error) {
            console.error(error?.response?.data || error.message);
            throw new Error(`Failed to get weather for ${city}`);
        }
    }

    async getCurrentTime() { // fro current time
        const now = new Date();
        return {
            currentTime: now.toLocaleString(),
            timestamp: now.toISOString(),
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
        };
    }

    // Parse user message to detect tool usage
    parseUserMessage(message) {
        const toolRequests = [];
        const lowerMessage = message.toLowerCase();

        // Stock price detection
        const stockMatch = lowerMessage.match(/stock price.*?([a-z]{1,5})|([a-z]{1,5}).*?stock/i);
        if (stockMatch) {
            const symbol = stockMatch[1] || stockMatch[2];
            toolRequests.push({
                tool: 'get_stock_price',
                params: { symbol: symbol.toUpperCase() }
            });
        }

        // Crypto price detection
        const cryptoMatch = lowerMessage.match(/crypto.*?price.*?(\w+)|(\w+).*?crypto.*?price/i);
        if (cryptoMatch) {
            const symbol = cryptoMatch[1] || cryptoMatch[2];
            toolRequests.push({
                tool: 'get_crypto_price',
                params: { symbol: symbol.toLowerCase() }
            });
        }

        // Weather detection
        const weatherMatch = lowerMessage.match(/weather.*?in.*?(\w+)|weather.*?(\w+)/i);
        if (weatherMatch) {
            const city = weatherMatch[1] || weatherMatch[2];
            toolRequests.push({
                tool: 'get_weather',
                params: { city }
            });
        }

        // Time detection
        if (lowerMessage.includes('current time') || lowerMessage.includes('what time')) {
            toolRequests.push({
                tool: 'get_current_time',
                params: {}
            });
        }
        return toolRequests;
    }
}

module.exports = MCPTools;
