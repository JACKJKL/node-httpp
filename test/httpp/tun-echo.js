var Buffer = require('buffer');
var Device = require('tuntap');
var tun = new Device.Tun('/dev/net/tun');
var tap = new Device.Tap('/dev/net/tun');

tun.setname('tun68');
tap.setname('tap68');

// MUST resume it 
tun.resume();
tap.resume();

// actually not always frame, but byte stream
tun.on('data', function(frame){
    console.log(frame.slice(0, 20).toJSON());
    
    // swap ip headers offset 12
    var src_ip = frame.readUInt32BE(12);
    var dst_ip = frame.readUInt32BE(16);

    frame.writeUInt32BE(dst_ip, 12);
    frame.writeUInt32BE(src_ip, 16);
 
    tun.write(frame);
});
console.log('tun68 loopback ...');

tap.on('data', function(frame){
    console.log(frame.slice(0, 34).toJSON());
	
    // swap ip headers offset 14
    var src_ip = frame.readUInt32BE(14);
    var dst_ip = frame.readUInt32BE(18);

    frame.writeUInt32BE(dst_ip, 14);
    frame.writeUInt32BE(src_ip, 18);
 
    tap.write(frame);
});
console.log('tap68 loopback ...');
