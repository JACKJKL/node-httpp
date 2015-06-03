var Buffer = require('buffer');
var Device = require('tuntap');
var tun = new Device.Tun('/dev/net/tun');

tun.setname('tun68');

// MUST resume it 
tun.resume();

// actually not always frame, but byte stream
tun.on('data', function(frame){
    console.log('tun: '+frame.slice(0, 20).toString('hex'));
    
    // swap ip headers offset 12
    var src_ip = frame.readUInt32BE(12);
    var dst_ip = frame.readUInt32BE(16);

    frame.writeUInt32BE(dst_ip, 12);
    frame.writeUInt32BE(src_ip, 16);
 
    tun.write(frame);
});
console.log('tun68 loopback ...');

