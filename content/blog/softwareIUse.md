+++
title = "Software I Use"
description = """
A catalogue of software I use and how. I also go in to things I'd like to try or
improve in the future.
"""
slug="software-i-use"
date = 2020-05-22
+++

## Personal computers

You can find most of my configuration files {{ repo(name="config", text="here")
}}.

### Linux

My computers run a distribution of GNU/Linux, specifically [Arch
Linux](http://archlinux.org). It's the first distribution I installed and it's
served me well, so I haven't had any reason to try another.

Here's some things I like about it:

- The [Arch User Repository (AUR)](https://aur.archlinux.org) lets anyone
  provide the build scripts for creating packages that aren't in the main
  repositories. This makes it far easier to keep all your installed software in
  packages.
- Rolling releases: packages are updated shortly after upstream releases,
  meaning I can quickly get my hands on new features and bug fixes.
  It's been a surprisingly stable experience - the only time I ran into an issue
  after updating was while I was using the testing repositories.

### [Sway](https://swaywm.org)

A tiling window manager that uses the new Wayland protocol. It's mostly
compatible with the more well-known [i3 window manager](https://i3wm.org).
I started using tiling window managers about a year after I switched to
GNU/Linux, and it's tough to go back to a traditional one.

Here's some things I like about them:

- Configuration files are human-readable, hence easy to edit and store in
  version control
- Keyboard shortcuts are available for all actions I regularly perform
  (switching and organising windows, etc.)
- Assigning windows to virtual desktops and automatic layouts means almost no
  fussing about with window layouts, and I can easily get to the app I need
- They're relatively lightweight but heavily customisable (see the "ricing"
  subculture)

While I was on macOS at work, I tried using
[chunkwm](https://koekeishiya.github.io/chunkwm) to
recreate the tiling window manager experience. However, getting the window
manager set up was a frustrating task, and I never got it working reliably and
how I wanted it. Minor inconveniences like compulsory desktop transition
animations and key-binding limitations quickly add up to make a miserable
experience.  
chunkwm's author has more recently released a new window manager:
[yabai](https://github.com/koekeishiya/yabai). Hopefully that provides a better
experience, but for now, I just try to avoid macOS as much as possible.

### [Firefox](https://firefox.com)

I've been using Firefox since a bit before the 'Quantum' update. I'm happy to
say it's now a snappy and stable experience. Most settings can be controlled in
the human-readable [user.js](http://kb.mozillazine.org/User.js_file), and the
browser can be themed using [the userChrome CSS
files](https://www.userchrome.org).

Some extensions I recommend:

- [uBlock Origin](https://addons.mozilla.org/firefox/addon/ublock-origin): The only browser
  ad-block extension you should use.
- [uMatrix](https://addons.mozilla.org/firefox/addon/umatrix): uBlock, but
  provides granular controls for each website. I block pretty much everything by
  default so everything loads quickly, but some websites will require changing
  rules to load properly.
- [Decentraleyes](https://addons.mozilla.org/firefox/addon/decentraleyes):
  Stores a local copy of commonly used JavaScript libraries so you're not
  fetching them from Google or wherever.
- [Better Image Viewer](https://addons.mozilla.org/firefox/addon/better-image-viewer):
  Improves image viewing with stuff like scrolling to zoom and dragging to pan.
- [Dark Background Light
  Text](https://addons.mozilla.org/firefox/addon/dark-background-light-text):
  Adjusts the colours of webpages to make a dark mode for every website.
- [Multi-Account
  Containers](https://addons.mozilla.org/firefox/addon/multi-account-containers):
  Segregates your cookies and stuff into categories. Gives a privacy boost and
  is convenient when managing multiple accounts on a single website.
- [Hover Zoom+](https://addons.mozilla.org/firefox/addon/hover-zoom2): Hovering
  over links and thumbnails will show a maximised image/album/video.
- [Tab Center Redux](https://addons.mozilla.org/firefox/addon/tab-center-redux):
  Shows your tabs in the sidebar. Combine it with `userChrome` styles to make
  the most of your vertical monitor space. 
- [Invidition](https://addons.mozilla.org/firefox/addon/invidition): Redirect
  YouTube and Twitter to their lighter alternative frontends. Lets you avoid
  YouTube's region & age restrictions and Twitter's login barriers.

Things to improve:

- Replace Tab Center Redux with [Tree Style
  Tab](https://addons.mozilla.org/firefox/addon/tree-style-tab) to improve tab
  organisation.
- Fix screen-sharing in sway
- Get GPU acceleration working

### [Neovim](https://neovim.io)

Vim's yet another piece of software that's difficult to give up once you've
gotten into it. I picked it up when I was stuck in a university computer lab
with nothing else to do and typed `$ vimtutor`.
The learning curve is infamously harsh, but keep at it and you'll learn to use
a text editing model that you can keep using for the rest of your life, and
writing on computers will never be as mundane again.  
I chose to use the Neovim fork because of its refactoring efforts and its
ability to allow plugins to work asynchronously (though original Vim now also
supports this).

With a few plugins and tools Vim can also become a simple IDE, thanks to the
[Language Server
Protocol](https://microsoft.github.io/language-server-protocol).
Enabling code completion, refactoring, and searching is now trivial for
programming languages that have an existing tool that implements the protocol.  
If all else fails, most popular IDEs have an add-on that provide a Vim-lite
editing experience while maintaining all the useful features your IDE provides
you.

Things to improve:

- Replace coc.nvim with [ALE](https://github.com/dense-analysis/ale) or
  [deoplete-lsp](https://github.com/Shougo/deoplete-lsp). ALE also supports
  handy non-LSP tools like [ShellCheck](https://www.shellcheck.net).

### [Newsboat](https://newsboat.org)

A terminal RSS reader which can synchronise with my Nextcloud service. Heavily
customisable, just how I like it.

### [aerc](https://aerc-mail.org)

A simple terminal mail client. I swapped to aerc from
[NeoMutt](https://neomutt.org) as I preferred the simpler interface aerc goes
for. aerc handles IMAP and SMTP meaning so less configuration involved to get it
set up. It's got a fair number of features that make it easy to handle Git patch
requests and the like within the client. While I haven't yet used these features
it sounds useful for anyone involved in open source software development.  
I pair it with [OfflineIMAP](https://www.offlineimap.org) so I can keep a copy
of my emails locally on my computers.

Things to improve:

- Proper notifications on new emails
- Adjust appearance?

### [Bash](https://www.gnu.org/software/bash)

It's the standard GNU/Linux shell, so I prefer to use it whenever possible. With
a few configuration adjustments I think it stands up well to the competition
(I've also tried [zsh](https://www.zsh.org) and [fish](https://fishshell.com)).
Using it as a scripting language is a different story. Lots of subtle
behaviour and its limited feature set make it a hassle to create simple and
correct scripts. I'd recommend using another scripting language for more complex
scripts, or at least the very least using [ShellCheck](https://shellcheck.org)
religiously.  
I use an adjusted [Agnoster](https://github.com/speedenator/agnoster-bash)
theme for a cleaner and more detailed command prompt.

Things to improve:

- Find something equivalent to [fish's
  abbreviations](https://fishshell.com/docs/current/cmds/abbr.html): they'd make
  command completion for aliases much less of a hassle.

### [tmux](https://tmux.github.io)

A window manager for your terminal. I use tmux in much the same way as I do
sway, with sessions started automatically and programs launched in them. Ideally
I'd just use my actual window manager, but being able to connect remotely and
still have all my terminal sessions open is a killer feature I can't easily
recreate with sway.  
I've set up a few two-key bindings that are similar to the ones I use in sway;
I use the `Super` key modifier in sway, and `Alt` in tmux.

Things to improve:

- Show SSH connection and Git status in tmux bar (see
  [tmux-gitbar](https://github.com/arl/tmux-gitbar)) instead of the Bash command
  prompt.

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

## Resources

- [Self-Hosted Podcast](https://selfhosted.show):
  Great for getting ideas about the what, why, and how of self-hosting.
