# Agentic Rachel

A personal AI assistant created with **Ollama** and **Qwen3**.

Rachel can talk to your home hardware (Raspberry Pi Pico) and external services if added.

## Features

- Natural language conversation with tool calling
- Home temperature & humidity from RPI Pico (DHT11 sensor)
- Pico system resources (memory only)
- Control LEDs on the Pico (For now only)
  - White
  - Blue
  - Red
  - Green
- Current weather for any city (Using WeatherAPI)
  - Gen an API key from it

## Example

```
Rachel (rachel-1.2:3b) is ready. 'exit' to stop.

>>> Hi, who are you?

Hello! I'm Rachel, your personal AI assistant. How can I help you today?

>>> Who is created you?

I was created by Amirhossein Mohammadi. How can I assist you further?

>>> Turn these LEDs on: blue, red.

The blue and red LEDs are now on. Is there anything else you need help with?

>>> Yes, turn them off.

The blue and red LEDs are now off. Is there anything else you need help with?

>>> Also tell me 2 things. Weather in Tehran and current temp of home.

I encountered an issue fetching the weather for Tehran. It seems there was a problem connecting to the WeatherAPI. The current temperature in your home is 28°C and the humidity is at 7%.

Is there anything else I can assist you with?

>>> Have a good night Rachel.

Good night! Don't hesitate to ask if you need help during the day. Have a great night!
```

## Architecture

```
User > Ollama (rachel-1.1:4b) > Tool Calling (Chatting) > Python Tools > Raspberry Pi Pico / WeatherAPI
```

- **Agent side**: Python + Ollama (tool calling)
- **Device side**: MicroPython + Microdot running on Raspberry Pi Pico

## Hardware

- Raspberry Pi Pico W (for wireless)
- DHT11 temperature & humidity sensor
- 4 LEDs (white, green, red, blue)
- I2C LCD 16x2 (to see IP and welcome)

## Setup

Make sure you have **Ollama** installed.

> You can set an variable in your shell to don't put your device under heavy pressure:
>
> Just: `export OLLAMA_NUM_PARALLEL=1`

### 1. Agent (Python side)

```bash
git clone https://github.com/BlackIQ/rachel-agentic.git
cd rachel-agentic
uv sync
```

Copy `.env.example` to `.env` and fill:

```env
WEATHER_APIKEY=your_weatherapi_key
PICO_IP=http://192.168.1.50
```

> `PICO_IP` must include the protocol (`http://`).

Create the model (recommended):

```bash
ollama create rachel-1.1:4b -f Modelfile
```

Run:

```bash
uv run main.py
```

### 2. Pico side

1. Flash MicroPython on the Pico
2. Copy the contents of `micropython/` to the Pico (everything)
3. Set your WiFi credentials in `main.py` (SSID & PASSWORD)
4. Reset the Pico. Then it will show its IP on the LCD

## Available Tools

| Tool                           | Description                                    |
| ------------------------------ | ---------------------------------------------- |
| `get_home_temperature`         | Temperature + Humidity from DHT11              |
| `get_pico_resources`           | Free & allocated memory of the Pico            |
| `turn_led_on` / `turn_led_off` | Control LEDs (`white`, `green`, `red`, `blue`) |
| `get_weather`                  | Current weather for any city                   |

## Notes

- This is a personal experimental project to bring back the spirit of the old Rachel assistant.
- FastAPI is included in dependencies for future API mode.
- The Pico firmware uses Microdot (a lightweight Flask-like framework for MicroPython).

---

Made with ❤️ by Amirhossein Mohammadi
