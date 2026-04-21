import asyncHandler from 'express-async-handler'
import Groq from 'groq-sdk'

const getGroqClient = () => {
  return new Groq({ apiKey: process.env.GROQ_API_KEY });
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

  const prompt = `You are a professional auction appraiser. Given a product title, category, and description, output a JSON object with strictly these numerical keys: "suggestedStartingPrice", "estimatedFinalPrice", "suggestedReservePrice", and "suggestedMinimumIncrement". Do not include text or symbols outside the JSON.
Title: ${title}
Category: ${category || "Unknown"}
Description: ${description || "None"}`

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

  const prompt = `You are a world-class copywriter for an auction site. Given these notes: "${keywords}", create a short catchy title, an SEO-friendly engaging item description, and a short marketing copy snippet. Output strictly in JSON format with keys: "generatedTitle", "generatedDescription", and "marketingCopy". Do not return any other text.
  
For the "generatedDescription":
- Use 2-3 short paragraphs.
- Use explicit bullet points (using the • symbol) to highlight key features or specs.
- Strictly use exact newline characters (\\n) for spacing between paragraphs and bullets.`

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

export { suggestPrice, generateDescription }
