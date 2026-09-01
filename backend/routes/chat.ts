import express from 'express';
import type { Request, Response } from 'express';
import OpenAI from 'openai';

const router = express.Router();

// Strict type assertion ensures we avoid 'any' when accessing environment variables.
// Pointing the official SDK to the DeepSeek base URL allows seamless provider swapping.
const deepseek = new OpenAI({ 
    baseURL: 'https://api.deepseek.com',
    apiKey: process.env.DEEPSEEK_API_KEY as string 
});

/* 
  feat: implement deepseek proxy route for product recommendations
  Proxying the AI request through the backend was chosen over direct client-side fetching 
  to strictly protect the external API key from public exposure, balancing security 
  optimization with readable, standard REST routing logic[cite: 3, 6].
*/
router.post('/recommend', async (req: Request, res: Response): Promise<void> => {
    try {
        const { query } = req.body as { query: string };
        
        const completion = await deepseek.chat.completions.create({
            messages: [
                { role: 'system', content: 'You are a helpful e-commerce product recommendation assistant.' },
                { role: 'user', content: query }
            ],
            model: 'deepseek-chat', // Updated to DeepSeek's model identifier
        });

        res.status(200).json({ reply: completion.choices[0]?.message?.content || "Sorry, I couldn't generate a recommendation right now." });
    } catch (error: unknown) {
        res.status(500).json({ error: "Failed to generate AI recommendation" });
    }
});

export default router;