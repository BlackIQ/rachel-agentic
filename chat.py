# Libs
from ollama import chat, ChatResponse, Message

model = "llama3.2:3b"

messages: list[Message] = []

while True:
    user_input = input(f"User: ")

    if user_input.lower() in {"exit", "quit"}:
        break

    messages.append(
        Message(
            role="user",
            content=user_input,
        )
    )

    response: ChatResponse = chat(
        model=model,
        messages=messages,
    )

    messages.append(response.message)

    print(f"Model: {response.message.content}")
