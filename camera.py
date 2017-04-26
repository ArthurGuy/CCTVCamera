import picamera
from time import sleep

camera = picamera.PiCamera()

camera.capture('image.jpg')
with open('image.jpg', 'rb') as f: r = requests.post('http://requestb.in/qr61r7qr', files={'image.jpg.xls': f})

sleep(30);
