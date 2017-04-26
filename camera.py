import picamera
import requests
from time import sleep

camera = picamera.PiCamera()

camera.capture('image.jpg')
with open('image.jpg', 'rb') as f: r = requests.post('https://bbms.buildbrighton.com/camera/store', files={'image.jpg.xls': f})

sleep(30);
