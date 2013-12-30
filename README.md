midi-grabber
===

Stream midi data in and temporarily route ranges to specific callbacks.

[![NPM](https://nodei.co/npm/midi-grabber.png?compact=true)](https://nodei.co/npm/midi-grabber/)

## Example

```
var MidiGrabber = require('midi-grabber')
var midi = require('midi')

// set up an midi input stream
var input = midi.input()
input.openVirtualPort("Input")
var inputStream = midi.createReadStream(input)

// set up midi output stream
var output = midi.output()
input.openVirtualPort("Filtered Output")
var outputStream = midi.createWriteStream(input)

// pipe the input through grabber and back out
var grabber = MidiGrabber()
inputStream.pipe(grabber).pipe(outputStream)

// at this stage, any midi notes sent to 'Input' will pass thru to 'Filtered Output'

// Now let's grab a range of notes (say control buttons)
var release = grabber.grab([176, '104..111'], function(data){
  // do stuff with the grabbed midi
  // notes matching the filter will not be passed thru to 'Filtered Output'
  // however, if you return false, the note will still be passed through 
})

// let go of the range
release()

```