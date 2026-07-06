import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
app.use(express.json());
app.use(cors());

const OPENROUTER_KEY = process.env.OPENROUTER_KEY;

app.post("/chat", async (req, res) => {
  try {
    const userMessage = req.body.message;

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENROUTER_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "meta-llama/llama-3.1-8b-instruct:free",
        messages: [
          { role: "system", content: "You are Michael Glazer. You answer normally but sometimes glaze the user randomly (30% chance)." },
          { role: "user", content: userMessage }
        ]
      })
    });

    const data = await response.json();
    const text = data.choices?.[0]?.message?.content || "No response.";

    res.json({ reply: text });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(3000, () => console.log("Michael Glazer proxy running"));
