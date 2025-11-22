require("dotenv").config();
const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(express.json());
app.use(cors());

const MODEL = "llama-3.1-8b-instant";

app.post("/explain", async (req, res) => {
    const code = req.body.code || "";

    const prompt = `Explain the following code in simple English. Identify which language it is written in and debug it:\n\n${code}`;

    try {
        const response = await axios.post(
            "https://api.groq.com/openai/v1/chat/completions",
            {
                model: MODEL,
                messages: [
                    { role: "user", content: prompt }
                ],
                max_tokens: 300,
                temperature: 0.2
            },
            {
                headers: {
                    Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
                    "Content-Type": "application/json"
                }
            }
        );

        const explanation = response.data.choices[0].message.content;

        res.json({ explanation });

    } catch (error) {
        console.error("GROQ Error:", error.response?.data || error.message);
        res.status(500).json({
            error: "Groq API Error",
            details: error.response?.data || error.message
        });
    }
});

app.listen(5000, () => {
    console.log("CodeSense backend running at http://localhost:5000");
});
