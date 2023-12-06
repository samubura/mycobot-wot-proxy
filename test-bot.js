// basic demo
var mycobot = require("mycobot")

// obj Based on SerialPort
var obj = mycobot.connect("/dev/ttyACM0",115200)

obj.write(mycobot.sendAngles([160,0,0,0,0,0],60))

obj.write(mycobot.getAngles())

obj.on("data",(data)=>{
    res = mycobot.processReceived(data)
    console.log("res:", res)
})