title: Managing your identity in Git
---

<div class="date">
Feb 1<sup>st</sup>, 2013
</div>

Managing your identity in Git
=============================

I use Git for a lot of tasks, whether it be work, open-source dev or personal
projects. At work we sometimes enjoy doing some pair-programming.

In all these situations, you want the work you produce to be correctly
attributed, and you may need to use different identities for that.

The process is quite painful, because you have to use `git config
user.(name|email)` and remember the correct identity settings (which email
address am I using on GitHub? How do we format the email address for pair
sessions?).

Enters [git-identity](http://github.com/madx/git-identity)!
-----------------------------------------------------------

It is a simple `git` subcommand that helps easing this workflow. Basically, it
allow you to:

* Manage your identities (user name / email address pairs) and have them stored in
  your global `.gitconfig` (which you certainly are versionning).
* Change your identity for a given repository



You'll find detailed install instructions and usage info in the
[README](https://github.com/madx/git-identity/blob/master/README.mkd).

My general workflow when I create a repo is now something like:

``` console
$ git init
$ git identity work
# Hack!
```

Contributing to GitHub projects is easier too:

``` console
$ git clone git://github.com/some/awesome_project.git && cd awesome_project
$ git identity github
```

I'm happily accepting pull requests, improvements and suggestions!

