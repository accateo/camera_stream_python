Code in python to show camera streaming in a web page and taking a snapshot without blocking or freezing

Tested with python2.7 on a Ubuntu distro

<h1>How to</h1>

Run:

`python app.py`

and open a browser (tipically Chrome) at the address

`127.0.0.1:5000`

You can cnange the port in "app.py" file.
In the web page you'll see:


![Alt text](Cattura.PNG "Screenshot")


You can change the camera source editing the "camera.py" file at line:

`video_source = 0`

When you click on "Take snapshot", a snapshot is saved on a USB drive.

This code uses also some script to make the gui more beautiful... (Bootstrap, Jquery and some css)
