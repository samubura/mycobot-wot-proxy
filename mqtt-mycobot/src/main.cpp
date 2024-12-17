#include <MycobotBasic.h>
#include <ParameterList.h>

MycobotBasic myCobot;

void setup(void)
{
    myCobot.setup();
    myCobot.powerOn();
}

void loop(void)
{
    M5.update();
}