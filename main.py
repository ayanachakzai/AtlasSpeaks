import os
import sys
import json
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

# Load .env file if present (keeps API key out of shell environment/code)
try:
    from dotenv import load_dotenv
    load_dotenv(os.path.join(os.path.dirname(__file__), ".env"))
except ImportError:
    pass  # python-dotenv not installed; rely on environment variable being set

if not os.getenv("GROQ_API_KEY"):
    raise RuntimeError(
        "GROQ_API_KEY is not set. "
        "Create a .env file in atlas_deploy/ with: GROQ_API_KEY=your_key_here"
    )

sys.path.insert(0, os.path.dirname(__file__))
from atlas_speaks import AtlasSpeaks

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

bot = AtlasSpeaks("Atlas")

class ChatRequest(BaseModel):
    message: str
    music_step: int = 0
    music_preferences: dict = {}
    in_music_mode: bool = False

class ChatResponse(BaseModel):
    reply: str
    music_step: int
    music_preferences: dict
    in_music_mode: bool

@app.post("/chat", response_model=ChatResponse)
def chat(req: ChatRequest):
    bot.music_step = req.music_step
    bot.music_preferences = req.music_preferences
    bot.in_music_mode = req.in_music_mode

    processed = bot.process_input(req.message)
    response = bot.generate_response(processed)

    return ChatResponse(
        reply=response,
        music_step=bot.music_step,
        music_preferences=bot.music_preferences,
        in_music_mode=bot.in_music_mode,
    )

@app.get("/health")
def health():
    return {"status": "ok"}

