import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

const OPEN_METEO = "https://api.open-meteo.com/v1/forecast";

export async function POST(req: NextRequest) {

const { lat , lon } = await req.json()

const res = await fetch(`${OPEN_METEO}?latitude=${lat}&longitude=${lon}&current_weather=true`)

if( !res.ok ) return NextResponse.json({ error: "Failed to fetch weather data" }, { status: 500 })

const  { current_weather } = await res.json()

const { temperature , weathercode } = current_weather

const prompt = ` You are a personal stylist. Current temperature : ${temperature}°C. Weather code : ${weathercode}. 
    In two short sentences, suggest fabrics, layers, and accessories someone should wear right now. Mention why.`.trim()

const ai = new GoogleGenAI({})

const chat = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
    config: {
        responseMimeType: "text/plain",
        thinkingConfig:{
            thinkingBudget:0
        }
    }
})

return NextResponse.json({ outfit: chat.text })
}