from machine import Pin, I2C
import asyncio
from picozero import pico_led
import network
import gc

import dht

from microdot import Microdot
from microdot.auth import TokenAuth

from lcd.machine_i2c_lcd import I2cLcd
from urtc.urtc import DS3231

import config

__version__ = "0.1.0"

i2c = I2C(sda=Pin(0), scl=Pin(1), freq=400000)

lcd = I2cLcd(i2c, 0x27, 2, 16)
rtc = DS3231(i2c)

lcd.display_on()
lcd.backlight_on()

sensor_dht = dht.DHT11(Pin(26))

dht_temperature = None
dht_humidity = None

ip = None
network_connected = False

LEDS = {
    "white": Pin(16, Pin.OUT),
    "green": Pin(17, Pin.OUT),
    "red": Pin(18, Pin.OUT),
    "blue": Pin(19, Pin.OUT),
}


async def status_led_loop():
    while True:
        if network_connected:
            pico_led.on()
            await asyncio.sleep(2)
        else:
            pico_led.toggle()
            await asyncio.sleep(0.4)


async def network_loop():
    global ip, network_connected

    wlan = network.WLAN(network.STA_IF)
    retry_delay = 1

    if not wlan.active():
        wlan.active(True)

    while True:
        if wlan.isconnected():
            network_connected = True
            ip = wlan.ifconfig()[0]

            retry_delay = 1

            await asyncio.sleep(5)
            continue

        network_connected = False
        ip = None

        try:
            if not wlan.active():
                wlan.active(True)

            try:
                wlan.disconnect()
            except OSError:
                pass

            await asyncio.sleep(0.2)

            wlan.connect(config.SSID, config.PASSWORD)

            for _ in range(20):
                if wlan.isconnected():
                    break

                await asyncio.sleep(0.5)

            if wlan.isconnected():
                network_connected = True
                ip = wlan.ifconfig()[0]

                retry_delay = 1

                continue

        except OSError:
            pass

        await asyncio.sleep(retry_delay)

        retry_delay = min(retry_delay * 2, 30)


app = Microdot()
auth = TokenAuth()


@auth.authenticate
async def verify_token(request, token):
    if token == config.TOKEN:
        return "rachel"

    return None


@app.get("/")
def home(request):
    return {"message": "Welcome to Rachel Pico!"}


@app.get("/api/temperature")
@auth
def home_sensor(request):
    return {
        "temperature": dht_temperature,
        "humidity": dht_humidity,
    }


@app.post("/api/leds/<name>/on")
@auth
def led_on(request, name):
    led = LEDS.get(name)

    if led is None:
        return {"message": "Unknown led"}, 404

    led.on()

    return {"message": f"{name} is now on"}


@app.post("/api/leds/<name>/off")
@auth
def led_off(request, name):
    led = LEDS.get(name)

    if led is None:
        return {"message": "Unknown led"}, 404

    led.off()

    return {"message": f"{name} is now off"}


@app.get("/api/system/memory")
@auth
def memory(request):
    gc.collect()

    return {
        "free": gc.mem_free(),
        "allocated": gc.mem_alloc(),
    }


@app.errorhandler(404)
def not_found(request):
    return {"message": "Not found"}, 404


@auth.errorhandler
async def auth_error(request):
    return {"message": "Unauthorized"}, 401


async def display_loop():
    while True:
        lcd.clear()

        lcd.move_to(0, 0)
        lcd.putstr("Rachel Agent!")
        lcd.move_to(0, 1)
        lcd.putstr(f"Version: {__version__}")

        await asyncio.sleep(5)

        lcd.clear()

        lcd.move_to(0, 0)
        lcd.putstr("Created by")
        lcd.move_to(0, 1)
        lcd.putstr("Dr. Amirhossein")

        await asyncio.sleep(5)

        lcd.clear()

        lcd.move_to(0, 0)
        lcd.putstr("System info:")
        lcd.move_to(0, 1)
        lcd.putstr("Online" if network_connected else "Offline")

        await asyncio.sleep(5)

        lcd.clear()

        lcd.move_to(0, 0)
        lcd.putstr("Network info:")
        lcd.move_to(0, 1)
        lcd.putstr((ip or "Connecting..."))

        await asyncio.sleep(5)

        lcd.clear()

        lcd.move_to(0, 0)
        lcd.putstr(f"Free RAM: {gc.mem_free() // 1024} KB")
        lcd.move_to(0, 1)
        lcd.putstr(f"Used RAM: {gc.mem_alloc() // 1024} KB")

        await asyncio.sleep(5)


async def update_temp():
    global dht_temperature, dht_humidity

    while True:
        try:
            sensor_dht.measure()

            dht_temperature = sensor_dht.temperature()
            dht_humidity = sensor_dht.humidity()
        except OSError:
            pass

        await asyncio.sleep(2)


async def main():
    asyncio.create_task(network_loop())
    asyncio.create_task(status_led_loop())
    asyncio.create_task(display_loop())
    asyncio.create_task(update_temp())

    await app.start_server(port=80)


asyncio.run(main())
