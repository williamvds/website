+++
title = "Résumé"
aliases = ["resume"]
template = "cv.html"

[extra]
style = "cv.css"
+++

{% cv_skills() %}

### Software
C++, C, Java, C# (dotnet), Python, PHP, JavaScript, Haskell  

CMake, Boost, Apache Kafka

### Version control
Using Git, with GitHub, GitLab, and Bitbucket  
Using SVN

### Web frontend
With HTML, CSS  
Experience with Vue.js

### Platforms
GNU/Linux, Windows, macOS, iOS

### Databases
Using SQL, with PostgreSQL, Microsoft SQL server, MySQL, and Oracle

{% end %}

## {{icon(icon="briefcase")}} Work Experience {#experience}

{% cv_entry(
	id    = "sinara"
	title = "Software Engineer"
	org   = "Sinara"
	url   = "https://sinara.com"
	start = "2020-09-07"
) %}

At Sinara, I'm working on software for financial organisations, particularly
trading platforms and handling market data.

- Developed a multicast market data feed handler in C# (.NET Framework)
	- Created tools to support development and testing, including a market data
	  emulator that could simulate different scenarios, and market data
	  visualiser

- Worked on a trading platform for a major trading exchange as part of a
  technology modernisation project, developed in C++
	- Assisted in the design and implementation features, integrating the
	  platform with other systems within the exchange
	- Improved the existing build environment, making the edit-compile-run
	  loop significantly faster
	- Introduced development tools for catching bugs, and fixed issues that were
	  highlighted
	- Contributed to a simple FIX trading client used as a development tool

- Designed, implemented, and executed automated unit and integration tests, as
  well as quality assurance tests

- Wrote technical documentation to assist other developers, and user
  documentation intended for users and administrators
{% end %}

{% cv_entry(
	id    = "feral"
	title = "Game Programmer (Student Placement)"
	org   = "Feral Interactive"
	url   = "https://feralinteractive.com"
	start = "2018-06-18"
	end   = "2019-08-23"
) %}

As a developer at Feral I worked on bringing more games to __macOS__ and
__iOS__. 

- Delivered the bulk of the 64-bit port of [Total War: Shogun 2 for
  macOS](https://www.feralinteractive.com/en/games/shogun2tw), with similar
  patches used to later port other games in the franchise

- Assisted the release of [Tropico for
  mobile](https://www.feralinteractive.com/en/mobile-games/tropico), primarily
  working on the touch camera controls and improving performance

- Was heavily involved in the development of [Company of Heroes for
  iPad](https://www.feralinteractive.com/en/ios-games/companyofheroes),
  implementing many of the controls and UI changes needed to bring the game to
  touchscreens

I jumped into several large codebases - including multiple game engines
\- that were originally developed with Windows as the target platform.
I learned how to pick up new projects and explore and understand
them, being able to quickly start fixing bugs and implementing new features.

Using __C++__ throughout my placement earned me a deeper understanding of the
language, as I debugged and fixed cross-platform bugs including undefined
behaviour.  
To support development, I wrote a tools and libraries, including a generic
library for real-time strategy touch camera controls which was used in both
Tropico and Company of Heroes ports.

Being the main IDE for Apple platforms, I used __Xcode__ throughout my
placement, and also made extensive use of __LLDB__ to debug games
and fix obscure bugs.
{% end %}

## {{icon(icon="school")}} Education {#education}

{% cv_entry(
	id    = "uon"
	title = "BSc Hons Computer Science with Year in Industry"
	org   = "University of Nottingham"
	url   = "https://nottingham.ac.uk"
	start = "2016-09-26"
	end   = "2020-07-24"
) %}
__Graduated:__ 24th July 2020, first class
__Year averages:__ 1st: 88%, 2nd: 80.3%, 4th: 76.4%  
__Dissertation project:__ Mining and analysing public government data of
investment into research & innovation, applying some network and data analysis
techniques to explore relationships and collect statistics.

Some exam results I'm proud of:
- __Programming Paradigms • 99%__ As an introduction to the object-oriented and
  functional programming paradigms, I used Java to make a simple card-matching
  game, and Haskell to make simple but expressive programs
- __Programming & Algorithms • 94%__ I learnt the usage of pointers and manual
  memory management through learning C, as well as a variety of data structures
  and algorithms
{% end %}

## {{icon(icon="code-braces")}} Projects {#projects}

{% cv_project(
	id    = "microlator"
	name  = "Microlator"
	tech  = "C++ (17), CMake"
) %}
A C++ emulator library for the 6502 microprocessor, aiming to make the best use
of modern C++ and best practices.
{% end %}

{% cv_project(
	id="organisations"
	name="Organisations"
	tech="Lua, MySQL"
) %}
An addon for the game Garry's Mod. It allows players to create, join, and manage
groups within a game server. Players can set a bulletin, manage their members
and the group's bank account.
{% end %}

{% cv_project(
	id="business-site"
	name="A business site"
	tech="PHP, JavaScript, HTML5, CSS"
) %}
I created a minimal website that a business could use to provide contact
information and show off their services, supporting content in multiple
languages.  
PHP was used for routing and translating the website's content.
An adaptive CSS stylesheet makes the website usable on both desktop and mobile
devices.
Page transitions are performed through AJAX requests.
{% end %}

## {{icon(icon="pencil")}} Other interests {#other}

In my spare time I also enjoy archery, baking, and fiddling with open-source
software. Some of my open-source contributions can be found on my GitHub
profile.  
My personal computers and server run a distribution of GNU/Linux, so I've a good
understanding of how to install, use, and maintain such systems.  
I've completed some exercises on [Root Me](https://www.root-me.org/williamvds?lang=en) to test my knowledge of computer security and learn more about it.

## {{icon(icon="charity")}} Volunteer work {#volunteer}

{% cv_entry(
	id    = "coderdojo"
	title = "Volunteer"
	org   = "CoderDojo"
	url   = "https://coderdojo.com"
	date  = "2018-11-11"
) %}
I worked with CoderDojo at an event that introduced young people to technology
and software development.  
I supported attendees who learned about programming with Scratch and the BBC
micro:bit, as well as web design using HTML & CSS.
{% end %}
