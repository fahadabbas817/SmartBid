import asyncHandler from 'express-async-handler'
import Groq from 'groq-sdk'
import google from 'googlethis'
import axios from 'axios'
import * as cheerio from 'cheerio'
const getGroqClient = () => {
  return new Groq({ apiKey: process.env.GROQ_API_KEY });
}

// Helper to fetch live context using DuckDuckGo HTML
const fetchWebContext = async (query) => {
  try {
    const { data } = await axios.get(`https://html.duckduckgo.com/html/?q=${encodeURIComponent(query)}`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });
    const $ = cheerio.load(data);
    
    // Extract snippets from DuckDuckGo HTML
    let contextData = '';
    $('.result__snippet').slice(0, 5).each((i, el) => {
      contextData += `- ${$(el).text().trim()}\n`;
    });
    
    return contextData;
  } catch (err) {
    console.error('Error fetching web context:', err.message);
    return ''; // Return empty string if web search fails
  }
}

// @desc    Suggest listing price based on AI
// @route   POST /api/ai/suggest-price
// @access  Private/Seller
const suggestPrice = asyncHandler(async (req, res) => {
  const { title, description, category } = req.body

  if (!title) {
    res.status(400)
    throw new Error('Title and category are required for price suggestion')
  }

  if (!process.env.GROQ_API_KEY) {
    res.status(500)
    throw new Error('GROQ_API_KEY is missing from environment variables.')
  }

  const groq = getGroqClient()

  const webContext = await fetchWebContext(`${title} price specifications`);

  const prompt = `You are a professional auction appraiser. Given a product title, category, description, and live market data, output a JSON object with strictly these numerical keys: "suggestedStartingPrice", "estimatedFinalPrice", "suggestedReservePrice", and "suggestedMinimumIncrement". Do not include text or symbols outside the JSON.
Title: ${title}
Category: ${category || "Unknown"}
Description: ${description || "None"}

Live Market Data (Use this for accurate current pricing):
${webContext ? webContext : 'No live data available, use your best estimation.'}

CRITICAL: ONLY use the provided live market data to determine pricing. Always evaluate and generate the numerical prices in strictly USD (e.g., if market data shows $400, output 400). If the market data is in another currency, convert it to USD before outputting.`

  try {
    const chatCompletion = await groq.chat.completions.create({
      messages: [{ role: 'system', content: prompt }],
      model: 'llama-3.1-8b-instant',
      temperature: 0.2,
      response_format: { type: 'json_object' }
    })

    const result = JSON.parse(chatCompletion.choices[0]?.message?.content || '{}')

    const suggestedStartingPrice = Number(result.suggestedStartingPrice) || 10
    const estimatedFinalPrice = Number(result.estimatedFinalPrice) || 20
    const suggestedReservePrice = Number(result.suggestedReservePrice) || 15
    const suggestedMinimumIncrement = Number(result.suggestedMinimumIncrement) || 5

    res.json({
      suggestedStartingPrice,
      estimatedFinalPrice,
      suggestedReservePrice,
      suggestedMinimumIncrement,
    })
  } catch (error) {
    res.status(500)
    throw new Error('Failed to generate AI pricing: ' + error.message)
  }
})

// @desc    Generate product description
// @route   POST /api/ai/generate-description
// @access  Private/Seller
const generateDescription = asyncHandler(async (req, res) => {
  const { keywords } = req.body // Img data removed due to text-only model constraints

  if (!keywords) {
    res.status(400)
    throw new Error('Keywords required for generation')
  }

  if (!process.env.GROQ_API_KEY) {
    res.status(500)
    throw new Error('GROQ_API_KEY is missing from environment variables.')
  }

  const groq = getGroqClient()

  const webContext = await fetchWebContext(`${keywords} features specs`);

  const prompt = `You are a world-class copywriter for an auction site. Given these notes and live market data, create a short catchy title, an SEO-friendly engaging item description, and a short marketing copy snippet. Output strictly in JSON format with keys: "generatedTitle", "generatedDescription", and "marketingCopy". Do not return any other text.
Notes: "${keywords}"

Live Market Data (Use this for accurate features and specs):
${webContext ? webContext : 'No live data available.'}
  
For the "generatedDescription":
- Use 2-3 short paragraphs.
- Use explicit bullet points (using the • symbol) to highlight key features or specs.
- Strictly use exact newline characters (\\n) for spacing between paragraphs and bullets.
- CRITICAL: Do NOT hallucinate features. ONLY use specifications mentioned in the Live Market Data or the Notes. If hardware specs are unavailable in the data, do not invent them.`

  try {
    const chatCompletion = await groq.chat.completions.create({
      messages: [{ role: 'system', content: prompt }],
      model: 'llama-3.1-8b-instant',
      temperature: 0.7,
      response_format: { type: 'json_object' }
    })

    const result = JSON.parse(chatCompletion.choices[0]?.message?.content || '{}')

    res.json({
      generatedTitle: result.generatedTitle || 'Premium Item',
      generatedDescription: result.generatedDescription || keywords,
      marketingCopy: result.marketingCopy || 'Bid now!',
    })
  } catch (error) {
    res.status(500)
    throw new Error('Failed to generate AI description: ' + error.message)
  }
})

// @desc    Fetch product images from the web
// @route   POST /api/ai/fetch-images
// @access  Private/Seller
const fetchImages = asyncHandler(async (req, res) => {
  const { title } = req.body;

  if (!title) {
    res.status(400);
    throw new Error('Title is required to fetch images');
  }

  try {
    const images = await google.image(title, { safe: false });
    // Filter and map to get just the URLs, limiting to top 8
    const imageUrls = images.slice(0, 8).map(img => img.url);
    res.json({ images: imageUrls });
  } catch (error) {
    console.error('Error fetching images:', error);
    res.status(500);
    throw new Error('Failed to fetch images: ' + error.message);
  }
});

export { suggestPrice, generateDescription, fetchImages }
