// basic demo
var mycobot = require("mycobot")

// obj Based on SerialPort
var obj = mycobot.connect("/dev/ttyACM0",115200)

var down_position = [0, -35, -100, 50, 0, -45]

var up_position = [0, 0, 0, 0, 0, -45]

var speed = 30;

var delay = 5000;


async function main(position, gripper) {

    console.log(position);

    obj.write(mycobot.sendAngles(position.slice(0), speed));
    await sleep(delay);

    obj.write(mycobot.setGripperValue(gripper, speed));
    await sleep(delay);

    var newPos = position == up_position ? down_position : up_position;
    var newGrip = gripper == 0 ? 100 : 0;
    console.log(newPos)
    await main(newPos, newGrip);
}


main(up_position, 100);





function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}


