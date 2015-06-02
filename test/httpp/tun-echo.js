var Buffer = require('buffer');
var tun = require('tuntap').TunStream;
var dev = new tun('/dev/net/tun');

dev.setname('tun68');

// MUST resume it 
dev.resume();

// actually not always frame, but byte stream
dev.on('data', function(frame){
    ///console.log(frame.toString('hex'));
    // swap ip headers
    var dst_ip = frame.readUInt32BE(12);
    var src_ip = frame.readUInt32BE(16);

    frame.writeUInt32BE(src_ip, 12);
    frame.writeUInt32BE(dst_ip, 16);
 
    dev.write(frame);
});

console.log('tun68 loopback ...');
