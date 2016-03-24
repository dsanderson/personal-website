# IoT Boards I've Used

I really like the idea of IoT.  Not so much vendors coming out with their own proprietary stacks and protocols, but rather ability to cheaply and easily gather and expose myself and my environment to the internet, and remotely adjust that environment.  To that end, I've played around with a couple of different IoT boards, and am planning to keep a running list of my experiences here, mostly so I can remind myself of how to select amongst and use these boards in the future.  With that said, let's jump right into this.

## Esquilo

[!image](/images/iot/esquilo)
The [esquilo](https://www.esquilo.io/) is a wifi-enabled microcontroller with onboard filestorage, a webserver, a real-time operating system, and a bunch of GPIO pins and libraries to support them.  The really cool, differentiating feature here is the onboard storage and webserver.  Since the board runs its own webserver, the web-based IDE is served by the board itself.  Once connected to your wifi, you can access the board from anywhere else on that network to program, debug, upload files or download files.

[!image](/images/iot/esquilo-ide)
This is really cool, but it does have some disadvantages.  First off, since the microcontroller is (I think) single-threaded, if your real-time program doesn't pause for enough time, the IDE will stop working.  If you set the program to auto-boot, this means you won't be able to stop the program, or access the board through your browser.  They've added a feature to turn off auto-boot via the reset button, however, so this issue is less pressing.  It does mean that any programs you write need fairly signifcant pauses, however (around 100ms).

Another, more minor disadvantage is that the web UI is a bit clunky for uploading or downloading files.  Normally this wouldn't be an issue, but for one project we expereinced repeated SD card failures, and would need to reupload all out libraries and programs fairly frequently.  Likewise, if you are developing locally and have
