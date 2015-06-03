var Buffer = require('buffer');
var Device = require('tuntap');
var tap = new Device.Tap('/dev/net/tun');

tap.setname('tap68');

// MUST resume it 
tap.resume();

tap.on('data', function(frame){
    console.log('tap: '+frame.slice(0, 34).toString('hex'));
	
    // swap ip headers offset 14
    var src_ip = frame.readUInt32BE(14);
    var dst_ip = frame.readUInt32BE(18);

    frame.writeUInt32BE(dst_ip, 14);
    frame.writeUInt32BE(src_ip, 18);
 
    tap.write(frame);
});
console.log('tap68 loopback ...');
