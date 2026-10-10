from machine import Pin, I2C
import asyncio
from picozero import pico_led
import network
import gc

from microdot import Microdot

import dht

from machine_i2c_lcd import I2cLcd
import config

i2c = I2C(sda=Pin(0), scl=Pin(1), freq=400000)

lcd = I2cLcd(i2c, 0x27, 2, 16)

lcd.display_on()
lcd.backlight_on()

sensor_dht = dht.DHT11(Pin(15))

dht_temperature = None
dht_humidity = None

ip = None

LEDS = {
    "white": Pin(18, Pin.OUT),
    "green": Pin(19, Pin.OUT),
    "red": Pin(20, Pin.OUT),
    "blue": Pin(21, Pin.OUT),
}


async def network_loop():
    global ip

    wlan = network.WLAN(network.STA_IF)
    retry_delay = 1

    while True:
        try:
            if not wlan.active():
                wlan.active(True)

            if wlan.isconnected():
                current_ip = wlan.ifconfig()[0]

                if ip != current_ip:
                    ip = current_ip

                pico_led.on()
                retry_delay = 1

                await asyncio.sleep(3)

                continue

            ip = None
            pico_led.toggle()

            wlan.connect(config.SSID, config.PASSWORD)

            for _ in range(15):
                if wlan.isconnected():
                    break

                await asyncio.sleep(1)

            if wlan.isconnected():
                ip = wlan.ifconfig()[0]

                pico_led.on()
                retry_delay = 1

                continue

            try:
                wlan.disconnect()
            except OSError:
                pass

        except OSError:
            ip = None

        await asyncio.sleep(retry_delay)

        retry_delay = min(retry_delay * 2, 30)


app = Microdot()


@app.get("/")
def home(request):
    return {"message": "Welcome to Rachel Pico!"}


@app.get("/api/temperature")
def home_sensor(request):
    return {
        "temperature": dht_temperature,
        "humidity": dht_humidity,
    }


@app.post("/api/leds/<name>/on")
def led_on(request, name):
    led = LEDS.get(name)

    if led is None:
        return {"message": "Unknown led"}, 404

    led.on()

    return {"message": f"{name} is now on"}


@app.post("/api/leds/<name>/off")
def led_off(request, name):
    led = LEDS.get(name)

    if led is None:
        return {"message": "Unknown led"}, 404

    led.off()

    return {"message": f"{name} is now off"}


@app.get("/api/system/memory")
def memory(request):
    gc.collect()

    return {
        "free": gc.mem_free(),
        "allocated": gc.mem_alloc(),
    }


@app.errorhandler(404)
def not_found(request):
    return {"message": "Not found"}, 404


async def display_loop():
    while True:
        lcd.clear()

        lcd.move_to(0, 0)
        lcd.putstr("Rachel Agent!")
        lcd.move_to(0, 1)
        lcd.putstr("is ready.")

        await asyncio.sleep(5)

        lcd.clear()

        lcd.move_to(0, 0)
        lcd.putstr("Created by")
        lcd.move_to(0, 1)
        lcd.putstr("Dr. Amirhossein")

        await asyncio.sleep(5)

        lcd.clear()

        lcd.move_to(0, 0)
        lcd.putstr("Network info:")
        lcd.move_to(0, 1)
        lcd.putstr((ip or "Connecting...")[:16])

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
    asyncio.create_task(display_loop())
    asyncio.create_task(update_temp())

    await app.start_server(port=80)


asyncio.run(main())
