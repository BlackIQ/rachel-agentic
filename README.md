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

## Example

```
>>> What's the temperature at home?
Your home is currently **28°C** with **42%** humidity.

>>> Turn on the green LED
Done! The green LED is now on.

>>> How's the weather in Tehran?
Tehran is currently **overcast** at **27.8°C** with 22% humidity.
```

## Notes

- This is a personal experimental project to bring back the spirit of the old Rachel assistant.
- FastAPI is included in dependencies for future API mode.
- The Pico firmware uses Microdot (a lightweight Flask-like framework for MicroPython).

---

Made with ❤️ by Amirhossein Mohammadi
