+++
title = "Git from first principles"
description = """
A Git tutorial for both beginners and existing users, revealing all the magic by
starting from the underlying concepts that are often hidden away
"""
slug="learning-git"
date = 2021-05-15
draft = true

[extra]
table_of_contents = true
+++

## Introduction

Git is the best version control software I've used, but it's difficult to find a
tutorial that provides enough understanding. In this article I've tried to
create my own. Even if you've been using Git for a while, you might just learn a
thing or two from this - I certainly did while I was writing it. Git has a
reputation for being an enigma[,](https://xkcd.com/1597) but hopefully, after
reading this article, it will no longer be such a mystery. You might even
appreciate it a bit more, I dare say.

I believe understanding some of Git's internal concepts and mechanisms is
crucial for understanding how to use the tool as a whole. These details are
normally glossed over by most tutorials, and hidden by the user-friendly Git
commands and graphical Git clients. Without knowing what Git commands are doing,
it's easy to get lost when something goes wrong and not know how to recover.
Instead of hiding them, I'll explain the under-the-hood behaviour while teaching
the usual Git commands and day-to-day operations.

If you prefer video explanations over long text articles like this I'd recommend
The Missing Semester's lecture on Git,[^missing-semester-git] _Git For Ages 4
And Up_ for Git beginners,[^git-ages-4-up] or _Git From the Bits Up_ for those
who are more experienced.[^git-from-bits-up] This article takes inspiration from
these, but also tries to expand on what they didn't have time to cover.

### Why is Git?

Git was designed and created by Linus Torvalds, the same mind behind the Linux
kernel. It was intended to solve the version control woes experienced by
kernel developers at the time, with the goal of (among other things) being fully
distributed and resilient against corruption.

Having a distributed system is particularly important when your users are spread
around the world, working independently from each other, on different things at
different times. In Git's decentralised model, each user stores a copy of the
_repository_ on their local machine, which includes all versions of all files.

With the full version history accessible locally, explore, manipulate, and add
to it easily. You can save your changes without relying on an external server,
and so reorganise them at your leisure before sharing them with others. You can
pick a line in any file and find out who last changed it and their reasons for
doing so. The version history can be searched just like a directory on your
filesystem, along with change message provided with each version.

Sharing changes in Git is trivial: they can be sent as plain text, or downloaded
directly from another copy of the repository. Software developers will most
likely use popular Git platforms like GitHub, GitLab, and Bitbucket to share
their repositories, but most kernel developers simply send their changes in
plain text over email.[^linux-mail-archives]

<!--
### Git vs alternatives

If you've never used version control software like Git before, this section
might not make much sense to you - feel free to skip to the next section to
start learning Git.

- The good:
	- Cheap branching
	- Popularity (well-earned)
	- Granular commits
	- Cheap sub-repositories

- The bad:
	- More concepts = harder to learn
	- Merging conflicts
	- Bad at handling a lot of big files (full history = massive repo)
	  - git-annex and git-lfs as workarounds
	- Powerful command-line, but some commands and GUIs hide complexity and
	  prevent understanding
-->

## Getting started

Let's start by checking the standard Git help:

```
$ git help
usage: git [--version] [--help] [-C <path>] [-c <name>=<value>]
           [--exec-path[=<path>]] [--html-path] [--man-path] [--info-path]
           [-p | --paginate | -P | --no-pager] [--no-replace-objects] [--bare]
           [--git-dir=<path>] [--work-tree=<path>] [--namespace=<name>]
           <command> [<args>]

These are common Git commands used in various situations:

start a working area (see also: git help tutorial)
   clone             Clone a repository into a new directory
   init              Create an empty Git repository or reinitialize an existing one

work on the current change (see also: git help everyday)
   add               Add file contents to the index
   mv                Move or rename a file, a directory, or a symlink
   restore           Restore working tree files
   rm                Remove files from the working tree and from the index
   sparse-checkout   Initialize and modify the sparse-checkout

examine the history and state (see also: git help revisions)
   bisect            Use binary search to find the commit that introduced a bug
   diff              Show changes between commits, commit and working tree, etc
   grep              Print lines matching a pattern
   log               Show commit logs
   show              Show various types of objects
   status            Show the working tree status

grow, mark and tweak your common history
   branch            List, create, or delete branches
   commit            Record changes to the repository
   merge             Join two or more development histories together
   rebase            Reapply commits on top of another base tip
   reset             Reset current HEAD to the specified state
   switch            Switch branches
   tag               Create, list, delete or verify a tag object signed with GPG

collaborate (see also: git help workflows)
   fetch             Download objects and refs from another repository
   pull              Fetch from and integrate with another repository or a local branch
   push              Update remote refs along with associated objects

'git help -a' and 'git help -g' list available subcommands and some
concept guides. See 'git help <command>' or 'git help <concept>'
to read about a specific subcommand or concept.
See 'git help git' for an overview of the system.
```

All the commands listed above are called _porcelain_ commands; they are
high-level and user-friendly, and all you need when using Git day-to-day.
Porcelain commands use _plumbing_ to get stuff done under the hood. Plumbing are
a separate set of fundamental data structures and utilities. These terms an
analogy, comparing this dichotomy to the porcelain and plumbing found in a
bathroom: the pretty porcelain hides away the confusing plumbing, which you
usually don't want to think about.

I'll explain Git-specific terms as we get to them, but you can refer to the Git
glossary with `$ man gitglossary`[^gitglossary] for an explanation of any new
terms you come across.

## Creating a repository

A Git _repository_ is a directory with a specific structure and set of files,
storing all of the data Git needs.

To create a new Git repository, navigate to an empty directory and run `$ git
init`:

```
$ git init
$ tree -a
.
└── .git
    ├── branches
    ├── config
    ├── description
    ├── HEAD
    ├── hooks
    │   ├── applypatch-msg.sample
    │   ├── commit-msg.sample
    │   ├── fsmonitor-watchman.sample
    │   ├── post-update.sample
    │   ├── pre-applypatch.sample
    │   ├── pre-commit.sample
    │   ├── pre-merge-commit.sample
    │   ├── prepare-commit-msg.sample
    │   ├── pre-push.sample
    │   ├── pre-rebase.sample
    │   ├── pre-receive.sample
    │   ├── push-to-checkout.sample
    │   └── update.sample
    ├── info
    │   └── exclude
    ├── objects
    │   ├── info
    │   └── pack
    └── refs
        ├── heads
        └── tags
```

Git has now created a new hidden directory called `.git` - your new repository.

Your previously empty directory is known as your _working tree_ (a.k.a.
_worktree_ or _working tree_). It's a regular directory on your computer, but
Git will control its contents. Running Git commands will store the contents of
files from the working tree into the Git repository, as well as restore files
stored in the repository to the working tree.

When you run `$ git ...`, Git searches your current directory and its parents
for a valid repository in a `.git` directory.

I'll remove the `description` file and `hooks/` directory, since they're
optional. You can see that an empty repository is pretty simple:

```
.git
├── branches
├── config
├── HEAD
├── info
│   └── exclude
├── objects
│   ├── info
│   └── pack
└── refs
    ├── heads
    └── tags
```

The `config` file stores your repository-specific configuration - options set
with `$ git config` are stored in this file. To start off, set your username and
email, which will be saved along with the changes you make:

```bash
$ git config user.name William
$ git config user.email william@example.com

# The [user] section has been added
# The [core] section contains some internal Git configuration
$ cat .git/config
[core]
    repositoryformatversion = 0
    filemode = true
    bare = false
    logallrefupdates = true
[user]
    name = William
    email = william@example.com
```

I'll explain the rest of the files and directories as we get to them.

## Saving snapshots with commits

The purpose of version control is to store snapshots of a directory tree (in
this case the files within your working tree). Git stores these snapshots with
_commits_. Commits contain a snapshot of all the files, and some contextual
information, such as the author and a message to explain what was changed from
the previous snapshot.

Let's step through the process and explain how Git creates a commit. First,
let's check the current status of our working tree:

```bash
$ git status
On branch master

No commits yet

nothing to commit (create/copy files and use "git add" to track)
```

This tells us that:

1. We're on the default _branch_ of the repository, called `master`
2. We haven't _committed_ anything yet (i.e. Git hasn't saved any snapshots)
3. Our working tree has no changes that could be committed

I'll go into branches later. For now, let's create a small text file so our
commit has something to take a snapshot of:

```bash
$ echo "Some contents" > file1.txt

$ git status
On branch master

No commits yet

Untracked files:
  (use "git add <file>..." to include in what will be committed)
        file1.txt

nothing added to commit but untracked files present (use "git add" to track)
```

Git helpfully tells us that we need to `add` `file1.txt` for Git to _track_ it
(i.e. include it in snapshots) so let's do that:

```bash
$ git add file1.txt
$ git status
On branch master

No commits yet

Changes to be committed:
  (use "git rm --cached <file>..." to unstage)
        new file:   file1.txt
```

Using `$ git add` has added `file1.txt` to the _staging area_. It tracks the
contents that will be saved in the next snapshot, which can differ from the
contents of your working tree. This is handy when you've made several unrelated
changes in your working tree, and you want to save them as separate commits.
Think of the staging area as a virtual working tree contained within the
repository - running `$ git add` copies the contents of files from your working
tree into the staging area. When you create a commit, Git saves a copy of the
staging area as the snapshot of the directory.

The status now shows `file1.txt` under "Changes to be committed", indicating
that it is _staged_. You could also have changes in tracked files that aren't
staged yet, in which case they would be listed under "Changes not staged for
commit".

<!--
TODO: diagram here

[ repository [ staging area [ file1.txt "Some contents" ] ] ]
^
| git add file1.txt 
|
[ worktree [ file1.txt "Some contents" ] ]
-->

When you add content to the staging area, Git immediately saves it -
specifically, it saves a snapshot of each file in the staging area. After `$ git
add`ing `file1.txt`, some new things are added to the repository:

```
.git
├── branches
├── config
├── HEAD
├── index
├── info
│   └── exclude
├── objects
│   ├── 1e
│   │   └── d6543483aafc93c5323daea1860bd7a29857d4
│   ├── info
│   └── pack
└── refs
    ├── heads
    └── tags
```

We now have two new files: `index`, and a file in `objects` known as an
_object_.  There are three different types of Git objects: _blobs_, _trees_, and
_commits_.  The file in `objects/1e/` is a blob: this type contains metadata and
the (compressed) contents of a file. In this case it's the contents of
`file1.txt` when you `$ git add`ed it.

The full name of an object starts with the name of the subdirectory it's
contained in. You can check the contents of the blob by using `$ git show`.

```bash
# Prepend the "1e" from the subdirectory
$ git show 1ed6543483aafc93c5323daea1860bd7a29857d4
Some contents
```

If you've been running these commands yourself, you might notice that the name
of the object is different in your repository - that's likely because you didn't
put exactly the same contents in your `file1.txt`, or the metadata
might be different if you're using a different version of Git. The object's
name (and hence file path) is actually a _hash_ of its contents. The hash
represents the contents of the object with a unique fixed-length string. Due to
the additional metadata in the object, it won't simply be the hash of the
contents of `file1.txt`. As of writing, the hash algorithm used is SHA-1, but
Git is switching to SHA-256 in the near future.[^git-sha256-switch]

<!-- {% note %} -->
Note that you don't need to specify the object's full name in these commands.
Git can work with the prefix of a name, as long as there's no ambiguity:

```bash
$ git show 1ed6
Some contents
```
<!-- {% end %} -->

The `index` file stores that state of the staging area. It tracks the state of
files in your working tree, including the associated staged blob for each file,
and some additional information like Unix file permissions. Git documentation
often refers to the index and "staging area" interchangeably.

You can inspect the staging area with the plumbing command `$ git ls-files`:

```bash
$ git ls-files --stage
100644 1ed6543483aafc93c5323daea1860bd7a29857d4 0       file1.txt
```

Let's finalise our commit, attaching a description for this snapshot with the
`--message` option:

```bash
$ git commit --message "Commit 1"
[master (root-commit) d8bcda2] Commit 1
 1 file changed, 1 insertion(+)
 create mode 100644 file1.txt

$ git status
On branch master
nothing to commit, working tree clean
```

Let's run `$ git show` to see the last commit that we just created:

```git
$ git show
commit d8bcda2bb26dfbd50c6f07e4aabb1aef9be44594 (HEAD -> master)
Author: William <william@example.com>
Date:   Wed Mar 10 21:24:32 2021 +0000

    Commit 1

diff --git a/file1.txt b/file1.txt
new file mode 100644
index 0000000..1ed6543
--- /dev/null
+++ b/file1.txt
@@ -0,0 +1 @@
+Some contents
```

Great! Git has created a _commit_ object:

- named `d8bc...`
- created by myself
- at a certain date and time
- containing a file called `file1.txt` with the contents `Some contents`.

Let's peek into the repository again to see what's changed:

```
$ tree .git
.git
├── branches
├── COMMIT_EDITMSG
├── config
├── HEAD
├── index
├── info
│   └── exclude
├── logs
│   ├── HEAD
│   └── refs
│       └── heads
│           └── master
├── objects
│   ├── 1e
│   │   └── d6543483aafc93c5323daea1860bd7a29857d4
│   ├── d8
│   │   └── bcda2bb26dfbd50c6f07e4aabb1aef9be44594
│   ├── fe
│   │   └── 89dfe71214c0d45973c551c45a449b3b2f49f7
│   ├── info
│   └── pack
└── refs
    ├── heads
    │   └── master
    └── tags
```

There's a lot more data in the repository now, so let's go through it.

`COMMIT_EDITMSG` is the file you edit to enter the commit message. It will be
cleared for the next commit, but for now the message for the last commit
remains.

We can inspect the objects that were created with another Git plumbing command,
`$ git cat-file`:

```bash
# Get the type (-t) of the object

$ git cat-file -t fe89
tree

# Print (-p) its contents

$ git cat-file -p fe89
100644 blob 1ed6543483aafc93c5323daea1860bd7a29857d4    file1.txt
```

Here we see Git has created a new type of object, a _tree_. Trees refer to a
collection of blobs and other trees. For each blob entry, the tree stores:

- the name of the blob
- the name of the file the blob stores the contents of
- the associated Unix file permissions

For each subtree entry, the tree stores:

- the name of the tree
- the name of the directory the tree stores the contents of

Thus trees represent a single directory, including its files and subdirectories.
This tree in particular represents the root of our repository, which only
contains a single file: `file1.txt`.

And now for the final object:

```bash
$ git cat-file -t d8bc
commit

$ git cat-file -p d8bc
tree fe89dfe71214c0d45973c551c45a449b3b2f49f7
author William <william@example.com> 1615411472 +0000
committer William <william@example.com> 1615411472 +0000

Commit 1
```

As you might have noticed, this is the object referenced by the earlier `$ git
show`; it represents the new commit. Commit objects primarily contain:

- a reference to the tree for the root directory of this snapshot (i.e. the
  same as the root as the working tree)
- the author and committer along with the date and time that each occurred
- the commit message
- a reference to the parent commit(s). This commit has no parents since it is
  the first commit in the repository

The author and committer are separate entries to support situations where one
person creates a snapshot and shares it with someone else, who then creates a
commit from it in their repository. Storing the author's identity keeps their
name attributed to the snapshot.

Git generated the commit's tree from the index. In this case, it's created a
single tree for the root directory, which contains only
`file1.txt`. When there are staged files in subdirectories, index entries are
collected together to form a tree for each directory. Each tree is linked to the
trees that represent their subdirectories, ultimately forming the root tree
which represents the full snapshot of the directory at the time of the commit.

<!-- TODO: diagram? -->

Other information in the commit can either come from you (i.e. the commit
message), or be inferred, such as the author/committer's name and email, and the
date and time of the commit.

With commits, we have a way of tracking snapshots of the repository and a way of
saving some contextual information about said snapshots, which serves the
fundamental purpose of a version control system. The rest of Git is primarily
for manipulating objects so that they can represent more than a simple linear
history, and to support collaboration between multiple users.

Normally you'll only be concerned with commits. You can run `$ git log` to list
the "current" commit followed by its ancestors. Right now it'll show the first
commit, `d8bcda2`:

```gitlog
$ git log
commit d8bcda2bb26dfbd50c6f07e4aabb1aef9be44594 (HEAD -> master)
Author: William <william@example.com>
Date:   Wed Mar 10 21:24:32 2021 +0000

    Commit 1
```

### Showing your changes

`$ git status` lists the files that have been changed between the previous
commit and both the working tree and the current staging area. You can use `$
git diff` to see a detailed list of the lines that have been changed in each
file. Remember that, at this point, the staging area matches the previous
commit:

```bash
# Edit file1.txt

$ echo "A new line" >> file1.txt

# Create file2.txt

$ echo "Some contents" > file2.txt

$ git status
On branch master
Changes not staged for commit:
  (use "git add <file>..." to update what will be committed)
  (use "git restore <file>..." to discard changes in working directory)
        modified:   file1.txt

Untracked files:
  (use "git add <file>..." to include in what will be committed)
        file2.txt

no changes added to commit (use "git add" and/or "git commit -a")

$ git diff
diff --git a/file1.txt b/file1.txt
index 1ed6543..ff709a8 100644
--- a/file1.txt
+++ b/file1.txt
@@ -1 +1,2 @@
 Some contents
+A new line
```

The _diff_ lists lines that have changed between two versions of the same file.
New lines are prefixed with `+`, and removed lines with `-`. If multiple parts
of a file have been changed, the diff will group them into distinct _hunks_,
which encapsulate changes in nearby lines, with some unchanged lines for
additional context.

<!-- TODO: look at
http://www.gnu.org/software/diffutils/manual/html_node/Hunks.html for
definition of hunk -->

You can see that the diff references the staged blob for `file1.txt`, `1ed6543`,
as well as a new blob name `ff709a8`. The new blob name is calculated from the
file in the working tree, but is not actually saved as an object in the
repository yet - a `$ git add file1.txt` would result a blob with the name
`ff709a8...` being created.

By default the diff shows changes between the staging area and the working tree,
and excludes untracked files like `file2.txt`. If we stage all changes, the
staging area will match the working tree, and so a normal `$ git diff` won't
display anything: 
```bash
$ git add .

$ git status
On branch master
Changes to be committed:
  (use "git restore --staged <file>..." to unstage)
        modified:   file1.txt
        new file:   file2.txt

$ git diff

# No difference between staging area and working tree, so no diff is shown
```

We can instead use `$ git diff --staged` to specify that we want to see the
changes that we have staged. That means the differences between the last
commit's tree and the staging area:

```diff
$ git diff --staged
diff --git a/file1.txt b/file1.txt
index 1ed6543..ff709a8 100644
--- a/file1.txt
+++ b/file1.txt
@@ -1 +1,2 @@
 Some contents
+A new line
diff --git a/file2.txt b/file2.txt
new file mode 100644
index 0000000..1ed6543
--- /dev/null
+++ b/file2.txt
@@ -0,0 +1 @@
+Some contents
```

If you were to create a commit right now and then run `$ git show`, this same
diff would be shown under the commit.

Here's a graph to visualise the commands and the current states of the working
tree, index, and the tree of the current HEAD. The red lines represent what the
commands are comparing:

![
The working tree is a table listing file1.txt next to the blob name ff709a8, and
file2.txt next to 1ed6543. The repository is shown as a box containing the index
(a table that matches the working tree), HEAD, and a set of objects. HEAD points
to commit d8bcda2, which points to tree fe89dfe, which has an entry for
file1.txt which points to blob 1ed6543.
A red line connecting the working tree and the index is labelled with "git
diff". Another red line connecting the index and tree fe89dfe is labelled with
"git diff --staged".
](diff-comparisons.svg
"Graph showing the diff commands and what they compare")


### Skipping the staging area

If the staging area is inconvenient or unnecessary, you can use `$ git commit
--all`. This will immediately stage all tracked files as they currently are in
the working tree, and commit them. Note that you still need to use `$ git add`
to track new files that you're committing for the first time.

### Staging hunks within a file

A common situation is having made several changes in your working tree and later
realising you could split them up into several commits. E.g. you've fixed
multiple bugs within a single source file. The staging area gives you the power
to precisely control what goes into a snapshot, and this power makes it easier
to keep commits self-contained. You can make sure each commit includes changes
that serve a single purpose, that the project still builds correctly, and that
all tests still succeed.

If you have multiple changes in a single file and want to split them into
different commits, you can stage only a subset of your changes with `$ git add
--patch`:

```bash
$ echo -e "First line\nSome contents\nLast line" > file1.txt
$ cat file1.txt
First line
Some contents
Last line

$ git add --patch file1.txt
diff --git a/file1.txt b/file1.txt
index 1ed6543..4a9a39f 100644
--- a/file1.txt
+++ b/file1.txt
@@ -1 +1,3 @@
+First line
 Some contents
+Last line
(1/1) Stage this hunk [y,n,q,a,d,s,e,?]?
```

This interactive form goes through each hunk in your diff in the file(s) we want
to stage, letting us choose what we want to do with it. If you ask for help with
`?`, here are your options:

```
y - stage this hunk
n - do not stage this hunk
q - quit; do not stage this hunk or any of the remaining ones
a - stage this hunk and all later hunks in the file
d - do not stage this hunk or any of the later hunks in the file
s - split the current hunk into smaller hunks
e - manually edit the current hunk
? - print help
```

The most important ones are, unsurprisingly `y` and `n`, for "yes" and "no".
`s` will let you split a hunk up if it has unchanged lines between changes,
which can be handy if Git hasn't managed to split the diff up the way you want
it:

```diff
(1/1) Stage this hunk [y,n,q,a,d,s,e,?]? s
Split into 2 hunks.
@@ -1 +1,2 @@
+First line
 Some contents
(1/2) Stage this hunk [y,n,q,a,d,j,J,g,/,e,?]? y
@@ -1 +2,2 @@
 Some contents
+Last line
(2/2) Stage this hunk [y,n,q,a,d,K,g,/,e,?]? y
```

If you want to change the contents of the hunk, you can use `e` to edit it
manually:

```diff
diff --git a/file1.txt b/file1.txt
index 1ed6543..4a9a39f 100644
--- a/file1.txt
+++ b/file1.txt
@@ -1 +1,3 @@
+First line
 Some contents
+Last line
(1/1) Stage this hunk [y,n,q,a,d,s,e,?]? e
```

The following will open in your editor. I've manually added the line containing
`+Another line`:

```diff
# Manual hunk edit mode -- see bottom for a quick guide.
@@ -1 +1,3 @@
+First line
 Some contents
+Another line
+Last line
# ---
# To remove '-' lines, make them ' ' lines (context).
# To remove '+' lines, delete them.
# Lines starting with # will be removed.
# 
# If the patch applies cleanly, the edited hunk will immediately be
# marked for staging.
# If it does not apply cleanly, you will be given an opportunity to
# edit again.  If all lines of the hunk are removed, then the edit is
# aborted and the hunk is left unchanged.
```

After saving and quitting, you can see that your hunk has been staged without
changing the file in your working tree:

```bash
# The staged diff shows "Another line" that was added by editing the hunk

$ git diff --staged
diff --git a/file1.txt b/file1.txt
index 1ed6543..77ef57a 100644
--- a/file1.txt
+++ b/file1.txt
@@ -1 +1,4 @@
+First line
 Some contents
+Another line
+Last line

# Comparing the working tree to the staging area, "Another line" is shown as
# removed, as editing the hunk didn't change the file in the working tree

$ cat file1.txt
First line
Some contents
Last line

$ git diff
diff --git a/file1.txt b/file1.txt
index 1ed6543..77ef57a 100644
--- a/file1.txt
+++ b/file1.txt
@@ -1 +1,4 @@
 First line
 Some contents
-Another line
 Last line
```

### Restoring after changes

If you've staged something and later decided you don't want to include it in the
next commit, you can use `$ git restore --staged` to reset the staging area to
match the last commit:

```bash
$ git status
On branch master
Changes to be committed:
  (use "git restore --staged <file>..." to unstage)
        modified:   file1.txt

Changes not staged for commit:
  (use "git add <file>..." to update what will be committed)
  (use "git restore <file>..." to discard changes in working directory)
        modified:   file1.txt

$ git restore --staged .
On branch master
Changes not staged for commit:
  (use "git add <file>..." to update what will be committed)
  (use "git restore <file>..." to discard changes in working directory)
        modified:   file1.txt

no changes added to commit (use "git add" and/or "git commit -a")
```

<!--
TODO: another diagram here

[ repository
	[ staging area [ file1.txt "Some contents" ] ]
      ^              ^
      |              | git restore -staged
      |      [ tree [ file1.txt "Some contents" ] ] ]
      |                    |
      | git add            | git restore file1.txt
      |                    v
[ worktree [ file1.txt "Some contents"        ] ]
-->

Use the `--patch` option to interactively pick which hunks to unstage,
similar to `$ git add`.
You can use `$ git restore` to restore the contents of the files in your working
tree, but note that this will delete your changes from the working tree, which
may not have been saved in the repository if you haven't staged or committed it.

Finally, if you want to remove a file in a commit, you can remove the file from
your working tree and subsequently `$ git add` to stage the removal, or simply
use `$ git rm` to remove and stage in one command.

## refs: heads, tags and HEAD

A _ref_ is an alias for a specific commit or another ref, which are more
user-friendly to use than full commit names. These are stored in files under
`.git/refs`, each containing either a full commit name or the name of another
ref. They can be used in Git commands instead of commit names.

_Tags_ are user-specified refs, contained in `.git/refs/tags`. They're typically
used to mark significant commits with a user-friendly name, such as labelling
the commit used for a specific software release with "v1.0". 

To create a new tag, use `$ git tag`:

```git
$ git tag first

$ cat .git/refs/tags/first
d8bcda2bb26dfbd50c6f07e4aabb1aef9be44594

$ git show first
commit d8bcda2bb26dfbd50c6f07e4aabb1aef9be44594 (HEAD -> master, tag: first)
Author: William <william@example.com>
Date:   Wed Mar 10 21:24:32 2021 +0000

    Commit 1

diff --git a/file1.txt b/file1.txt
new file mode 100644
index 0000000..1ed6543
--- /dev/null
+++ b/file1.txt
@@ -0,0 +1 @@
+Some contents
```

`$ git show` lists the refs associated with a commit next to its name. In
this case it's showing that refs `HEAD`, `master`, and the tag `first` point to
the first commit in the repository.

A _head_ (lowercase) points to a commit that is the "tip" of a branch. Branches
represent a "line of development". When you add a commit while on a branch, Git
automatically updates the 'head' ref of a branch to point to the new commit, so
the "tip" is maintained. "Branch" and "head" are sometimes used interchangeably
in Git documentation. I'll expand on branches in the next section.

Heads are stored in `.git/refs/heads`. For example, `heads/master` tracks Git's
default branch, `master`. Right now, it contains the name of the first commit
object that was created.

_HEAD_ (uppercase) is a special ref that tells Git which commit will be the
parent of the next commit. It will normally point to a head, e.g. `master`,
which is what the `HEAD -> master` represents in the previous `$ git show`:

```
$ cat .git/HEAD
ref: refs/heads/master
```

So when HEAD is pointing to `heads/master`, that means you are on branch
`master`, and creating a new commit will move `heads/master` to point to it.
When HEAD is pointing to a specific commit instead of a branch, this is known as
being in a "detached HEAD" state. You can resolve this situation by manually
manipulating your HEAD, which will be covered later.

Most Git commands will default to using HEAD as their argument, including `$ git
tag`. You could specify any commit by name or by ref if you wanted, e.g. `$ git
tag d9bcd` or `$ git tag HEAD`.

Objects and refs are the two foundational components of Git: all operations
involve manipulating some combination of the two.

## Branches {#branches}

The link between commits is that a commit refers to its parent(s) - this means a
commit can have any number of "children". Through this, your commit history can
diverge by having a commit with several children, and be rejoined later by a
commit with several parents. These separate chains of commits are called
_branches_, and they allow you to to create multiple chains of commits that
exist in parallel.

Git's default branch is called `master`, but its name is configurable and so may
vary between platforms and teams. Branching conventions also vary, so some
repositories might use their default branch for active development, while others
may only update it with each release to end-users. See [further
reading](#further-reading) for some examples.

You can add and list branches with `$ git branch`, and switch which one you're
with `$ git switch`:

```bash
# Create a new branch from the current HEAD, call it "my-branch"
$ git branch my-branch
$ git branch
* master
  my-branch

$ tree .git/refs/heads
.git/refs/heads/
├── master
└── my-branch

$ cat .git/refs/heads/*
d8bcda2bb26dfbd50c6f07e4aabb1aef9be44594
d8bcda2bb26dfbd50c6f07e4aabb1aef9be44594

$ cat .git/HEAD
ref: refs/heads/master

$ git switch my-branch
Switched to branch 'my-branch'

$ cat .git/HEAD
ref: refs/heads/my-branch
```

At this point we have a single commit, which is pointed to by the heads of both
`master` and `my-branch` and the tag `first`. It is also currently our HEAD.

![
A graph displaying the current state commit history of the repository. A single
box labeled d8bcda2 has 3 labels pointing at it: heads/master, tags/first, and
heads/my-branch. Another label, HEAD, points to heads/my-branch.
](branch.svg
"Graph of the commit history after creating the new
branch")

The above diagram represents the current commit history of the repository - in
this case, just a single box for the first commit. The labels without boxes
represent the current refs: the heads for `master` and the new branch
`my-branch`, the tag `first`, and finally `HEAD`. These point to the contents of
the ref, i.e. another ref or a commit.

Let's add a new commit while we're on `my-branch`:

```bash
# Use the --allow-empty option so we don't need to commit any changes
$ git commit --allow-empty --message "Commit 2"
[my-branch 6679b16] Commit 2

$ cat .git/HEAD
ref: refs/heads/my-branch

$ cat .git/refs/heads/master
d8bcda2bb26dfbd50c6f07e4aabb1aef9be44594

$ cat .git/refs/heads/my-branch
6679b1647570256d0219cd4b5fda500aba4cc203

# List HEAD followed by its chain of ancestors
# --oneline gives us a single-line summary
$ git log --oneline
d86ecf9 (HEAD -> master) Commit 3
d8bcda2 (tag: first) Commit 1
```

Now we've got a new commit, `6679b16`, whose parent is `d8bcda2`. Since HEAD
was pointing to `heads/my-branch`, Git updated this head to point to the new
commit, so it continues to track the tip of the branch. Note that
`heads/master` and `tags/first` both continue to point to the original commit
`d8bcda2`, and `HEAD` still points to `heads/my-branch`:

![
The commit history after the new commit on my-branch. A new commit labeled
6679b16 points to d8bcda2. The ref heads/my-branch has moved to point to the new
6679b16, and HEAD continues to point to heads/my-branch. The refs heads/master
and tags/first still point to d8bcda2.
](branch-commit.svg
"Graph of the commit history after creating a new commit on my-branch")

Note that in the diagram, `6679b16` points to its parent - it is the child
commit which refers to its parent(s), not the other way around.


Let's switch back to `master` and create another commit:

```bash
$ git switch master
Switched to branch 'master'

$ git commit --allow-empty --message "Commit 3"
[master d86ecf9] Commit 3
```

![
The commit history after the new commit on master. A new commit labeled d86ecf9
points to d8bcda2. The ref heads/master points to the new commit, and HEAD
points to heads/master. heads/my-branch continues to point to 6679b16, and
tags/first continues to point to d8bcda2.
](branch-second-commit.svg
"Graph of the commit history after creating a new commit on master")


At this point, `master` and `my-branch` have _diverged_: they both contain
commits that the other does not.

Branches are useful for separating changes that are a work-in-progress, like
implementing a new feature to your application. Working on a separate branch
avoids disrupting others with your potentially broken changes, and also avoids
collisions between branches until you're ready to _merge_ your changes.

### Merge commits

Once you're happy with the state of your branch and want to share your changes,
you can rejoin your branch to `master` (or any other branch). This is done with
`$ git merge`, which will create a new commit with multiple parents to
effectively join another diverged branch into your current branch.

```bash
$ git log --oneline
d86ecf9 (HEAD -> master) Commit 3
d8bcda2 (tag: first) Commit 1

# The merge command shares several options with commit, including --message

$ git merge my-branch --message "Merge 2 & 3"
Already up to date!
Merge made by the 'recursive' strategy.

$ git log --oneline
f0d4fc5 (HEAD -> master) Merge 2 & 3
d86ecf9 Commit 3
6679b16 (my-branch) Commit 2
d8bcda2 (tag: first) Commit 1

$ git cat-file -p f0d4
tree fe89dfe71214c0d45973c551c45a449b3b2f49f7
parent d86ecf96bff640145dfd49a54a3e6562652827c7
parent 6679b1647570256d0219cd4b5fda500aba4cc203
author William <william@example.com> 1615760035 +0000
committer William <william@example.com> 1615760035 +0000

Merge 2 & 3
```

![
The commit history after the merge. A new commit labeled f0d4fc5 points to both
6679b16 and d86ecf9. The ref heads/master points to the new commit, and HEAD
points to heads/master. heads/my-branch continues to point to 6679b16, and
tags/first continues to point to d8bcda2.
](branch-merge.svg
"Graph of the commit history after merging my-branch into master")

After merging, `master` has another new commit `f0d4`, which has two parents
from different branches: `6679` from `my-branch` and `d86e` from `master`. This
single merges the commits from `my-branch` into `master` - such commits are
called _merge commits_. The merge commit message comes from the message
specified in the `$ git merge` command. The head of `my-branch` remains pointed
to `6679`, as the merge commit was made on the `master` branch, so we say that
`my-branch` has been merged into `master`.

At this point you could continue to add new commits on `my-branch` and `master`,
and they could be merged together again later.

`$ git log` has a built-in graph feature to help you visualise branches and
merges in history:

```bash
$ git log --oneline --graph
*   f0d4fc5 (HEAD -> master) Merge 2 & 3
|\
| * 6679b16 (my-branch) Commit 2
* | d86ecf9 Commit 3
|/
* d8bcda2 (tag: first) Commit 1
```

Asterisks represent individual commits, and the connecting lines show their
parents. You can add the `--all` option to display commits from all branches,
rather than solely the ancestors of your current HEAD.


At this point you can delete your branch:

```bash
$ git branch --delete my-branch
Deleted branch my-branch (was 6679b16).

$ git log --oneline --graph
*   f0d4fc5 (HEAD -> master) Merge 2 & 3
|\
| * 6679b16 Commit 2
* | d86ecf9 Commit 3
|/
* d8bcda2 (tag: first) Commit 1
```

![
The commit history after deleting my-branch. The graph is identical to the
previous, but the label for heads/my-branch has been removed.
](branch-delete.svg
"Graph of the commit history after deleting my-branch")

Notice that the log still displays the separate branches in history - this is
thanks to the merge commit. Git traverses both parents of the merge to
show the point at which `master` and the other branch diverged, and shows that
they were merged again. However, the head for `my-branch` has been removed.

### Fast-forward merging {#fast-forward}

Sometimes a merge commit isn't necessary - for example, when merging branches
that haven't diverged. In such cases, Git can simply adjust the head of the
destination branch to match the branch being merged. These merges are known
as _fast-forwards_, and Git can automatically detect when it's possible and
apply this when you run `$ git merge`.

For an example, let's create a new commit on another branch:

```bash
# Create my-branch again and switch to it

$ git switch --create my-branch
Switched to a new branch 'my-branch'

$ git commit --allow-empty --message "Commit 4"
[my-branch 83ff9ad] Commit 4

# Switch back to master

$ git switch master
Switched to branch 'master'
```

![
The commit history after the merge. A new commit labeled d86ecf9 points to
f0d4fc5. The ref heads/my-branch points to the new commit, while the ref
heads/master and HEAD still point to f0d4fc5.
](fast-forward-before.svg
"Graph of the commit history after creating a new commit on my-branch")


Now we have a single new commit on `my-branch`, pointing to the current head of
`master`, meaning these two branches have not diverged. Let's merge `my-branch`
into `master` once more:

```bash
$ git merge my-branch
Updating f0d4fc5..83ff9ad
Fast-forward

$ git log --oneline --graph
* 83ff9ad (HEAD -> master, my-branch) Commit 4
*   f0d4fc5 Merge 2 & 3
|\
| * 6679b16 Commit 2
* | d86ecf9 Commit 3
|/
* d8bcda2 (tag: first) Commit 1
```

![
The commit history after the merge. HEAD now points to heads/master, which
points to the new commit 83ff9ad.  f0d4fc5. The ref heads/my-branch also points
to f0d4fc5, and has not changed.
](fast-forward.svg
"Graph of the commit history after merging my-branch into master again, this
time with a fast-forward.")

Git has automatically determined that the branches haven't diverged, and so a
fast-forward was performed instead of creating a merge commit.

`$ git merge` lets you control its strategy with a few options:

- `--ff`: Create a merge commit if the branches have diverged,
  otherwise fast-forward. This is the default behaviour.
- `--no-ff`: Always create a merge commit.
- `--ff-only`: Only fast-forward. If the branches have diverged, the
  merge fails.

Finally, let's delete `my-branch` again, since we're finished with it:

```bash
# Delete my-branch again

$ git branch --delete my-branch Deleted branch my-branch (was 83ff9ad).
```

Fast-forwarding saves us from creating merge commits when they're unnecessary,
which can help keep the commit history tidy. However, without a merge commit to
indicate that a merge has taken place, the fact the merged branch existed is
hidden. This may or may not be desirable, so it's worth thinking about when
deciding between a normal merge and a fast-forward:

![
The commit history after the merge. A new commit labeled d86ecf9 points to
f0d4fc5. The ref heads/my-branch points to the new commit, while the ref
heads/master and HEAD still point to f0d4fc5. tags/first continues to point to
d8bcda2.
](fast-forward-delete.svg
"Graph of the commit history after merging my-branch into master with a
fast-forward, then deleting my-branch")

### Cherry-picking commits {#cherry-pick}

If there's a single commit in another branch that you want to incorporate into
your branch, you can copy it using `$ git cherry-pick`. This will take the diff
of the target commit (i.e. only the changes introduced in that commit) and apply
it to your current working tree, then create a new commit copying the target's
message and author.

Take a situation where you have a number of commits in another branch:

```bash
# Create a new branch

$ git switch --create cherrypick-from
Switched to a new branch 'cherrypick-from'

# Create two commits, the first one is empty

$ git commit --allow-empty --message "Cherry-pick 1"
[cherrypick-from 7b4d6dd] Cherry-pick 1

# Whilst the second one adds a new file called file2.txt

$ echo "Some contents" > file2.txt
$ git add file2.txt
$ git commit --all --message "Cherry-pick 2"
[cherrypick-from 4de8826] Cherry-pick 2
 1 file changed, 1 insertion(+)
 create mode 100644 file2.txt

# Resulting in the following history:

$ git log --oneline --graph --all
* 4de8826 (HEAD -> cherrypick-from) Cherry-pick 2
* 7b4d6dd Cherry-pick 1
* 83ff9ad (master) Commit 4
*   f0d4fc5 Merge 2 & 3
|\
| * 6679b16 Commit 2
* | d86ecf9 Commit 3
|/
* d8bcda2 (tag: first) Commit 1
```

![
The commit history after creating two new commits on the cherrypick-from branch.
Two new commits have been added: 4de8826 which points to d8bcda2, and 7b4d6dd
which points to 4de8826. The ref heads/cherrypick-from points to the newest
commit 7b4d6dd, while the ref heads/master and HEAD continue to point to
83ff9ad.
](cherrypick-before.svg
"The commit history after creating two new commits on the cherrypick-from
branch.")

Now we have a couple of commits that are only on branch `cherrypick-from`. If we
want to include only one of these commits in another branch, we can cherry-pick
to copy it. For example, let's create a new branch based on `master` and copy
the "Cherry-pick 2" commit which creates `file2.txt`:

```bash
# Create and switch another branch based off master, called cherrypick-to

$ git switch --create cherrypick-to master
Switched to branch 'cherrypick-to'

# Cherry-pick 7b4d6dd: "Cherry-pick 2"

$ git cherry-pick 7b4d6dd
[cherrypick-to 6a8f027] Cherry-pick 2
 Date: Sun Apr 11 13:48:31 2021 +0100
 1 file changed, 1 insertion(+)
 create mode 100644 file2.txt

$ cat file2.txt
Some contents

$ git log --oneline --graph --all
* 6a8f027 (HEAD -> cherrypick-to) Cherry-pick 1
| * 7b4d6dd (cherrypick-from) Cherry-pick 2
| * 4de8826 Cherry-pick 1
|/
* 83ff9ad (master) Commit 4
*   f0d4fc5 Merge 2 & 3
|\
| * 6679b16 Commit 2
* | d86ecf9 Commit 3
|/
* d8bcda2 (tag: first) Commit 1
```

![
The commit history after cherrypicking "Cherry-pick 1" from the branch
cherrypick-from to the branch cherrypick-to.
Two new commits have been added: 4de8826 which points to d8bcda2, and 7b4d6dd
which points to 4de8826. The ref heads/cherrypick-from points to the newest
commit 7b4d6dd, while the ref heads/master and HEAD continue to point to
83ff9ad.
](cherrypick.svg
"The commit history after cherrypicking \"Cherry-pick 1\" from the branch
cherrypick-from to the branch cherrypick-to")


Now a "Cherry-pick 2" commit also exists `cherrypick-to`, which has added the
new `file2.txt`. Note that the cherry-picked commit has a different hash from
the original, indicating that they are distinct from one another. The parent of
the new commit is different - even if everything else in the commit was copied
exactly, the object's hash would differ and thus the commits would be different
objects.

```bash
# Clean up: delete the cherry-pick branches
$ git switch master

# Use the --force option to delete unmerged branches, which will cause the new
# "Cherry-pick" commits to be lost

$ git branch --delete --force cherrypick-from cherrypick-to
Deleted branch cherrypick-from (was 7b4d6dd).
Deleted branch cherrypick-to (was 6a8f027).

$ git log --oneline --graph
* 83ff9ad (HEAD -> master) Commit 4
*   f0d4fc5 Merge 2 & 3
|\
| * 6679b16 Commit 2
* | d86ecf9 Commit 3
|/
* d8bcda2 (tag: first) Commit 1
```

### Solving conflicts {#conflicts}

A _conflict_ is an error that can occur when Git attempts to merge changes from
commits that have different ancestries. Specifically, they occur when two
diverged branches have applied different changes to the same part of the same
file:

```bash
# Create a new branch and create a commit that file1.txt

$ git switch --create conflicts
Switched to a new branch 'conflicts'

$ echo "Changes from the conflict branch" > file1.txt

$ git commit --all --message "Commit on conflict branch"
[conflicts ebc327a] Commit on conflict branch
 1 file changed, 1 insertion(+), 1 deletion(-)

# Switch back to master and add a commit that modifies file1.txt

$ git switch master
Switched to branch 'master'

$ echo "Changes from the master branch" > file1.txt
$ git commit --all --message "Commit on master branch"

# Attempt to merge in the conflicts branch

$ git merge conflicts
Auto-merging file1.txt
CONFLICT (content): Merge conflict in file1.txt
Automatic merge failed; fix conflicts and then commit the result.
```

Git pauses during the merge to alert us - it has tried to automatically merge
the changes that branch `conflicts` has made to `file1.txt`, but failed. This is
what we call a conflict. If we check `$ git status`, we can see that we are in a
new state with "unmerged" files:

```bash
$ git status
On branch master
You have unmerged paths.
  (fix conflicts and run "git commit")
  (use "git merge --abort" to abort the merge)

Unmerged paths:
  (use "git add <file>..." to mark resolution)
        both modified:   file1.txt

no changes added to commit (use "git add" and/or "git commit -a")
```

As the status suggests, if you don't want to go through with the merge at this
point, you can run `$ git merge --abort` to cancel it.

Unmerged files are tracked within the index, which now associates three
different blobs for `file1.txt`: 

```bash
$ git ls-files --stage
100644 1ed6543483aafc93c5323daea1860bd7a29857d4 1       file1.txt
100644 919d56c17043cc095148fda4f90a5c272bb213a2 2       file1.txt
100644 a4e9201a54a9db3b35b39a09ded144328e5c837a 3       file1.txt

$ git show 1ed6543483aafc93c5323daea1860bd7a29857d4
Some contents

$ git show 919d56c17043cc095148fda4f90a5c272bb213a2
Changes from the master branch

$ git show a4e9201a54a9db3b35b39a09ded144328e5c837a
Changes from the conflict branch
```

The first blob is the original contents of `file1.txt`, before either branch
applied the changes that are causing the conflict. The second is the contents of
the file in the target branch, `master`, and the third from branch `conflicts`.

Inside the repository, there are also a number of files that Git uses to track
information about the current merge:

```bash
# MERGE_HEAD, MERGE_MODE, MERGE_MSG, and ORIG_HEAD have now appeared:

$ tree -L 1 .git
.git
├── branches
├── COMMIT_EDITMSG
├── config
├── HEAD
├── index
├── info
├── logs
├── MERGE_HEAD
├── MERGE_MODE
├── MERGE_MSG
├── objects
├── ORIG_HEAD
└── refs
```

`MERGE_HEAD` contains the name of the commit currently being merged into the
target branch. In this case, it contains the name of the tip of `conflicts`.
Like `HEAD`, despite not being stored in `.git/refs`, `MERGE_HEAD` is a valid
ref: 

```bash
$ git show MERGE_HEAD
commit ebc327adeefd8189cf63e01b40697a9063de519e (conflicts)
Author: William <william@example.com>
Date:   Sat Apr 17 12:13:11 2021 +0100

    Commit on conflict branch

diff --git a/file1.txt b/file1.txt
index 1ed6543..a4e9201 100644
--- a/file1.txt
+++ b/file1.txt
@@ -1 +1 @@
-Some contents
+Changes from the conflict branch
```

`ORIG_HEAD` contains the target commit which `MERGE_HEAD` is being merged into.
In this case, the it contains the name of the tip of `master` at the time the
merge started. This is the commit that you will be returned to if you cancel the
merge:

```bash
$ git show ORIG_HEAD
commit 95f682d4a83d7fd55f35dc09e9db6e403639b81c (HEAD -> master)
Author: William <william@example.com>
Date:   Sat Apr 17 12:14:18 2021 +0100

    Commit on master branch

diff --git a/file1.txt b/file1.txt
index 1ed6543..919d56c 100644
--- a/file1.txt
+++ b/file1.txt
@@ -1 +1 @@
-Some contents
+Changes from the master branch
```

Both of these commits will be used as parents of the merge commit once all
conflicts have been resolved.

`MERGE_MSG` contains the message that will be used for the merge commit, and
`MERGE_MODE` contains the merge strategy being used (e.g. `no-ff`).

In this unmerged state, `file1.txt` contains a combination of the conflicting
changes:

```diff
<<<<<<< HEAD
Changes from the master branch
=======
Changes from the conflict branch
>>>>>>> conflicts
```

The lines beginning with `<`, `=`, and `>` are called _conflict markers_, and
indicate the areas of the file in which conflicts have occurred. The first
section of a conflict area is between the begin marker line `<<<` and `===`, and
is labelled with the ref or commit (in this case, `HEAD`). This label indicates
where those changes have come from. Similarly, the lines between `===` and the
ending marker `>>>` are the contents of the other ref or commit in this
conflict, in this case the tip of `conflicts`.

Generally, "our" changes are in the first section, and "their" changes are in
the second section. In a merge, "our" changes are from the current branch which
has changes being merged into, and "their" changes are from the branch that is
being merged from.

To _resolve_ the conflict, replace the conflict markers with the contents that
should be there after the merge process. This can be the contents from either
marker region, or some combination of the two. For this example, I'm going to
change the line entirely:

```bash
$ echo "Changes after merging" > file1.txt

# Stage file1.txt to mark it as merged

$ git add file1.txt

$ git status
On branch master
All conflicts fixed but you are still merging.
  (use "git commit" to conclude merge)

$ git commit
```

You'll be prompted for a commit message as usual:

```MERGE_MSG
Merge branch 'conflicts'

# Conflicts:
#	file1.txt
#
# It looks like you may be committing a merge.
# If this is not correct, please run
#	git update-ref -d MERGE_HEAD
# and try again.


# Please enter the commit message for your changes. Lines starting
# with '#' will be ignored, and an empty message aborts the commit.
#
# On branch master
# All conflicts fixed but you are still merging.
#
```

After you save and quit your editor, the merge commit will be created:

```bash
[master 084e38e] Merge branch 'conflicts'

$ git show
commit 084e38e6effbd4479f600de9a9b6b423ad1c0cb5 (HEAD -> master)
Merge: 95f682d ebc327a
Author: William <william@example.com>
Date:   Sat Apr 17 18:56:29 2021 +0100

    Merge branch 'conflicts'

diff --cc file1.txt
index 919d56c,a4e9201..345e6ae
--- a/file1.txt
+++ b/file1.txt
@@@ -1,1 -1,1 +1,1 @@@
- Changes from the master branch
 -Changes from the conflict branch
++Changes after merging
```

<!-- TODO fix diff syntax highlighting -->

Instead of showing just a simple before-and-after, the diff shows the changes
applied to both the contents from `master` and `conflict`, followed by the new
change which replaced both. This is a _combined diff_, showing the change that
the new commit introduces in comparison to all of its
parents.[^git-combined-diff] If we kept the contents from either `master` or
`conflicts` the diff would be empty; technically the merge would have introduced
no new changes. In that case, you could instead use `$ git diff <merge
commit>..<merge-commit>^` to show changes that the merge introduced into the
target branch. I'll explain this syntax in the next section.

```bash
# Delete the new branch to clean up
$ git branch --delete conflicts
```

## Exploring history and branches

### Resetting HEAD {#reset}

`$ git reset` changes the current HEAD (or the current branch's head) to the
specified target, and optionally affects the staging area and working tree.
Manually changing refs is handy in situations where you want to manipulate
history to, for example, undo a commit or update a branch to match another
branch.

To undo the commits made during the conflicts example, we can reset back to
commit 4:

```bash
$ git log --oneline --graph
*   df0ec89 (HEAD -> master) Merge branch 'conflicts'
|\
| * ebc327a Commit on conflict branch
* | 95f682d Commit on master branch
|/
* 83ff9ad Commit 4
*   f0d4fc5 Merge 2 & 3
|\
| * 6679b16 Commit 2
* | d86ecf9 Commit 3
|/
* d8bcda2 (tag: first) Commit 1

$ git reset 83ff9ad # "Commit 4"
Unstaged changes after reset:
M       file1.txt

$ git log --oneline --graph
* 83ff9ad (HEAD -> master) Commit 4
*   f0d4fc5 Merge 2 & 3
|\
| * 6679b16 Commit 2
* | d86ecf9 Commit 3
|/
* d8bcda2 (tag: first) Commit 1
```

By default, `$ git reset` won't affect the working tree, so `file1.txt` keeps
the contents it had in `df0ec89`. This is called a "mixed" reset. Git lists
`file1.txt` under "Unstaged changes after reset" to indicate this file doesn't
match the staging area after the reset. 

If want to reset HEAD but also leave the staging area as it is, you can use the
`--soft` option:

```bash
$ cat file1.txt
Changes from the conflict branch

# A soft reset won't affect the staging area either

$ git add file1.txt 

$ git reset --soft 95f682d # "Commit on master branch"

# The staging area keeps the changes that were staged in file1.txt

$ git diff --staged
git diff --staged
diff --git a/file1.txt b/file1.txt
index 919d56c..a4e9201 100644
--- a/file1.txt
+++ b/file1.txt
@@ -1 +1 @@
-Changes from the master branch
+Changes after merging
```

Finally, a hard reset using `--hard` will set everything to match the target:
HEAD, the staging area, and the working tree:

```bash
$ git reset --hard 83ff9ad # "Commit 4"

$ cat file1.txt
Some contents

$ git status
On branch master
nothing to commit, working tree clean

$ git log --oneline --graph
* 83ff9ad (HEAD -> master) Commit 4
*   f0d4fc5 Merge 2 & 3
|\
| * 6679b16 Commit 2
* | d86ecf9 Commit 3
|/
* d8bcda2 (tag: first) Commit 1
```

And now we're back to commit 4, as if none of the conflict merging had ever
happened!

### Referring to commits by ancestry

You can also refer to commits from their descendants in a relative manner, which
saves you the hassle of searching for names when dealing with the recent
ancestors of a ref:

```bash
# "The parent of HEAD"
$ git show --oneline HEAD^
f0d4fc5 Merge 2 & 3

# "The grandparent of HEAD"
$ git show --oneline HEAD^^
d86ecf9 Commit 3
```

The `^` (caret) character means "parent of", so repeating the character will
traverse as many commits as you want.

Note how commits with multiple parents are handled: `HEAD^^` shows "Commit 3",
despite the merge commit also having "Commit 2" as a parent. This is because the
first parent is implicitly chosen, for merge commits this is a commit on the
branch that was merged into.

So `^` really means _first_ parent. To manually choose which parent you want,
use a number following the `^` (e.g. `^2` means "second parent"):

```bash
# "Second parent of the parent of HEAD"
$ git show --oneline HEAD^^2
6679b16 Commit 2
```

<!-- TODO: diagram -->

You can keep adding `^` characters afterwards to traverse more parent commits.

Instead of repeating `^` for each parent, you can use `~` (tilde), which always
means "first parent". Appending a number instead specifies how many parents you
want to traverse, and so is equivalent to using `^` sequentially that number of
times:

```bash
# "The first grandparent of HEAD"
$ git show --oneline HEAD^^
d86ecf9 Commit 3

# "The grandparent of HEAD" again
$ git show --oneline HEAD~2
d86ecf9 Commit 3
```

You can combine both systems to get to any commit you want:

```bash
# Traverse the second parent of the merge commit to get the first commit
# First parent -> second parent -> first parent
$ git show --oneline --no-patch HEAD~^2^
d8bcda2 (tag: first) Commit 1

# The same path: ^ and ~ can be substituted if no numbers are appended
$ git show --oneline --no-patch HEAD^^2~
d8bcda2 (tag: first) Commit 1
```

### Garbage collection and the reflog {#reflog}

When using `$ git reset` and other commands that affect refs, you can enter
situations where commits are no longer accessible from any ref. But, as
demonstrated earlier, you can still access these _unreachable_ commits and reset
to them. They aren't immediately deleted, so there's no need to worry about
immediately losing your work.

If you've lost and forgotten the name of a commit, you'll be able to find it
using the _reflog_ ("ref-log"), which keeps a local history of changes to refs.
These are stored in `.git/logs`.

```bash
$ git reflog
83ff9ad (HEAD -> master) HEAD@{0}: reset: moving to 83ff9ad
d8bcda2 (tag: first) HEAD@{1}: reset: moving to HEAD
d8bcda2 (tag: first) HEAD@{2}: reset: moving to HEAD
d8bcda2 (tag: first) HEAD@{3}: reset: moving to first
83ff9ad (HEAD -> master) HEAD@{4}: commit: Commit 4
...
```

In this case, the last few entires in the reflog are showing the most recent
commits and the resets from the previous section. The reflog introduces another
relative name syntax, specifically for the previous states of refs. This follows
the format `ref@{offset}`, with older entries using larger offsets:

```bash
# HEAD@{0} is equivalent to HEAD
$ git show --oneline HEAD@{0}
83ff9ad (HEAD -> master) Commit 4

$ git show --oneline HEAD@{1}
d8bcda2 (tag: first) Commit 1
```

A reflog is kept for each head - so as long as an unreachable commit is
accessible through commits in any reflog Git will keep them around. Reflogs are
pruned over time when you run Git commands, by default keeping the last 90 days
of history,[^git-garbage-collection] which is plenty of time in most cases to
recover useful work that has been accidentally made unreachable. Unreachable
objects are created fairly regularly while using Git (e.g. when you stage a file
multiple times before committing it) - garbage collection stops these objects
from bloating your local repository.

Don't rely on the reflog to save things that should be kept safe in the
long-term - use [branches](#branches) or [the stash](#stash) instead.

### Stashing changes {#stash}

A common situation is to have some additional changes after a commit, but these
changes may affect test results, which makes it harder to check your commit
stands on its own. Alternatively, you might want to quickly switch to working on
something else, starting from a clean slate whilst saving your existing changes.
Instead of creating a feature branch or temporary commit that you'll forget
about, you can use the _stash_:

```bash
$ echo "something" >> file1.txt
$ git status
On branch master
Changes not staged for commit:
  (use "git add <file>..." to update what will be committed)
  (use "git restore <file>..." to discard changes in working directory)
        modified:   file1.txt

$ git stash
Saved working directory and index state WIP on master: 83ff9ad Commit 4

$ cat file1.txt
Some contents

$ git stash list
stash@{0}: WIP on master: 83ff9ad Commit 4
```

Git has added a `stash` ref that points to a commit:

```bash
$ cat .git/refs/stash
081d3df73d57aa55efe191164539c85c5966e8e2

$ git show stash
commit 081d3df73d57aa55efe191164539c85c5966e8e2 (refs/stash)
Merge: 83ff9ad 0bcec6c
Author: William <william@example.com>
Date:   Sat Mar 27 21:40:01 2021 +0000

    WIP on master: 83ff9ad Commit 4

diff --cc file1.txt
index 1ed6543,1ed6543..29b2192
--- a/file1.txt
+++ b/file1.txt
@@@ -1,1 -1,1 +1,2 @@@
  Some contents
++something

# The stash commit is a merge commit, merging another commit into the current
# head of master. Here's the commit it's merging:

$ git show 0bcec6c
commit 0bcec6ce392ea096eb062cba49bda341f6f4a9ed
Author: William <william@example.com>
Date:   Sat Mar 27 21:40:01 2021 +0000

    index on master: 83ff9ad Commit 4

$ git log --oneline --graph stash
*   081d3df (refs/stash) WIP on master: 83ff9ad Commit 4
|\
| * 0bcec6c index on master: 83ff9ad Commit 4
|/
* 83ff9ad (HEAD -> master) Commit 4
*   f0d4fc5 Merge 2 & 3
|\
| * 6679b16 Commit 2
* | d86ecf9 Commit 3
|/
* d8bcda2 (tag: first) Commit 1
```

![
The commit history after stashing. There are two new commits: 
"index on master..." named 0bcec6c, whose parent is
83ff9ad, and "WIP on master..." named 081d3df which is a merge commit pointing
to 83ff9ad and 0bcec6c. The ref refs/stash points to the "WIP on master" commit,
081d3df. The ref heads/master and HEAD continue to point to 83ff9ad.
](stash.svg
"The commit history after stashing on master")

Stashing creates two commits: "index on...", which contains only changes
that were staged, and "WIP on...", which
contains the remaining changes you had in the working tree. The HEAD at the time
of the stash is used a parent for both commits, with its name being appended to
the message of the stash commits. The "WIP" commit is a merge commit, merging
the "index" commit into the HEAD, so it includes both the staged and unstaged
changes. Finally, `refs/stash` points to the "WIP" commit.

You can list your saved stashes with `$ git stash list`:

```bash
$ git stash --list
stash@{0}: WIP on master: 83ff9ad Commit 4
```

The list uses the syntax for ref history, which hints that the stash system
relies on the reflog to keep track of stash commits. Use `$ git reflog` to
inspect the reflog in `.git/logs/refs/stash`:

```bash
$ git reflog stash
081d3df (refs/stash) stash@{0}: WIP on master: 83ff9ad Commit 4
```

Older stash commits are listed later in the reflog, and have a larger index.
Unlike other reflogs, Git does not garbage collect old entries in the stash
reflog (by default), so it's safe to save changes there in the long term.

Use `$ git stash apply` to apply (i.e. _unstash_) the "WIP" commit, placing its
changes back into the working tree. In this example we only had unstaged
changes, but `stash apply` would also restore changes to the staging area if
there were any:

```bash
$ git stash apply
On branch master
Changes not staged for commit:
  (use "git add <file>..." to update what will be committed)
  (use "git restore <file>..." to discard changes in working directory)
        modified:   file1.txt

no changes added to commit (use "git add" and/or "git commit -a")

$ git stash list
stash@{0}: WIP on master: 83ff9ad Commit 4
```
After applying it, the stash entry is kept in the log, in case you want to keep
it around. You can use `$ git stash drop` to remove the top stash commit from
history, without applying it. Alternatively, you can drop a specific stash by
name or index, or use `$ git stash clear` to remove all of them:

```bash
# Create a new stash, using the --message option to set the stash commit
# message
$ echo "something" >> file1.txt
$ git stash --message "Stash 0"
Saved working directory and index state On master: Stash 0

$ git stash list
stash@{0}: On master: Stash 0
stash@{0}: WIP on master: 83ff9ad Commit 4

$ git stash drop 1
Dropped refs/stash@{1} (f2980f78975c299232772661309c2cd864aecac7)

$ git stash list
stash@{0}: On master: Stash 0

$ git stash clear

$ git stash list

# No stashes remain

$ git reflog stash

# The stash reflog has been cleared
```

To apply and drop a stash in one command, use `$ git stash pop`:

```bash

# Create another stash
# $ git stash push is the same as $ git stash
$ echo "something" >> file1.txt
$ git stash push
Saved working directory and index state WIP on master: 83ff9ad Commit 4

$ git stash pop
On branch master
Changes not staged for commit:
  (use "git add <file>..." to update what will be committed)
  (use "git restore <file>..." to discard changes in working directory)
        modified:   file1.txt

no changes added to commit (use "git add" and/or "git commit -a")
Dropped refs/stash@{0} (081d3df73d57aa55efe191164539c85c5966e8e2)

$ git stash list

# No stashes remain
```

Use the `--index` option with `pop` or `apply` to only apply the changes in the
"index" commit, i.e. the changes that were staged before the stash.

Instead of stashing all changes in your working tree, you can pick which ones
you want by providing a list of files after a `--` (double-dash) to separate
them from the options: `$ git stash push -- file1.txt file2.txt`.

Use the `--patch` option with `$ git stash push` to interactively select which
changes you want to stash, similarly to `$ git add --patch`.

By default, stashing won't include _untracked_ files - if you want to include
them, use the `--include-untracked` option with `$ git stash push`.

Some Git commands like `$ git merge` have an `--autostash` option, which is
handy if your working tree is dirty when you want to do a merge. This option
stashes your changes before the merge, then applies the stash after it.

## Rewriting history

Commit objects are immutable, meaning the name of a commit depends on the
contents of all the files in the repository, the date and time of the commit,
and several other factors. If we want to edit commits in the repository, we
can't simply change the existing commits. We can however create _new_ commits
based on some existing ones and replace the existing commits, effectively
_rewriting_ history.

This is handy for correcting mistakes and keeping commits self-contained. Since
all commits are performed on your local repository rather than relying on an
external server, you're free to rewrite history before you're happy to share it
with others. You can also rewrite history _after_ sharing your commits, but this
is a more dangerous operation.

### Undoing commits

If you simply want to get rid of the commit on the tip of the branch, you can
use `$ git reset` (as explained in the [reflog](#reflog) section).

### Amending commits

The simplest scenario is wanting to edit the commit on the tip of the branch,
(i.e. the most recent one in history) - `$ git commit` has the option `--amend`
which you can use in this scenario. Instead of creating a new commit, _amending_ a
commit will remove the last commit, then use your currently staged contents to
create a new commit object. You'll be presented with the previous commit's
message to edit:

```bash
$ rm file1.txt
$ git commit --amend
```
You'll then be presented with this in your editor:

```COMMIT_EDITMSG
Commit 4

# Please enter the commit message for your changes. Lines starting
# with '#' will be ignored, and an empty message aborts the commit.
#
# Date:      Tue Mar 16 21:34:47 2021 +0000
#
# On branch master
# Changes to be committed:
#	deleted:    file1.txt
#
```
After saving and quitting, your amend will be applied:

```bash
[master b9935da] Commit 4
 Date: Tue Mar 16 21:34:47 2021 +0000
 1 file changed, 1 deletion(-)
 delete mode 100644 file1.txt

$ git log --oneline --graph
* b9935da (HEAD -> master) Commit 4
*   f0d4fc5 Merge 2 & 3
|\
| * 6679b16 Commit 2
* | d86ecf9 Commit 3
|/
* d8bcda2 (tag: first) Commit 1

# b9935da has replaced 83ff9ad

$ git cat-file -p b9935da

tree 4b825dc642cb6eb9a060e54bf8d69288fbee4904
parent f0d4fc50ace540f32c1397ca6f291a571ed3560a
author William <william@example.com> 1615930487 +0000
committer William <william@example.com> 1617739956 +0100

Commit 4

# Undo the amend by resetting back to 83ff9ad

$ git reset 83ff9ad
HEAD is now at 83ff9ad Commit 4
```

Amending keeps the authored date from the commit that was amended, but
notice that the _committer_ line has used a later date: the point in time at
which the new commit was created.

### Rebasing

If your situation involves something other than the commit at the tip of a
branch, `$ git rebase` provides much more flexibility (and complexity).

_Rebasing_ is the process of taking a contiguous set of commits and reapplying
each to create a new set. It can reapply those commits on top of a different
"tip", changing the commit that the set is attached to - think of this as
"re-parenting".

You can use `$ git rebase` with another branch as the target (known as the _new
base_), which will take the commits on the current branch that aren't in the
target branch and reapply them to the current tip of the target. In this
case, "reapplying" a commit effectively means [cherry-picking](#cherry-picking)
it. In the end, your branch will be reformed into one you can merge with a
[fast-forward](#fast-forward). To demonstrate:

```bash
# Create a new branch from the first commit, using the tag 'first'
$ git switch --create rebasing first
Switched to a new branch 'rebasing'

$ git commit --allow-empty --message "Rebase commit"
[rebasing 048ccc8] Rebase commit

$ git log --oneline --graph
* 048ccc8 (HEAD -> rebasing) Rebase commit
* d8bcda2 (tag: first) Commit 1

# Use the --all option to show the tips of all branches
$ git log --oneline --graph --all
* 048ccc8 (HEAD -> rebasing) Rebase commit
| * 83ff9ad (master) Commit 4
| *   f0d4fc5 Merge 2 & 3
| |\
| | * 6679b16 Commit 2
| |/
|/|
| * d86ecf9 Commit 3
|/
* d8bcda2 (tag: first) Commit 1
```

Here's a clearer visualisation of the commit graph:

![
The commit history after creating the new commit on the rebasing branch. A new
commit 048ccc8 points to d86ecf9. HEAD points to heads/rebasing, and
heads/rebasing points to 048ccc8. The head for master is unchanged, still
pointing to 83ff9ad.
](rebase-before.svg
"The commit history after creating the new commit on the rebasing branch")

Now three commits are parented to the first commit, including the new commit we
just made. Now let's try rebasing:

```bash
$ git rebase master
Successfully rebased and updated refs/heads/rebasing.

$ git log --oneline --graph --all
* fa8eb86 (HEAD -> rebasing) Rebase commit
* 83ff9ad (master) Commit 4
*   f0d4fc5 Merge 2 & 3
|\
| * 6679b16 Commit 2
* | d86ecf9 Commit 3
|/
* d8bcda2 (tag: first) Commit 1
```

Now our new commit is parented to the tip of `master` instead of the first
commit:

![
The commit history after creating the new commit on the rebasing branch. A new
commit fa8eb86 points to 83ff9ad. HEAD points to heads/rebasing, and
heads/rebasing points to fa8eb86. heads/master continues to point to 83ff9ad.
048ccc8, the commit originally created on rebasing, no longer exists.
](rebase.svg
"The commit history after creating the new commit on the rebasing branch")

```bash
# Delete the branch to clean this example up
# Use the --force option since there are unmerged commits
# Commit fa8eb86 will become unreachable
$ git switch master
$ git branch --delete --force rebasing
Deleted branch rebasing (was fa8eb86).
```

Note that [conflicts](#conflicts) can occur while commits are being reapplied.
In that case, Git will inform you and let you interactively [resolve the
conflict](#conflicts) similarly to a merge. Use:

- `$ git rebase --abort` to cancel the rebase entirely, and restore the
  branch to its state before the rebase started
- `$ git rebase --skip` to skip the conflicting commit and resume the rebase
- `$ git rebase --continue` after the conflict has been resolved to amend the
  conflicting commit and resume the rebase

Git will fast-forward (i.e. skip over) commits that don't need to be rewritten,
which saves you from accidentally rewriting commits that you shouldn't. You can
use the `--no-ff` or `--force-rebase` options to explicitly disable this
behaviour.

Like `$ git merge`, `$ git rebase` has an `--autostash` option to quickly stash
away changes in your working tree before rebasing, and reapply them after the
rebase is complete.

### Interactive rebasing

You can manually influence the rebase process, which makes a rebasing much more
powerful tool than simply copying a set of commits to a new tip. Rebase using
the `--interactive` option and Git will open your editor, presenting you with
the list of commits that ill be affected. You can edit the list to specify what
to do with each commit:

```bash
$ git rebase --interactive first
```

The following is opened in your editor:

```git-rebase-todo
pick d86ecf9 Commit 3 # empty
pick 6679b16 Commit 2 # empty
pick 83ff9ad Commit 4 # empty

# Rebase d8bcda2..acd24b9 onto d8bcda2 (3 commands)
#
# Commands:
# p, pick <commit> = use commit
# r, reword <commit> = use commit, but edit the commit message
# e, edit <commit> = use commit, but stop for amending
# s, squash <commit> = use commit, but meld into previous commit
# f, fixup <commit> = like "squash", but discard this commit's log message
# x, exec <command> = run command (the rest of the line) using shell
# b, break = stop here (continue rebase later with 'git rebase --continue')
# d, drop <commit> = remove commit
# l, label <label> = label current HEAD with a name
# t, reset <label> = reset HEAD to a label
# m, merge [-C <commit> | -c <commit>] <label> [# <oneline>]
# .       create a merge commit using the original merge commit's
# .       message (or the oneline, if no original merge commit was
# .       specified). Use -c <commit> to reword the commit message.
#
# These lines can be re-ordered; they are executed from top to bottom.
#
# If you remove a line here THAT COMMIT WILL BE LOST.
#
# However, if you remove everything, the rebase will be aborted.
#
```

Each line is a command, the first word being the command itself and rest are are
arguments. If the argument is a single commit, its name can be followed by any
text, which Git uses to show the first line of the commit message. Lines
starting with a `#` are comments which won't be interpreted as a command.

The comments below the list give you a quick tutorial on the available commands.
`pick` is the most basic command, which means to cherry-pick the specified
commit. Commands are executed from top to bottom, so reorder the `pick` commands
if you want to change the order of the new commits. Place a `squash` command
immediately after the commit that the argument should be combined into.

Once you save and quit, Git will run through each command in sequence and you'll
be left with a history rewritten exactly the way you want it. The rebase process
may be interrupted if you use an interactive command like `edit` or `break`,
or if there are any [conflicts](#conflicts). In this case you can use the
`--continue` option once you're done.

### Squash and fixup commits

If you simply want to amend a commit that isn't at the tip of the branch, you
can use `$ git commit --squash <commit>` and `$ git commit --fixup <commit>`,
which both interact with the rebase process. The new commit's message will be
prepended with "squash!" or "fixup!" and the first line of the target commit's
message. If you then run `$ git rebase --interactive --autosquash <commit>` (where
`<commit>` is the earliest commit you want to amend), the list of commands will
appropriately reorder and replace the command for squash and fixup commits.

This will save you the trouble of manually editing the command list in one go,
instead setting up the commands as you commit. For example:

```bash
$ git commit --allow-empty --fixup first
[master 7630fce] fixup! Commit 1

# Use --root to rebase from before the first commit in history
$ git rebase --interactive --autosquash --root
```

You'll be presented with the following command list:

```git-rebase-todo
pick d8bcda2 Commit 1
fixup 7630fce fixup! Commit 1 # empty
pick d86ecf9 Commit 3 # empty
pick 6679b16 Commit 2 # empty
pick 83ff9ad Commit 4 # empty
```

In this case the first commit will be amended, and our commit that merged
commits 2 and 3 will be skipped.

You can run `$ git config --global rebase.autoSquash true` to enable the
`--autosquash` option by default.

## Remotes

Everything discussed so far are things you can do on your local repository - the
final piece of the Git puzzle is how to collaborate with others by sharing your
commits.

Git can keep track of _remote_ repositories, which are normal repositories that
exist at some location outside your `.git` repository. These can be elsewhere on
your local system, or over the local network/internet using protocols like
HTTP(S) or SSH.

### Creating a new remote

To create a remote repository for our current repository, we can use `$ git
clone`. For example, if your working tree exists in the subdirectory
`repository`:

```bash
$ ls
repository

$ git clone --bare repository remote
Cloning into bare repository 'remote'...
done.

$ ls
repository
remote

$ tree -L 1 remote
remote/
├── branches
├── config
├── description
├── HEAD
├── hooks
├── info
├── objects
├── packed-refs
└── refs
```

Cloning copies a repository into another location, in this case
`repository/.git` into the directory `remote`. With the `--bare` option, Git
will make the target directory a plain repository without a working tree, so now
`remote` mirrors `repository/.git`, including refs and reachable objects only.
To instead set up an empty repository for a remote, you can run `$ git init
--bare`. Similarly to `$ git clone --bare`, this repository won't have a working
tree associated with it.

You can still use a few normal Git commands on a bare repository:

```bash
$ cd remote

$ git log --oneline --graph --all
* 83ff9ad (HEAD -> master) Commit 4
*   f0d4fc5 Merge 2 & 3
|\
| * 6679b16 Commit 2
* | d86ecf9 Commit 3
|/
* d8bcda2 (tag: first) Commit 1

# Without a working tree most operations will fail

$ git switch --create test
fatal: this operation must be run in a work tree
```

Back in our normal repository, we can register the new repository as our primary
remote, called `origin`:

```bash
$ cd ../repository

$ git remote add origin ../remote

# A new section has been added for [remote "origin"]
$ cat .git/config
[core]
        repositoryformatversion = 0
        filemode = true
        bare = false
        logallrefupdates = true
[user]
        name = William
        email = william@example.com
[remote "origin"]
        url = ../remote/
        fetch = +refs/heads/*:refs/remotes/origin/*
```

Remotes are configured in the local repository config file. The `url` option is
the location of the remote - in this case, a relative path to the remote on our
local filesystem. More formats are supported, including `https://...` and
`ssh://...`.[^gitremotes]

Cloning is the normal way to get a copy of an existing repository. The cloned
URL will automatically be added as the `origin` remote, but more remotes can be
added and existing ones adjusted with `$ git remote set-url`. Simply copying
someone's `.git` directory would also work, but you would end up copying data
which you probably don't want, such as their personal configuration, stashes,
local branches, and unreachable objects.

### Fetching

In order to collaborate, several people will use the same remote in their local
repositories. Local repositories download the refs and objects stored in remote
repositories through `$ git fetch`, which is known as _fetching_:

```bash
$ git fetch
From ../remote
 * [new branch]      master     -> origin/master
```

Fetching is controlled by the fetch option for the remote:
`+refs/heads/*:refs/remotes/origin/*` - this means "download all refs under
`refs/heads/` in the remote repository to the local repository, and store them
locally under `refs/remotes/origin/`". All objects that are reachable from those
refs and not stored locally are also downloaded and saved in the local
repository's object store.

With fetching, we have a mechanism for synchronising from a remote repository to
a local one, and have new refs for keeping track of heads from remotes. These
are called _remote-tracking branches_:

```bash
$ git log --oneline --graph --all
* 83ff9ad (HEAD -> master, origin/master) Commit 4
*   f0d4fc5 Merge 2 & 3
|\
| * 6679b16 Commit 2
* | d86ecf9 Commit 3
|/
* d8bcda2 (tag: first) Commit 1
```

Logs now show the `origin/master` head alongside `master` for commit 4, showing
that these heads have been synchronised since the last fetch. Note how
`remotes/` can be (and usually is) omitted from the head name.

![
The commit history after fetching from the new remote. The new ref
remotes/origin/master points to the same commit as heads/master: 83ff9ad.
](remote.svg
"The commit history after fetching from the new remote")

### Pulling

Whilst fetching will simply download the remote's refs and new objects, you may
also want to incorporate changes others have made into your local branches. This
is done with `$ git pull`, and is called _pulling_.

Pulling will simply fetch, then merge your current head with its counterpart
in the remote. The counterpart is not set by default - set it with `$ git branch
--set-upstream-to=<remote>/<branch>`. For example:

```bash
$ git branch --set-upstream-to=origin/master
Branch 'master' set up to track remote branch 'master' from 'origin'.
```

This will add a `branch` section in `.git/config`:

```
[core]
	repositoryformatversion = 0
	filemode = true
	bare = false
	logallrefupdates = true
[user]
	name = William
	email = william@example.com
[remote "origin"]
	url = ../remote/
	fetch = +refs/heads/*:refs/remotes/origin/*
[branch "master"]
	remote = origin
	merge = refs/heads/master
```

If we now attempt pulling:

```bash
$ git pull
Already up to date.
```

As the origin and local heads are equal, no merge is necessary. If there were a
difference, a merge commit would be created or your local head would be
fast-forwarded. In the former scenario, this would create a new commit with the
sole purpose of incorporating the changes others have introduced, which isn't
ideal. Instead, if you already have new commits on your local branch, you can
rebase them onto the origin's head with `$ git pull --rebase`. If you prefer
this over the default behaviour, you may be interested in the config options
[`pull.rebase`](https://git-scm.com/docs/git-config#Documentation/git-config.txt-pullrebase)
and
[`branch.autoSetupRebase`](https://git-scm.com/docs/git-config#Documentation/git-config.txt-branchautoSetupRebase).

### Don't rewrite shared history {#rewriting-shared-history}

__Avoid changing history that already exists on a remote__. Essentially, this
means not changing a history that currently contains an existing remote's head
into one which no longer contains that head. For example:

```bash
$ git log --oneline --graph --all
* 83ff9ad (HEAD -> master, origin/master) Commit 4
*   f0d4fc5 Merge 2 & 3
|\
| * 6679b16 Commit 2
* | d86ecf9 Commit 3
|/
* d8bcda2 (tag: first) Commit 1
[1]+  Done                    mako
```

Currently the remote head `origin/master` exists in the history of our `HEAD`,
pointing the same tip commit. If we were to amend the tip commit, this would no
longer be the case:

```bash
$ git commit --amend --allow-empty
[master 857df84] Commit 4
 Date: Tue Mar 16 21:34:47 2021 +0000

$ git log --oneline --graph --all
* 857df84 (HEAD -> master) Commit 4
| * 83ff9ad (origin/master) Commit 4
|/
*   f0d4fc5 Merge 2 & 3
|\
| * 6679b16 Commit 2
* | d86ecf9 Commit 3
|/
* d8bcda2 (tag: first) Commit 1
```

![
](remote-rewrite.svg
"The commit history after creating the new commit on the rebasing branch")

Now in branch `master`, `83ff9ad` has been replaced with `857df84`, so the local
and remote branches no longer share a common ancestry. We can still force the
remote to update its head to match our new local head with `$ git push --force`,
but there's the possibility that someone else has already sent commits to the
remote, and these commits will be lost because our local repository doesn't have
them in its history. This can also cause trouble for everyone working locally on
the branch with the old history. When they try to pull your changes, they could
encounter conflicts on commits they didn't create, and be forced into a
confusing merge or rebase as they try to apply the old history on top of the new
history of the remote.

With common branches like `master`, people will be regularly pulling and
applying new changes on top of the remote's version of that branch. It's
particularly important to maintain the existing history of these branches to
avoid inconveniencing its users. As such, it's better to create new
commits rather than trying to rewrite the existing ones.

For example, if you want to undo a commit that hasn't been pushed yet, you can
drop said commit with a rebase or reset. If that commit has already been pushed,
use [`$ git revert`](https://git-scm.com/docs/git-revert) to create a new commit
that undoes the changes in another.

Thankfully, remotes will prevent you from rewriting branch history by default.
However, this isn't an absolute rule, and you can force remotes accept the
rewritten cases in cases where it makes sense.

For example, if you're working on temporary feature
branches, it may be acceptable to first rebase them before merging them into a
main branch. Your team should set rules on when shared branch history may be
rewritten, and shared repositories can be configured to block forced rewrites to
enforce those rules.

If you find yourself having accidentally rewritten shared history, try
cancelling your current merge or rebase, or use the [reflog](#reflog) to (mixed)
[reset](#reset) back to the commit before you rewrote history:

```bash
$ git reset 83ff9ad
```

You may then have to [cherry-pick](#cherry-pick) any new commits created on
top of the rewritten history.

### Pushing {#push}

Finally, you can _push_ (i.e. upload) changes to a remote with `$ git push`.

```bash
$ git commit --allow-empty --message "Pushed commit"
[master 4ace86b] Pushed commit

$ git push
Enumerating objects: 1, done.
Counting objects: 100% (1/1), done.
Writing objects: 100% (1/1), 842 bytes | 842.00 KiB/s, done.
Total 1 (delta 0), reused 0 (delta 0), pack-reused 0
To ../remote/
   83ff9ad..4ace86b  master -> master

$ git log --oneline --graph --all
* 4ace86b (HEAD -> master, origin/master) Pushed commit
* 83ff9ad Commit 4
*   f0d4fc5 Merge 2 & 3
|\
| * 6679b16 Commit 2
* | d86ecf9 Commit 3
|/
* d8bcda2 (tag: first) Commit 1
```

This uploads the head of the current branch and any associated objects, then
updates the remote head in our local repository.

If your local history isn't up to date (i.e., someone else has pushed
commits since your last pull), you'll be met with an error like this:

```
To ../remote/
 ! [rejected]        master -> master (non-fast-forward)
error: failed to push some refs to '../remote/'
hint: Updates were rejected because the tip of your current branch is behind
hint: its remote counterpart. Integrate the remote changes (e.g.
hint: 'git pull ...') before pushing again.
hint: See the 'Note about fast-forwards' in 'git push --help' for details.
```

In this case you'll need to perform a pull.

You'll get the same error if you [rewrote shared
history](#rewriting-shared-history) and caused the remote head to be lost in
your local history.

__If you're sure you want to push these changes anyway__, you can use `$ git
push --force-with-lease` to ignore the error and force the remote to update and
match your local history. This option checks that the heads in the remote match
your remote-tracking branches, so you won't accidentally lose commits that have
been made since your last fetch. However, this option is not infallible; it
would fail to protect you if another process is updating your tracking branches
in the background.[^git-push-force-with-lease]

Similarly, the `--force` option also ignores the error, but doesn't perform any
checks on the remote heads, so it should be used with even more caution. As
mentioned previously, remotes can configure whether or not forced pushes are
allowed on individual branches.

## Extra resources

Listed below are extensions and additional functionality and you may find
useful if this article has held your interest:

- [`.gitignore`](https://git-scm.com/docs/gitignore) files let you configure
which files shouldn't be tracked.

- [`$ git bisect`](https://git-scm.com/docs/git-bisect) lets you
efficiently search history for changes that introduced issues.

- [`$ git worktree`](https://git-scm.com/docs/git-worktree) lets you have
multiple working trees that share a single repository.

- [`$ git sparse-checkout`](https://git-scm.com/docs/git-sparse-checkout)
lets you create a working tree that contains a subset of files in a repository.

- [Submodules](https://git-scm.com/book/en/v2/Git-Tools-Submodules) let 
you to maintain repositories as a subdirectory of another repository.

- [git-svn](https://git-scm.com/docs/git-svn) is a bridge for using Git with an
  SVN repository.

- [Git Large File Storage](https://git-lfs.github.com) and
[git-annex](https://git-annex.branchable.com) are extensions which let you use
Git to track large files without bloating local repositories with their full
histories.

If you'd like to learn more about branching models, take a look at
[git-flow](https://nvie.com/posts/a-successful-git-branching-model) and [GitHub
flow](https://guides.github.com/introduction/flow).

If you prefer GUIs, Git has a built-in interface which you can launch with `$
git gui`.  The Git website maintains a list of third-party GUI clients
[here](https://git-scm.com/downloads/guis). If you're an Emacs or Vim user, I'd
recommend checking out [Magit](https://magit.vc) or
[Fugitive](https://github.com/tpope/vim-fugitive) respectively.

## References

[^missing-semester-git]: <https://missing.csail.mit.edu/2020/version-control>

[^git-ages-4-up]: _Git For Ages 4 And Up_ by Micheal Schwern @ Linux.conf.au
  2013.  [YouTube](https://www.youtube.com/watch?v=1ffBJ4sVUb4), [Wayback
  Machine](https://web.archive.org/web/*/https://www.youtube.com/watch?v=1ffBJ4sVUb4)

[^git-from-bits-up]: _Git From the Bits Up_ by Tim Berglund @ JAXconf 2013.
  [YouTube](https://www.youtube.com/watch?v=MYP56QJpDr4), [Wayback
  Machine](https://web.archive.org/web/*/https://www.youtube.com/watch?v=MYP56QJpDr4)

[^linux-mail-archives]: See archives of these mailing lists at
  [lore.kernel.org](https://lore.kernel.org)

[^gitglossary]: <https://git-scm.com/docs/gitglossary>

[^git-sha256-switch]:
  <https://github.com/bk2204/git/blob/transition-stage-4/Documentation/technical/hash-function-transition.txt>

[^git-combined-diff]:
  <https://git-scm.com/docs/git-diff-tree#_diff_format_for_merges>

[^git-garbage-collection]:
  <https://git-scm.com/docs/git-reflog#Documentation/git-reflog.txt---expirelttimegt>

[^gitremotes]: All supported remote URL formats are listed in
  <https://git-scm.com/docs/git-fetch#_git_urls>

[^git-push-force-with-lease]:
  <https://git-scm.com/docs/git-push#Documentation/git-push.txt---force-with-leaseltrefnamegt>
