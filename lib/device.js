// Copyright tom zhou<iwebpp@gmail.com>, 2015.
//
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

var assert = require('assert');
var util = require('util');
var inherits = util.inherits;
var constants = process.binding('constants');
var net = require('net');
var DEVICE = process.binding('device_wrap').DEVICE;

var O_RDONLY = constants.O_RDONLY || 0;
var O_RDWR   = constants.O_RDWR   || 0;
var O_WRONLY = constants.O_WRONLY || 0;

// Device stream class
function DeviceStream(path, flags) {
  if (!(this instanceof DeviceStream)) return new DeviceStream(path, flags);
  
  // check arguments
  flags = (flags != null) ? flags : O_RDWR;
  
  net.Socket.call(this, {
    handle: new DEVICE(path, flags)
  });

  this.readable = (flags == O_RDWR) || (flags == O_RDONLY);
  this.writable = (flags == O_RDWR) || (flags == O_WRONLY);;
}
inherits(DeviceStream, net.Socket);

exports.DeviceStream = DeviceStream;

DeviceStream.prototype.pause = function() {
  return net.Socket.prototype.pause.call(this);
};

DeviceStream.prototype.resume = function() {
  return net.Socket.prototype.resume.call(this);
};

DeviceStream.prototype.ioctl = function(cmd, args) {
  this._handle.setIOCtl(cmd, args);
};
