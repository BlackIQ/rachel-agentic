# Machine
from machine import Pin, I2C  # Pin, I2C
from picozero import pico_temp_sensor, pico_led  # Pico Things
import rp2  # Raspberry Pi 2 Pico

# Networking
import network  # Network
import socket  # Socket

# Libs
from time import sleep  # Time
import sys  # Sysyem

# Sensors
import dht  # HDT

# Customs
from machine_i2c_lcd import I2cLcd  # Liquid Crystal

# ===== LCD Setup =====

I2C_ADDR = 0x27
I2C_NUM_ROWS = 2
I2C_NUM_COLS = 16

i2c = I2C(sda=Pin(0), scl=Pin(1), freq=400000)

lcd = I2cLcd(i2c, I2C_ADDR, I2C_NUM_ROWS, I2C_NUM_COLS)

lcd.display_off()
lcd.backlight_off()

# ===== DHT Setup =====

sensor_dht_pin = Pin(15)
sensor_dht = dht.DHT11(sensor_dht_pin)

# ===== LED Setup =====

white_led = Pin(18, Pin.OUT)
green_led = Pin(19, Pin.OUT)
red_led = Pin(20, Pin.OUT)
blue_led = Pin(21, Pin.OUT)

white_led.on()
green_led.on()
red_led.on()
blue_led.on()

# ===== WLAN Setup ======

SSID = "Maria"
PASSWORD = "0481244859"


# Connect
def connect():
    wlan = network.WLAN(network.STA_IF)
    wlan.active(True)
    wlan.connect(SSID, PASSWORD)

    while not wlan.isconnected():
        if rp2.bootsel_button() == 1:
            print("Good bye.")
            sys.exit()

        print("Connecting...")

        pico_led.on()
        sleep(0.1)
        pico_led.off()
        sleep(0.1)

    ip = wlan.ifconfig()[0]

    print(f"Device IP Address: {ip}")

    pico_led.on()

    return ip


# Socket
def open_socket(ip):
    address = ("", 80)

    connection = socket.socket()
    connection.bind(address)
    connection.listen(1)

    print("Socket is open")

    return connection


# ===== Responses =====


def http_response(body, content_type="text/html"):
    return "HTTP/1.1 200 OK\r\n" f"Content-Type: {content_type}\r\n" "\r\n" + body


def not_found():
    return (
        "HTTP/1.1 404 Not Found\r\n"
        "Content-Type: text/plain\r\n"
        "\r\n"
        "404 Not Found"
    )


# ===== Routes =====


def home():
    return http_response(
        f'{{"message": "Welcome to my firmware!"}}', "application/json"
    )


def pico_temperature():
    temp = pico_temp_sensor.temp

    return http_response(f'{{"temperature": {temp}}}', "application/json")


def home_temperature():
    sensor_dht.measure()

    temp = sensor_dht.temperature()

    return http_response(f'{{"temperature": {temp}}}', "application/json")


def home_humidity():
    sensor_dht.measure()

    hum = sensor_dht.humidity()

    return http_response(f'{{"humidity": {hum}}}', "application/json")


# ===== Router =====

routes = {
    ("GET", "/"): home,
    ("GET", "/api/pico/temperature"): pico_temperature,
    ("GET", "/api/home/temperature"): home_temperature,
    ("GET", "/api/home/humidity"): home_humidity,
}


def router(method, path):
    handler = routes.get((method, path))

    if handler is None:
        return not_found()

    return handler()


# ===== Server =====


# HTTP Server
def serve(connection):
    while True:
        client = connection.accept()[0]

        try:
            request = client.recv(1024)

            print(request)

            try:
                request_line = request.split(b"\r\n")[0]
                method, path, _ = request_line.split()

                method = method.decode()
                path = path.decode()
            except IndexError:
                client.close()
                continue

            response = router(method, path)

            client.send(response)
        except OSError as e:
            print("Socket error:", e)
        finally:
            client.close()


# Starting this fucking bitch
ip = connect()

lcd.display_on()
lcd.backlight_on()

lcd.clear()

lcd.putstr("Rachel Agent!")
lcd.move_to(0, 1)
lcd.putstr(ip)

connection = open_socket(ip)
serve(connection)
