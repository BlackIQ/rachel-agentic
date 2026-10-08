# Libs
import json  # Json
from ollama import chat, ChatResponse, Message  # Ollama

# Application
from core.settings import settings  # Core: Settings
from tools.weather import get_weather  # Utils: Teperature
from tools.home import get_home_temperature  # Utils: Home
from tools.pico import get_pico_resources  # Utils: Pico
from tools.led import turn_led_on, turn_led_off  # Utils: LED

model = settings.MODEL

messages: list[Message] = []

tools = [
    get_weather,
    get_home_temperature,
    get_pico_resources,
    turn_led_on,
    turn_led_off,
]

available_functions = {
    "get_weather": get_weather,
    "get_home_temperature": get_home_temperature,
    "get_pico_resources": get_pico_resources,
    "turn_led_on": turn_led_on,
    "turn_led_off": turn_led_off,
}

print(f"Rachel ({model}) is ready. 'exit' to stop.\n")

while True:
    user_input = input(">>> ").strip()

    if user_input.lower() in {"exit"}:
        break

    print("")

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
                        content=json.dumps(result),
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
