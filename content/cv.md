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

### Version control
Using Git, with GitHub and GitLab  
Using SVN

### Web frontend
With HTML(5), CSS  
Experience with Vue.js

### Platforms
Windows, GNU/Linux, macOS, iOS

### Databases
Using SQL, with PostgreSQL, Microsoft SQL server, and MySQL

{% end %}

## {{icon(icon="briefcase")}} Work Experience {#experience}

{% cv_entry(
	id    = "sinara"
	title = "Software Engineer"
	org   = "Sinara"
	url   = "https://sinara.com"
	start = "2020-09-07"
) %}
At Sinara I've been working on software for financial organisations, usually
with the .NET frameworks, including ASP.NET and MSSQL.  
I've gained experience using Visual Studio and other tools to develop for the
Windows platform.

Projects involved in:

- Market data feed handler: a highly concurrent system that handles multicast
  network traffic. I was involved in:
	- Developing tools to support development and testing: a tool for debugging
	  multicast connectivity, a market data visualisation tool, and a
	  controllable emulator of the system the handler connects to.
	- Designing, implementing and performing tests, including unit and
	  integration tests, as well as manual testing.
	- Implementing functionality, and correcting issues that arose during
	  development.
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
__iOS__, including [Total War: Shogun 2](https://www.feralinteractive.com/en/games/shogun2tw), [Tropico](https://www.feralinteractive.com/en/mobile-games/tropico), and [Company of Heroes](https://www.feralinteractive.com/en/ios-games/companyofheroes).  
By working on several large codebases I've gained the ability to jump into new
projects and rapidly understand them; a skill that allows me to quickly start
fixing bugs and implement new features.  
Using __C++__ throughout my placement has earned me an in-depth understanding of
it, which I've used to solve problems effectively on top of fixing issues such
as cross-platform bugs and undefined behaviour.  
I've learnt how to use __Xcode__ to develop for Apple platforms, and used
__LLDB__ extensively to debug large applications and fix obscure bugs.
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
(Work in progress).
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

{% cv_entry(
	id    = "LOSProgrammingClub"
	title = "Club Coordinator"
	org   = "The London Oratory School"
	url   = "https://www.london-oratory.org"
	start = "2015-12-01"
	end   = "2016-06-01"
) %}
Throughout the school year, I helped run a weekly Programming Club with about 30
attendees, aged 13–17.

I organised programming challenges for attendees to complete, and set up
Raspberry Pis for attendees to tinker with.  
During the club, I taught the basics of programming & algorithms, helping
attendees with the challenges and activities.

- __Communication skills:__ Teaching attendees improved my ability to
  communicate clearly and concisely
- __Teamwork:__ I and the other club organisers regularly collaborated to
  prepare activities & challenges and advertise the club
- __Organisation:__ Planning and organising activities developed my ability to
  manage my time, as I worked around my studies to help keep the club running
{% end %}

{% cv_entry(
	id    = "cruk"
	title = "Volunteer"
	org   = "Cancer Research UK"
	url   = "https://www.cancerresearchuk.org"
	start = "2014-01-01"
	end   = "2014-06-20"
) %}
I worked weekends at a local Cancer Research UK retail shop with other
volunteers.  I performed several roles, including working at the till,
organising the store, and managing stock.

- __Communication skills:__ Working at the till boosted my communication and
  people skills while ensuring that customers had a good experience with the
  charity
- __Teamwork & organisation:__ Working with other volunteers strengthened my
  team-working, as we shared multiple roles and performed different jobs,
  working together to meet sales goals
{% end %}
