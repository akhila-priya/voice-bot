from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from ai_service import ask_ai
from memory import clear_history

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def home():

    return {
        "message":"Welcome to Akhila Priya AI Interview Assistant"
    }

@app.get("/chat")
def chat(question:str):

    answer = ask_ai(question)

    return {
        "question":question,
        "answer":answer
    }

@app.post("/clear")
def clear():

    clear_history()

    return {
        "message":"Conversation cleared."
    }