+++
title = "William's blog"
description = """
My writings about things others might find interesting.
I'll probably focus on stuff I'm interested in, including software development
and free & open-source software.
"""
page_template = "blog_article.html"
sort_by = "date"
+++

{% for post in section.pages %}
  <h1><a href="{{ post.permalink }}">{{ post.title }}</a></h1>
{% endfor %}
