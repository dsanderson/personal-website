# IoT Boards I've Used

I really like the idea of IoT.  Not so much vendors coming out with their own proprietary stacks and protocols, but rather ability to cheaply and easily gather and expose myself and my environment to the internet, and remotely adjust that environment.  To that end, I've played around with a couple of different IoT boards, and am planning to keep a running list of my experiences here, mostly so I can remind myself of how to select amongst and use these boards in the future.  With that said, let's jump right into this.

## Esquilo

[!image](/images/iot/esquilo)
The [esquilo](https://www.esquilo.io/) is a wifi-enabled microcontroller with onboard filestorage, a webserver, a real-time operating system, and a bunch of GPIO pins and libraries to support them.  The really cool, differentiating feature here is the onboard storage and webserver.  Since the board runs its own webserver, the web-based IDE is served by the board itself.  Once connected to your wifi, you can access the board from anywhere else on that network to program, debug, upload files or download files.

[!image](/images/iot/esquilo-ide)
This is really cool, but it does have some disadvantages.  First off, since the microcontroller is (I think) single-threaded, if your real-time program doesn't pause for enough time, the IDE will stop working.  If you set the program to auto-boot, this means you won't be able to stop the program, or access the board through your browser.  They've added a feature to turn off auto-boot via the reset button, however, so this issue is less pressing.  It does mean that any programs you write need fairly signifcant pauses, however (around 100ms).

Another, more minor disadvantage is that the web UI is a bit clunky for uploading or downloading files.  Normally this wouldn't be an issue, but for one project we expereinced repeated SD card failures, and would need to re-upload all out libraries and code fairly frequently.  On the other hand, the wifi network was flakey, so the ability to store data onboard and only transmit when possible was enormously useful.  

The Squirrel language is nice, but uncommon.  The documentation is sensible, but rare.  However, the approach used to connect the webserver to the real-time OS is very elegant; a function is provided by a built-in javascript library which allows the browser to call functions on the RTOS, and recieve the output.  Getters and setters are straightforward, as are simple control interfaces.

## Particle Photon

Patricle (formerly Spark) was an early kickstarter success, providing an arduino-like board with easy connectivity to the public internet.  They provide this connectivity by maintining servers to which your photon connects.  This means you can monitor and reprogram your photon from anywhere on the internet, as well as send commands back to the device.  The former ability has come in useful several times

## NodeMCU

A few years back, the easiest way to create IoT boards was to stick a wifi shield on an arduino.  Turns out, the chip running the wifi board is a pretty powerful microcontroller in its own right.  Some clever hardware hackers decided to ditch the arduino, and simply provide GPIO pins on the wifi chip itself, sepcifically the ESP2822.
