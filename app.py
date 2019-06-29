#!/usr/bin/env python
from importlib import import_module
import os
import cv2
from flask import Flask, render_template, Response
from camera import Camera


img_counter = 0


#camera_obj = none
app = Flask(__name__)


@app.route('/')
def index(): 
    """Video streaming home page."""
    return render_template('index.html')


def gen(camera, flag):
    if flag > 0:
        camera.flag=flag
		#set flag to 1 -> the class will save the photo without blocking the stream
        camera.set_flag(flag)
        #print("{} written!"+camera.flag)
    """Video streaming generator function."""
    while (flag!=0):
        frame = camera.get_frame()
        yield (b'--frame\r\n'
               b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')
    
    
@app.route('/video_feed/<flag>')
def video_feed(flag):
    """Video streaming route. Put this in the src attribute of an img tag."""
    return Response(gen(Camera(), flag),
                    mimetype='multipart/x-mixed-replace; boundary=frame')




if __name__ == '__main__':
    app.run(host='0.0.0.0', , port=5000)
