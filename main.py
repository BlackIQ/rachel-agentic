# Libs
import json  # Json
import ollama  # Ollama

# Application
from core.settings import settings  # Core: Settings
from utils.write_file import write_file  # Utils: Write File
from utils.read_file import read_file  # Utils: Read File

model = settings.MODEL

tools = [
    {
        "type": "function",
        "function": {
            "name": "write_file",
            "description": "Create a file with the given filename and content.",
            "parameters": {
                "type": "object",
                "properties": {
                    "filename": {
                        "type": "string",
                        "description": "The filename, for example file.txt",
                    },
                    "content": {
                        "type": "string",
                        "description": "The content that should be written into the file.",
                    },
                },
                "required": ["filename", "content"],
            },
        },
    },
    {
        "type": "function",
        "function": {
            "name": "read_file",
            "description": "Read the content of an existing file.",
            "parameters": {
                "type": "object",
                "properties": {
                    "filename": {
                        "type": "string",
                        "description": "The filename to read, for example file.txt",
                    },
                },
                "required": ["filename"],
            },
        },
    },
]

available_tools = {
    "write_file": write_file,
    "read_file": read_file,
}


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
        model=model,
        messages=messages,
        tools=tools,
    )

    message = response["message"]

    messages.append(message)

    if message.get("tool_calls"):
        for tool_call in message["tool_calls"]:
            function_name = tool_call["function"]["name"]
            arguments = tool_call["function"]["arguments"]

            print(f"\n[Agent wants to call: {function_name}]")
            print(f"[Arguments: {arguments}]")

            function = available_tools.get(function_name)

            if function is None:
                print(f"Unknown tool: {function_name}")
                continue

            result = function(**arguments)

            print(f"[Tool result: {result}]")

            messages.append(
                {
                    "role": "tool",
                    "content": json.dumps(result),
                }
            )

        response = ollama.chat(
            model=model,
            messages=messages,
            tools=tools,
        )

        messages.append(response["message"])

        print(response["message"]["content"])

    else:
        print(message["content"])
