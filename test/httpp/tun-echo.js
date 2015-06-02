var tun = require('tuntap').TunStream;

var dev = new tun('/dev/net/tun');

dev.setname('tun68');

dev.pipe(dev);
console.log('tun68 loopback ...');
