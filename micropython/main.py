# Libs
from machine import Pin, I2C  # Machine
from picozero import pico_led  # Pico Things
from time import sleep  # Time
import network  # Network
import gc  # Monitoring

# Microdot
from microdot import Microdot  # Like Flask/FastAPI

# Sensors
import dht  # HDT

# Customs
from machine_i2c_lcd import I2cLcd  # Liquid Crystal

# ===== LCD Setup ====

i2c = I2C(sda=Pin(0), scl=Pin(1), freq=400000)

lcd = I2cLcd(i2c, 0x27, 2, 16)

lcd.display_on()
lcd.backlight_on()

lcd.putstr("Rachel Agent!")
lcd.move_to(0, 1)
lcd.putstr("Booting...")

# ===== DHT Setup =====
sensor_dht = dht.DHT11(Pin(15))

# ===== LED Setup =====

LEDS = {
    "white": Pin(18, Pin.OUT),
    "green": Pin(19, Pin.OUT),
    "red": Pin(20, Pin.OUT),
    "blue": Pin(21, Pin.OUT),
}

# ===== WLAN Setup ======

SSID = ""
PASSWORD = ""


def connect():
    wlan = network.WLAN(network.STA_IF)
    wlan.active(True)
    wlan.connect(SSID, PASSWORD)

    while not wlan.isconnected():
        pico_led.on()
        sleep(0.1)
        pico_led.off()
        sleep(0.1)

    ip = wlan.ifconfig()[0]

    pico_led.on()

    lcd.clear()

    lcd.putstr("Rachel Agent!")
    lcd.move_to(0, 1)
    lcd.putstr(ip)


# ===== API =====

app = Microdot()


@app.get("/")
def home(request):
    return {"message": "Welcome to Rachel Pico!"}


@app.get("/api/temperature")
def home_sensor(request):
    sensor_dht.measure()

    return {
        "temperature": sensor_dht.temperature(),
        "humidity": sensor_dht.humidity(),
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


lcd.clear()

lcd.putstr("Rachel Agent!")
lcd.move_to(0, 1)
lcd.putstr("Connecting...")

connect()

app.run(port=80)
