# Libs
from ollama import chat, ChatResponse, Message  # Ollama

# Application
from core.settings import settings  # Core: Settings

model = settings.MODEL

messages: list[Message] = []


def get_temperature(city: str) -> str:
    """Get the current temperature for a city

    Args:
      city: The name of the city

    Returns:
      The current temperature for the city
    """

    temperatures = {
        "New York": "22°C",
        "London": "15°C",
        "Tokyo": "18°C",
    }

    return temperatures.get(city, "Unknown")


def get_conditions(city: str) -> str:
    """Get the current weather conditions for a city

    Args:
      city: The name of the city

    Returns:
      The current weather conditions for the city
    """

    conditions = {
        "New York": "Partly cloudy",
        "London": "Rainy",
        "Tokyo": "Sunny",
    }

    return conditions.get(city, "Unknown")


tools = [
    get_temperature,
    get_conditions,
]

available_functions = {
    "get_temperature": get_temperature,
    "get_conditions": get_conditions,
}

print(f"Rachel ({model}) is ready. 'exit' to stop.\n")

while True:
    user_input = input(">>> ").strip()

    if user_input.lower() in {"exit"}:
        break

    messages.append(
        Message(
            role="user",
            content=user_input,
        ),
    )

    response: ChatResponse = chat(
        model=model,
        messages=messages,
        tools=tools,
        think=True,
    )

    messages.append(response.message)

    if response.message.tool_calls:
        for tc in response.message.tool_calls:
            if tc.function.name in available_functions:
                result = available_functions[tc.function.name](**tc.function.arguments)

                messages.append(
                    Message(
                        role="tool",
                        tool_name=tc.function.name,
                        content=str(result),
                    )
                )
            else:
                messages.append(
                    Message(
                        role="tool",
                        content=f"Tool {tc.function.name} not found",
                        tool_name=tc.function.name,
                    ),
                )

                print(f"Tool {tc.function.name} not found")

        final_response = chat(
            model=model,
            messages=messages,
            tools=tools,
            think=True,
        )

        messages.append(final_response.message)

        print(final_response.message.content)
    else:
        print(response.message.content)
