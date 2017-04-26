import picamera
import requests
from time import sleep

camera = picamera.PiCamera()
camera.resolution = (1024, 768)

camera.start_preview()
sleep(2);
camera.capture('image.jpg')

with open('image.jpg', 'rb') as f: r = requests.post('https://bbms.buildbrighton.com/camera/store', files={'image': f})

sleep(60);
