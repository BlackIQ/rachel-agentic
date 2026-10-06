import json

import ollama

from tools import create_text_file

model = "llama3.2:3b"

tools = [
    {
        "type": "function",
        "function": {
            "name": "create_text_file",
            "description": "Create a text file with the given filename and content.",
            "parameters": {
                "type": "object",
                "properties": {
                    "filename": {
                        "type": "string",
                        "description": "The filename, for example help.txt",
                    },
                    "content": {
                        "type": "string",
                        "description": "The content that should be written into the file.",
                    },
                },
                "required": ["filename", "content"],
            },
        },
    }
]


available_tools = {
    "create_text_file": create_text_file,
}


messages = [
    {
        "role": "system",
        "content": """
You are an agent.

You have access to tools.

When the user asks you to create a text file,
you MUST use the create_text_file tool.

Do not say that you created a file unless the tool
was actually executed successfully.
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
