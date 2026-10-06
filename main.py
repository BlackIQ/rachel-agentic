import ollama

from tools import create_text_file

TOOLS = {
    "create_text_file": create_text_file,
}


messages = [
    {
        "role": "system",
        "content": """
You are an agent.

You have access to tools.

When the user asks you to create a text file,
use the create_text_file tool.

Do not pretend that you created a file.
Actually call the tool.
""",
    }
]


while True:
    user_input = input("\nWhat the fuck can I do for you? ")

    if user_input.lower() in {"exit", "quit"}:
        break

    messages.append(
        {
            "role": "user",
            "content": user_input,
        }
    )

    response = ollama.chat(
        model="llama3.2:3b",
        messages=messages,
        tools=[
            {
                "type": "function",
                "function": {
                    "name": "create_text_file",
                    "description": "Create a text file.",
                    "parameters": {
                        "type": "object",
                        "properties": {
                            "filename": {
                                "type": "string",
                                "description": "Name of the file",
                            },
                            "content": {
                                "type": "string",
                                "description": "Content of the file",
                            },
                        },
                        "required": ["filename", "content"],
                    },
                },
            }
        ],
    )

    print(response["message"]["content"])
