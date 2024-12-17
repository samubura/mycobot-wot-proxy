// Required steps to create a servient for creating a thing
const Servient = require('@node-wot/core').Servient;
const HttpServer = require('@node-wot/binding-http').HttpServer;

//mycobot js library
const mycobot = require("mycobot")

//data that the proxy will hold on the robot state
let color = {r: 0, g: 0, b: 0}
let angles = [0,0,0,0,0,0]
let gripper = 0;

//creating the serial channel with the robot, be sure to select the appropriate serial interface (e.g. "COM3" on Windows)
let serial = mycobot.connect("/dev/ttyACM0",115200)

//Reset the robot position, color and gripper
serial.write(mycobot.setColor(color.r, color.g, color.b))
serial.write(mycobot.setGripperValue(gripper, 100))
serial.write(mycobot.sendAngles(angles, 50))


const middleware = async (req, res, next) => {
    // For example, reject requests in which the X-Custom-Header header is missing
    // by replying with 400 Bad Request
    // Pass all other requests to the WoT Servient
    console.log(req);
    next();
};


const httpServer = new HttpServer({
    middleware,
});


//Create new Servient with an HTTP interface
const servient = new Servient();
servient.addServer(httpServer);

// Then from here on you can use the WoT object to produce the thing
servient.start().then( async (WoT) => {
    const exposingThing = await WoT.produce({
        title: "mycobot",
        description: "A 6DOF robot arm",
        properties: {
            color: {
                type: "object",
                properties: {
                    r: {
                        type: "integer",
                        minimum: 0,
                        maximum: 255
                    },
                    g: {
                        type: "integer",
                        minimum: 0,
                        maximum: 255
                    },
                    b: {
                        type: "integer",
                        minimum: 0,
                        maximum: 255
                    },
                },
                required: ["r", "g", "b"],
                readOnly: true,
            },
            angles: {
                type: "array",
                minItems: 6,
                maxItems: 6,
                items: {
                    type: "number",
                    minimum: -160,
                    maximum: 160
                },
                readOnly: true
            },
            gripper: {
                type: "integer",
                minimum: 0,
                maximum: 100,
                readOnly: true
            }
        },
        actions: {
            setColor: {
                description: "Set the robot head color",
                input: {
                    type: "object",
                    properties: {
                        r: {
                            type: "integer",
                            minimum: 0,
                            maximum: 255
                        },
                        g: {
                            type: "integer",
                            min: 0,
                            max: 255
                        },
                        b: {
                            type: "integer",
                            min: 0,
                            max: 255
                        }
                    },
                    required: ["r", "g", "b"]
                }
            },
            setAngles: {
                description: "Set the robot position by sending an array of the joint angles",
                input: {
                    type: "object",
                    properties: {
                        angles: {
                            type: "array",
                            minItems: 6,
                            maxItems: 6,
                            items: {
                                type: "number",
                                minimum: -160,
                                maximum: 160

                            }
                        },
                        speed: {
                            type: "integer",
                            minimum: 0,
                            maximum: 100
                        }
                    }
                }
            },
            setGripperValue: {
                description: "Open and close the robot hand",
                input: {
                    type: "object",
                    properties: {
                        value: {
                            type: "integer",
                            type: "number",
                            minimum: 0,
                            maximum: 100
                        },
                        speed: {
                            type: "integer",
                            minimum: 0,
                            maximum: 100
                        }
                    }
                }
            }
            
        }
    })
    //setting property handlers to return data 
    //(in this case not reading from the robot due to the way reading is done through the serial)
    exposingThing.setPropertyReadHandler("color", () => {
        return color;
    })
    exposingThing.setPropertyReadHandler("angles", async () => {
        return angles
    })
    exposingThing.setPropertyReadHandler("gripper", async () => {
        return gripper
    })

    //setting action handlers to send commands to the robot through the serial and save the sent value in memory
    exposingThing.setActionHandler("setColor", async (params, options) => { 
        color = await params.value();
        console.log("Received: "+ JSON.stringify(color))
        await serial.write(mycobot.setColor(color.r, color.g, color.b))
        return undefined
    });
    exposingThing.setActionHandler("setAngles", async (params, options) => { 
        let data = await params.value();
        angles = data.angles;
        console.log("Received: "+ JSON.stringify(data))
        await serial.write(mycobot.sendAngles(data.angles.slice(0), data.speed))
        return undefined
    });
    exposingThing.setActionHandler("setGripperValue", async (params, options) => { 
        let data = await params.value();
        gripper = data.value;
        console.log("Received: "+ JSON.stringify(data))
        await serial.write(mycobot.setGripperValue(data.value, data.speed))
        return undefined
    });
    
    //expose the thing
    await exposingThing.expose();
    
    // now you can interact with the thing via http://localhost:8080/mycobot
});
