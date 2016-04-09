# Exploring my Chrome History

Brains are cool, but memory is annoying.  The promise of exocortexes is to fix that second problem-to allow us to easily, almost naturally access and analyze perfect memories.  While I can't get anywhere near that... yet... I did realize that I have a large, persistant record of one of my favorite sources of information-my internet browsing.  To that end, I decided to start digging into my Google Chrome history, just to see what I would find.

## Background

A bit of googling tells me that the browser history lives in `C:\Users\%USERNAME%\AppData\Local\Google\Chrome\User Data\Default\Preferences` (this also led me to the kinda interesting, kinda inactive [forensics wiki](http://forensicswiki.org/wiki/Main_Page)).  Opening the file in notepad, the first line contains SQLite, which is a pretty good hint for the file format.  So, I poked around a little bit, to discover the 
