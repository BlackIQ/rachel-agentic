# Rachel Firmware

**MicroPython firmware** for **Raspberry Pi Pico 2 W**. Wi‑Fi, DHT11, LEDs, I2C LCD, and a small HTTP API with **Microdot**.

The FastAPI backend calls this device for temperature/humidity, LED control, and memory stats and other stuff.

## Techs

- **Python**: Programming language
- **MicroPython**: Runtime
- **Raspberry Pi Pico 2 W**: Hardware
- **Microdot**: Flask like for MicroPython

## Hardware parts

| Part                        | Notes                                               |
| --------------------------- | --------------------------------------------------- |
| Raspberry Pi Pico 2 W       | Hardware having Wi-Fi thanks to Raspberry Pi        |
| DHT11                       | Temperature and humidity sensor                     |
| LEDs                        | White, green, red, blue                             |
| Liquid crystal 16×2 I2C LCD | Just to see some stuff in LCD like IP and RAM usage |

## Files

Let's take a look what is inside it:

- `main.py`: App entry
- `net_cerds.py`: Wi-Fi SSID & PASSWD
- `microdot.py`: Bundled Microdot server
- `lcd_api.py`: LCD helpers
- `machine_i2c_lcd.py`: I2C LCD Driver

## Setup

1. Flash **MicroPython** for Pico 2 W.
2. Edit `net_cerds.py`:

```python
SSID = "wifi-name"
PASSWORD = "wifi-password"
```

3. Copy all files in this folder to the Pico with Thonny.
4. Run `main.py` (or set it as `main.py` so it starts on boot).
5. Read the IP from the LCD

## API endpoints

Base URL: `http://<pico-ip>/`

| Method | Path                   | Description                           |
| ------ | ---------------------- | ------------------------------------- |
| GET    | `/`                    | Welcome JSON                          |
| GET    | `/api/temperature`     | Get `temperature` and `humidity`      |
| POST   | `/api/leds/<name>/on`  | Turn LED on. Pass `name` as LED name  |
| POST   | `/api/leds/<name>/off` | Turn LED off. Pass `name` as LED name |
| GET    | `/api/system/memory`   | Get `free` and `allocated`            |

## Runtime

- Connects to network; Onboard LED blinks until connected, then stays on.
- Background task samples DHT11 about every **2 seconds**.
- LCD cycles status screens (ready, credit, IP, RAM).
- HTTP server listens on **port 80**.
