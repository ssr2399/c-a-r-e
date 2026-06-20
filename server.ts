import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import helmet from "helmet";
import { z } from "zod";

dotenv.config();

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      "User-Agent": "aistudio-build",
    },
  },
});

const ChatRequestSchema = z.object({
  message: z.string().min(1).max(500),
  settings: z.object({
    accessibilityMode: z.boolean().optional(),
    neurodivergentMode: z.boolean().optional(),
    simplifiedMode: z.boolean().optional(),
  }).optional()
});

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Security Middleware
  app.use(helmet({
    contentSecurityPolicy: false, // Disabled for dev, configure properly in prod
  }));
  app.use(express.json({ limit: "10kb" })); // Prevent large payloads

  // API Routes
  app.post("/api/chat", async (req, res) => {
    try {
      const parsedData = ChatRequestSchema.parse(req.body);
      const { message, settings } = parsedData;
      
      const systemInstruction = `You are Eco Coach AI, a helpful, encouraging sustainability assistant for the C.A.R.E. app.
Keep answers brief, highly actionable, plain-language, and encouraging.
If asked about public transport vs ride-sharing, calculate generic carbon savings.
User Settings:
Accessibility Mode: ${settings?.accessibilityMode ? 'Enabled' : 'Disabled'}
Neurodivergent Mode: ${settings?.neurodivergentMode ? 'Enabled (use minimal lists, clear simple formatting)' : 'Disabled'}
`;

      const chat = ai.chats.create({
        model: "gemini-3.5-flash",
        config: { systemInstruction }
      });
      
      const response = await chat.sendMessage({ message });
      res.json({ text: response.text });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: "Invalid request data", details: error.errors });
      } else {
        console.error("Gemini Error:", error);
        res.status(500).json({ error: "Failed to communicate with Eco Coach AI." });
      }
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
