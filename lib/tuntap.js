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

var util = require('util');
var inherits = util.inherits;
var devStream = require('device').DeviceStream;

// Tun stream class
function Tun(path, flags) {
	if (!(this instanceof Tun)) return new Tun(path, flags);
	
	devStream.call(this, path, flags);
}

inherits(Tun, devStream);

exports.Tun = Tun;

// set tun interfce name
Tun.prototype.setname = function(intf_name) {
    this._handle.setTunName(intf_name);
};

// Tap stream class
function Tap(path, flags) {
	if (!(this instanceof Tap)) return new Tap(path, flags);
	
	devStream.call(this, path, flags);
}

inherits(Tap, devStream);

exports.Tap = Tap;

// set tap interfce name
Tap.prototype.setname = function(intf_name) {
    this._handle.setTapName(intf_name);
};
