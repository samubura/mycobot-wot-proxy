# mycobot-wot-proxy

This is a small demo example using [node-wot](https://github.com/eclipse-thingweb/node-wot) to expose a Thing Description and implement a proxy for a [MyCobot](https://www.elephantrobotics.com/en/mycobot-320-m5-en/?dm_acc=3657328933&dm_cam=17566429188&dm_grp=&dm_ad=&dm_src=x&dm_tgt=&dm_kw=&dm_mt=&dm_net=adwords&dm_ver=3&gad_source=1&gclid=Cj0KCQiA7OqrBhD9ARIsAK3UXh2X_-DUx1l4OqEmqoczclEV4g5Xx5Xde-3zbPgwkPw17eaGj0CVDn8aAqGVEALw_wcB) a 6-DOF robot arm with an M5 stack core.

Through Web APIs you can then remotely move the robot adjusting the joints, open/close the gripper and change the color of the led matrix in the head.

## Using this example

This example uses the USB serial interface of MyCobot, flashed with the official firmware and set in "transponder" mode. 

Connect the robot to a usb port on you laptop and be sure to change the line in the code that creates the serial socket.


```javascript

//creating the serial channel with the robot, be sure to select the appropriate serial interface (e.g. "COM3" on Windows)
let serial = mycobot.connect("/dev/ttyACM0",115200)

 ```

 Then you can simply run the app using node.js and see the TD hosted on 
 http://localhost:8080/mycobot
