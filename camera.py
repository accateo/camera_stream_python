import time
import cv2
import os
from base_camera import BaseCamera

img_counter = 0

class Camera(BaseCamera):
    video_source = 0
    flag = 0
    rec_path = ""
	"""set all directory and mount device  """
    os.system("sudo mkdir /mnt/usbdrive")
    os.system("sudo mount /dev/sdb1 /mnt/usbdrive")
    os.system("ls /mnt/usbdrive")
    rec_path = "> /mnt/usbdrive/imgtest/"


    @staticmethod
    def set_video_source(source):
        Camera.video_source = source
        

    @staticmethod
    def frames():
        camera = cv2.VideoCapture(Camera.video_source)
        if not camera.isOpened():
            raise RuntimeError('Could not start camera.')

        while True:
            # read current frame
            _, img = camera.read()
            #print("written!"+str(Camera.flag))
			# if gui button clicked, save on USB
            if (Camera.flag > 0):
                print("saved!")
                global img_counter
                img_name = "snapshot/opencv_frame_{}.png".format(img_counter)
	        cv2.imwrite(img_name,img)
                img_name = "/mnt/usbdrive/imgtest/opencv_frame_{}.png".format(img_counter)
	        cv2.imwrite(img_name,img)
	        img_counter+=1
                Camera.flag = 0
            # encode as a jpeg image and return it
            yield cv2.imencode('.jpg', img)[1].tobytes()
	    
    @staticmethod
    def set_flag(flag):
        Camera.flag = flag
