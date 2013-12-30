var MidiGrabber = require('../')
var test = require('tape')

test('catch all and release', function(t){
  t.plan(3)

  var grabber = MidiGrabber()
  grabber.on('data', function(){
    throw 'Should not emit any notes'
  })
  var release = grabber.grab(function(data){
    t.ok(true, 'Note grabbed')
  })
  grabber.write([144, 36, 127])

  if (global.Buffer){ // testling compat
    grabber.write(new Buffer([144, 36, 127]))
  } else {
    grabber.write([144, 36, 127])
  }

  grabber.removeAllListeners('data')
  grabber.on('data', function(data){
    t.deepEqual(data, [144, 60, 127])
  })

  release()

  grabber.write([144, 60, 127])

  t.end()
})

test('grab channel', function(t){
  t.plan(2)

  var grabber = MidiGrabber()
  grabber.on('data', function(data){
    t.equal(data[0], 144)
  })
  grabber.grab([176], function(data){
    t.equal(data[0], 176)
  })

  grabber.write([144, 30, 127])
  grabber.write([176, 104, 127])

  t.end()
})

test('grab note range', function(t){
  t.plan(6)

  var grabber = MidiGrabber()
  grabber.on('data', function(data){
    t.ok(data[1] < 40 || data[1] > 50, 'pass thru in range')
  })
  grabber.grab([144, '40..50'], function(data){
    t.ok(data[1] >= 40 && data[1] <= 50, 'grab in range')
  })

  grabber.write([144, 39, 127])
  grabber.write([144, 40, 127])
  grabber.write([144, 41, 127])
  grabber.write([144, 49, 127])
  grabber.write([144, 50, 127])
  grabber.write([144, 51, 127])

  t.end()
})