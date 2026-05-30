
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import requests
import os
import json

# Load .env file
load_dotenv()

# OpenRouter API Key
OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")

app = FastAPI()

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
def call_ai(messages):

    response = requests.post(
        "https://openrouter.ai/api/v1/chat/completions",
        headers={
            "Authorization": f"Bearer {OPENROUTER_API_KEY}",
            "Content-Type": "application/json",
        },
        json={
            "model": "openai/gpt-3.5-turbo",
            "messages": messages
        },
        timeout=60
    )

    result = response.json()

    if "choices" not in result:
        raise Exception(str(result))

    return result["choices"][0]["message"]["content"]

# ----------------------------------
# AI CHAT
# ----------------------------------

@app.post("/chat")
async def chat(data: dict):

    question = data.get("question", "")

    try:
        response = requests.post(
            "https://openrouter.ai/api/v1/chat/completions",
            headers={
                "Authorization": f"Bearer {OPENROUTER_API_KEY}",
                "Content-Type": "application/json",
            },
            json={
                "model": "openai/gpt-3.5-turbo",
                "messages": [
                    {
                        "role": "system",
                        "content": "You are BodyIQ AI, an intelligent futuristic health assistant."
                    },
                    {
                        "role": "user",
                        "content": question
                    }
                ]
            },
            timeout=60
        )

        result = response.json()

        print("CHAT STATUS:", response.status_code)
        print("CHAT RESULT:", result)

        if "choices" not in result:
            return {
                "response": f"OpenRouter Error: {result}"
            }

        return {
            "response": result["choices"][0]["message"]["content"]
        }

    except Exception as e:
        print("CHAT ERROR:", e)

        return {
            "response": f"Server Error: {str(e)}"
        }


# ----------------------------------
# AI FITNESS PLAN
# ----------------------------------

@app.post("/generate-plan")
async def generate_plan(data: dict):

    age = data.get("age")
    weight = data.get("weight")
    height = data.get("height")
    protein = data.get("protein")

    prompt = f"""
Create a personalized fitness plan.

Age: {age}
Weight: {weight}
Height: {height}
Protein: {protein}

Return ONLY valid JSON.

Example:

{{
  "workout":"...",
  "diet":"...",
  "sleep":"..."
}}

No markdown.
No explanation.
Only JSON.
"""

    try:

        answer = call_ai([
            {
                "role": "user",
                "content": prompt
            }
        ])

        print(answer)

        plan = json.loads(answer)

        return {
            "workout": plan["workout"],
            "diet": plan["diet"],
            "sleep": plan["sleep"]
        }

    except Exception as e:

        print(e)

        return {
            "workout": f"AI Error: {str(e)}",
            "diet": f"AI Error: {str(e)}",
            "sleep": f"AI Error: {str(e)}"
        }


# ----------------------------------
# HEALTH ANALYSIS
# ----------------------------------

@app.post("/analyze")
async def analyze(data: dict):

    height = float(data["height"])
    weight = float(data["weight"])
    protein = float(data["protein"])

    bmi = round(weight / ((height / 100) ** 2), 1)

    if bmi < 18.5:
        status = "Underweight"
    elif bmi <= 24.9:
        status = "Normal"
    else:
        status = "Overweight"

    score = 100

    if protein < 14:
        score -= 20

    recommendations = [
        "Increase protein intake using paneer, eggs, soy chunks and dal.",
        "Drink 2-3 liters of water daily.",
        "Exercise regularly.",
    ]

    return {
        "score": score,
        "bmi": bmi,
        "bmiStatus": status,
        "recommendations": recommendations
    }


# ----------------------------------
# ROOT
# ----------------------------------

@app.get("/")
async def root():
    return {
        "message": "BodyIQ AI Backend Running 🚀"
    }

