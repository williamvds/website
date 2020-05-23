+++
title = "Software I Use"
description = """
A catalogue of software I use and how. I also go in to things I'd like to try or
improve in the future.
"""
slug="software-i-use"
date = 2020-05-22
+++

## Self-hosting

### This website

Being a lightweight static website, it's no hassle to set up and host it from my
own server.

I originally created it with [Vue.js](https://vuejs.org), as I wanted a dynamic
résumé I could adjust over time and tailor for particular job applications.  
While I pushed this Vue.js version to my live server, I later realised the same
could be achieved with a static site generator. I eventually settled on
[Zola](https://getzola.org) as it seems relatively lightweight, has a good
selection of features, and doesn't use JavaScript.  
It can easily be maintained in a Git repository, which allows me to push changes
both to the origin repository (wherever that may be) and my server easily. With
a Git hook I can have my server regenerate the site whenever I push changes,
automating the deployment process.

You can find the source for my website {{ repo(name="website", text="here") }}.

Things to improve:

- Use the Sass CSS extension language to clean up styling.
- Stop using [Iconify](https://iconify.design) for loading icons.

### [Nextcloud](https://nextcloud.com)

A great "cloud" suite that provides file and calendar syncing. Once I had this
set up I was kicking myself for not having done so sooner.
Having all my files automatically available on all my devices is a wonderful
experience and Nextcloud proves you don't need commercial solutions to do it.
The automatic syncing has been so hassle-free I've caught myself relying on it
in scenarios where I should be using a Git repository. Note to self: stop that.

Things to improve:

- Stop relying on it as a backup solution, and instead perform full backups
  kept in cold storage.
- While contact syncing is available it doesn't seem to function properly with
  Android - currently it's only making regular `.vcf` backups.
- Use the built-in RSS feed: either replace Newsboat or add Nextcloud support to
  it.
- Make a dark theme for the web UI.
- Create a good terminal client: `nextcloudcmd` is bundled with the full
  Nextcloud QT5 client, which is rather hefty and depends on QT5's web engine.

### [Taskwarrior server](https://taskwarrior.org)

Taskwarrior is a powerful task tracking and time-keeping tool which I severely
underutilise. Its appeal is how it can automatically prioritise tasks for me: I
can input tasks and have a prioritised list always telling me the next thing I
should be doing.
Used properly, I see it being a great force for productivity and applying order
when necessary.  
I've set up a synchronisation server so my tasks can be shared between all my
devices and I can keep up with them wherever I am.

Things to improve:

- [The Android app](https://github.com/williamvds/TaskwarriorAndroid):  
  I forked the original with the aim of refactoring, modernising, and adding new
  features to it. The current state is an improvement in some aspects, but some
  functionality is broken. Also, sync messages regularly fail and produce
  annoying error notifications.
- Work out how to use recurring tasks properly.
- __Try to use it more often__

## Raspberry Pi

### [Pi-Hole](https://pi-hole.net)

Blocks advertising for all devices in your LAN. What else do you need
to know?

Things to improve: 

- Configure the WiFi hub so all devices actually pick up the Pi as the DNS and
  DHCP server.

## Things I want to do

### Chromecast

Google's Chromecast is a nifty little device that lets you stream media to a
device. After cutting Google out of my Android device, my Chromecast device is
now practically useless: support for it seems to be provided by the [Google Play
Framework](https://developers.google.com/cast/docs/reference/android/packages),
and none of the Android apps that I use implement support for the Cast API
themselves.

While projects like
[pychromecast](https://github.com/home-assistant-libs/pychromecast) provide an
API for controlling Chromecast devices from a desktop, it's hardly the best
experience. I created a Python program for queuing YouTube videos with
pychromecast which serves my basic needs, but things like manipulating the play
queue isn't possible.  
On Android, it seems like there's a similar effort for an open-source
implementation of the Cast client API in
[chromecast-java-api-v2](https://github.com/vitalidze/chromecast-java-api-v2). I
hope this project finds itself being used by other open-source Android
applications, as I'd like to have Cast protocol support again.

Ideally we'd have an open-source implementation of the Cast server so one could
create their own Chromecast devices, e.g. using micro-computers like the
Raspberry Pi. Something like [Mopidy](https://mopidy.com) combined with
[Snapcast](https://mjaggard.github.io/snapcast) and/or [Home
Assistant](#home-assistant) could
provide an alternative.

### [Home Assistant](https://www.home-assistant.io)

Home Assistant is a widely lauded home automation suite, which I found myself
setting up on a Raspberry Pi.
That part was simple enough. Once I had it running I quickly realised I didn't
have anything to do with it.
I found myself disappointed with its Chromecast support, as the interface only
shows the currently playing media and a play/pause button.

Perhaps if I get some "smart" home devices I'll find a better use for it. Some
ideas:

- Listing schedule & events
- Coloured/dimmable lights
	- Adjust light temperature and intensity at a regular schedule to maintain
	  a regular circadian rhythm and provide light therapy during winter.
- Temperature & air quality sensors
	- Warn me when CO₂ levels get too high
- Automated lighting system with Bluetooth presence detection

Combined with a voice interface or [one of those magic
mirrors](https://www.raspberrypi.org/blog/magic-mirror), I can see Home
Assistant being a great tool for automation and personal management.

### Media server with Kodi

Ideally I'd have a small computer with mass storage that could act as a server
within my LAN, and could store media that I want to keep at hand but not
necessarily on my PC. Combined with [Kodi](https://kodi.tv), such a computer
could provide a great home-entertainment system.

### Automate personal computer setup

My user configuration files ("dotfiles") are stored {{ repo(name="config",
text="in a Git repository") }}, which includes an installation script. This
isn't ideal for the purposes of quickly reproducing my setup on a new computer.  
A configuration management tool like [Chef](https://chef.io) or
[Ansible](https://www.ansible.com) would be better suited for this task.

### A better terminal client for Signal

I use [Signal](https://signal.org) for my instant messaging. Sadly, the desktop
application is an Electron application and hence regularly gobbles up a gigabyte
of my system's memory for no good reason.  
[signal-cli](https://github.com/AsamK/signal-cli) and
[scli](https://github.com/isamert/scli) are *almost* good enough for using
Signal in the terminal. Support for stickers is however missing, and signal-cli
is a Java daemon which uses up more memory than it should. Not as much as the
Electron client, but it could still be better.  
Ideally, a new client would be built on [the C implementation of Signal's
protocol](https://github.com/signalapp/libsignal-protocol-c). It'd probably have
to reimplement a fair amount of the Electron client's features.

### Feed synchronisation with [FeedHQ](https://feedhq.org) 

If the Nextcloud news feed idea falls through, FeedHQ could provide a stopgap
solution.  
It's already supported by my terminal client ([Newsboat](https://newsboat.org))
so I'd have to migrate to an Android client that supports it.

I had some trouble trying to set this up, likely because it and its dependencies
are use Python 2.

## Resources

- [Self-Hosted Podcast](https://selfhosted.show):
  Great for getting ideas about the what, why, and how of self-hosting.
