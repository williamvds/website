+++
title = "Diagnosing issues with tcpreplay & tcprewrite"
description = """
Some issues one can run into when using tcpreplay and friends to replay packet
captures on different computers, and how to fix them
"""
slug="diagnosing-tcpreplay"
date = 2020-09-23
+++

[Tcpreplay](https://tcpreplay.appneta.com) lets you take previously recorded
network traffic (e.g. with [tcpdump](https://www.tcpdump.org)) and send it out
again, keeping packets the exactly same or altering them slightly. This can be
handy if, for example, you're testing an application that receives data over a
network.
Recorded packets include the original metadata, including the source and
destination addresses, so if you want those recordings to instead transfer data
between completely different computers, you'll have to adjust them beforehand.
[`tcprewrite`](https://tcpreplay.appneta.com/wiki/tcprewrite-man.html) is
another tool designed to do exactly that. This article goes in to what to look
out for when you're having problems using these.

# Step 1: Check that the target destination can receive data

Use tools like [netcat](http://nc110.sourceforge.net) and
[Wireshark](https://www.wireshark.org) to try sending packets from the source
computer to the destination computer. For example, `$ nc 192.168.0.20` will send
a TCP packet to that address, and `$ nc -u 192.168.0.20` will send a UDP packet
for every line you enter. Wireshark and similar tools can be used to detect
these packets on the receiving end.

If these packets are detected as expected, but the packets from `tcpreplay` are
not, your issues likely lie with `tcpreplay` rather than your network.
Run `tcpdump -e` (specifying the correct interface with `-i`) while manually
sending packets with `netcat`, identify the lines caused by that traffic, then
run `tcpreplay` and compare the packets.

Another issue can be additional unwanted metadata in packets, including 802.1q
VLAN tag information. Try stripping it from the packet capture using
`tcprewrite`'s `--enet-vlan=del` option.

Finally, if you're expecting the recording to include multicast UDP traffic,
make sure the destination application registers itself as part of the
appropriate UDP multicast group, which is the destination address specified in
multicast packets. For some reason, when I was using it to diagnose issues,
Wireshark did not display multicast traffic, causing me to believe `tcpreplay`
was at fault. However, an application I made to detect multicast packets
successfully picked them up once the socket was configured to join multicast
groups.

# Step 2: Correct MTU size issues

When using high replay multipliers (with the `-x` option), I ran into errors
indicating packets had exceeded the MTU size. If increasing the MTU of your
network devices isn't an option, I'd recommend trying `tcpreplay`'s `--mtu`
and `--mtu-trunc` options.

# Step 3: Rewrite addresses correctly

An obvious problem can be that the source/destination addresses are incorrect
within the packet capture. Use
[`tcprewrite`](https://tcpreplay.appneta.com/wiki/tcprewrite) to correct those,
particularly looking at the `--pnat`, `--srcipmap`, and `--dstipmap` for
rewriting IP addresses, and `--enet-smac` and `--enet-dmac` for correcting MAC
addresses.

# Step 4: Correct packet checksums

Packets with incorrect checksums may be dropped by the destination computer.
Wireshark can indicate these packets with the advanced options
`ip.check_checksum` and protocol variations such as `udp.check_checksum` and
`tcp.check_checksum`. Recorded packets with incorrect checksums will then be
highlighted in black/red. If you run into this issue, add another (maybe
separate) pass of `tcprewrite` using the `--fixcsum` option.
