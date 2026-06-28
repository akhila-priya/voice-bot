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

    # Save user's message
    add_message("user", question)

    # Build conversation
    messages = [
        {
            "role": "system",
            "content": PROFILE
        }
    ]

    # Add previous conversation
    messages.extend(get_history())

    # Ask Groq
    response = client.chat.completions.create(
        model="llama-3.1-8b-instant",
        messages=messages,
        temperature=0.5,
        max_tokens=400
    )

    answer = response.choices[0].message.content

    # Save AI answer
    add_message("assistant", answer)

    return answer