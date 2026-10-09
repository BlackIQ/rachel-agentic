# Libs
import json  # JSON
from ollama import chat, ChatResponse, Message as OllamaMessage  # Ollama

# Application
from core.settings import settings  # Core: Settings
from tools.weather import get_weather  # Tools: Weather
from tools.home import get_home_temperature  # Tools: Home temp
from tools.pico import get_pico_resources  # Tools: Pico resources
from tools.led import turn_led_on, turn_led_off  # Tools: LED control

TOOLS = [
    get_weather,
    get_home_temperature,
    get_pico_resources,
    turn_led_on,
    turn_led_off,
]

AVAILABLE_FUNCTIONS = {
    "get_weather": get_weather,
    "get_home_temperature": get_home_temperature,
    "get_pico_resources": get_pico_resources,
    "turn_led_on": turn_led_on,
    "turn_led_off": turn_led_off,
}


def run_agent(history: list[dict]) -> list[dict]:
    messages: list[OllamaMessage] = []

    for msg in history:
        if msg["role"] == "tool":
            messages.append(
                OllamaMessage(
                    role="tool",
                    content=msg["content"],
                    tool_name=msg.get("tool_name"),
                )
            )
        else:
            messages.append(
                OllamaMessage(
                    role=msg["role"],
                    content=msg["content"],
                )
            )

    new_messages: list[dict] = []

    response: ChatResponse = chat(
        model=settings.MODEL,
        messages=messages,
        tools=TOOLS,
    )

    assistant_msg = response.message
    messages.append(assistant_msg)

    new_messages.append(
        {
            "role": "assistant",
            "content": assistant_msg.content or "",
            "tool_name": None,
        }
    )

    if assistant_msg.tool_calls:
        for tc in assistant_msg.tool_calls:
            tool_name = tc.function.name
            arguments = tc.function.arguments or {}

            if tool_name in AVAILABLE_FUNCTIONS:
                result = AVAILABLE_FUNCTIONS[tool_name](**arguments)
            else:
                result = {
                    "success": False,
                    "error": "tool_not_found",
                    "message": f"Tool {tool_name} not found",
                }

            tool_content = json.dumps(result, ensure_ascii=False)

            messages.append(
                OllamaMessage(
                    role="tool",
                    tool_name=tool_name,
                    content=tool_content,
                )
            )

            new_messages.append(
                {
                    "role": "tool",
                    "content": tool_content,
                    "tool_name": tool_name,
                }
            )

        final_response: ChatResponse = chat(
            model=settings.MODEL,
            messages=messages,
            tools=TOOLS,
        )
        final_msg = final_response.message

        new_messages.append(
            {
                "role": "assistant",
                "content": final_msg.content or "",
                "tool_name": None,
            }
        )

    return new_messages
