from openai import OpenAI
from dotenv import load_dotenv
from pathlib import Path
import os

from profile import PROFILE
from memory import add_message, get_history

# Load environment variables
env_path = Path(__file__).parent / ".env"
load_dotenv(dotenv_path=env_path)

client = OpenAI(
    api_key=os.getenv("GROQ_API_KEY"),
    base_url="https://api.groq.com/openai/v1"
)

def ask_ai(question: str):

    # Save user's question
    add_message("user", question)

    # Keep only the last 4 messages to reduce token usage
    history = get_history()[-4:]

    # Build conversation
    messages = [
        {
            "role": "system",
            "content": PROFILE
        }
    ]

    # Add recent conversation only
    messages.extend(history)

    try:
        response = client.chat.completions.create(
            model="llama-3.1-8b-instant",
            messages=messages,
            temperature=0.5,
            max_tokens=400
        )

        answer = response.choices[0].message.content

    except Exception:
        answer = (
            "Sorry, I'm unable to answer right now. "
            "Please try asking again."
        )

    # Save AI response
    add_message("assistant", answer)

    return answer