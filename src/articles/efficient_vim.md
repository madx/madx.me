title: Efficient Vim
---

<div class="date">
Mar 4<sup>th</sup>, 2013
</div>

Efficient Vim
=============

I started using Vim around 2007, back when I was in college. Over time, I've
polished my workflow a lot, even if I'm still learning new tricks and
techniques every day.

It's important to say that I use Vim on a daily basis, mostly for Ruby (and
Rails) development, shell scripting and note-taking.

Here I will present some tips and techniques that make me more productive with
Vim.


Moving around
-------------

With almost no exception, the three main things I'm doing the most when editing
code are moving around, editing some text, and thinking.
While Vim can't help with the last one, it is very efficient when addressing
the first two.

Skimming through text has to be as fast as possible. I tend to think very
quickly about what I'm looking for and I really don't want to be slowed by my
fingers. Most of the time, *searching* is far superior to *moving*, so I use
`/` and `n` quite a lot along with `f` and `t` for character search.

When I'm not searching for something, I'm reading, and then I need to process
small blocks of text one by one. I remapped `J` and `K` to `10jzz` and `10kzz`
so I can scroll ten lines at a time while keeping my cursor at the center of the
screen. This eases focusing and avoids to be left looking for the cursor. Also,
it is easy to remember since it uses the same keys as linewise up and down
motion and keeps your fingers on the home row.

Holding `j` ok `k` to navigate is a really bad habit, and you may as well
consider [disabling them][vim-nohjkl]. I did not, but I enabled relative
numbering so jumping straight to the right spot is easier. I have it enabled
only in normal mode, with the following snippet in my `.vimrc`:

``` vim
set relativenumber
autocmd InsertEnter * :set number
autocmd InsertLeave * :set relativenumber
```

Here's what it looks like:

![Example of relative numbering](/media/images/efficient_vim-relative_numbering.png)

I use [basic motions][vim-cheat] for everything else.

[vim-cheat]: https://raw.github.com/EspadaV8/vim_shortcut_wallpaper/master/vim-shortcuts_1280x800.png
[vim-nohjkl]: http://vimcasts.org/blog/2013/02/habit-breaking-habit-making/


Repeating actions
-----------------

While developing, most edit tasks you carry boil down to repeatable actions.
Vim eases this by providing macros and the wonderful `.` command (which repeats
your last insert). But it has much more potential than that.

Did you know about the *argument list*? It's a list of files, kinda like the
buffer list. You add or remove files from it with the `:args` family of command
(see the Vim help pages for details). Notably, there are commands similar to
`:bufdo` or `:windo` to operate on your arglist. But the most important is that
you can navigate through them with `:n` and `:prev`. It really helps to focus on
a particular set of files, and it is very powerful with **recursive macros**.


Macros in Vim are *really* useful: they allow you to record and replay a set of
actions as you type them. Use `qa` to start recording to the `a` register, `q`
again to stop and `@a` to replay. You can of course use any of the registers
provided by Vim.

There is one neat trick with macros: they can be recursive. I'll stop here to
warn you: ensure that your macro will fail at one point to avoid infinite
recursion!

The trick is very simple to use:

* Record a macro in a register (say `a`)
* Record a macro in another register like this: `qb@a@bq`
* Call `@b`

It will stop as soon as `@a` yields an error. A simple way to raise an error is
calling `:n` when there are no more files in the argument list.

It really helps refactoring: you record the refactoring on the first file,
ending with `:n` and then you call it recursively on all the other ones, BOOM.


Abusing &lt;Leader&gt;
----------------------

I try to keep my hands on the home row (`q` to `m` with an azerty layout), and
`Leader` is a good friend for that. I have it mapped to `,` which is right below
`j` and `k`, so very close to my right index.

I have a *lot* of things mapped with `Leader` :

``` vim
" File navigation
nmap ,aa :next<cr>
nmap ,aA :prev<cr>
nmap ,bb :bn<cr>
nmap ,bB :bp<cr>
nmap ,b<Space> :b#<cr>
nmap ,qq :cn<cr>zz
nmap ,qQ :cp<cr>zz

" Conflict resolution
nmap ,in /^\(<<<<\\|====\\|>>>>\)<cr>
nmap ,ip ?^\(<<<<\\|====\\|>>>>\)<cr>

" Ack for word under cursor
nmap ,A yiw:Ack <C-R>"<cr>
vmap ,A :<C-W>Ack <C-R>*<cr>

" Easy window management
nmap <silent> <leader>w<Space> :call FocusMasterWindow()<CR>
nmap <silent> <leader>w<CR>    :call SwapWithMasterWindow()<CR>
nmap <silent> <leader>wm       :call MarkWindowSwap()<CR>
nmap <silent> <leader>wx       :call DoWindowSwap()<CR>
nmap <silent> <leader>w <C-W>

" Ctrl-P
nmap ,oo :CtrlP<cr>
nmap ,of :CtrlPMixed<cr>
nmap ,ob :CtrlPBuffer<cr>
nmap ,or :CtrlPMRU<cr>

" Numbering
noremap ,nn :set number<cr>
noremap ,nN :set relativenumber<cr>

" Git rebase
nmap <silent> ,rp :Pick<CR>
nmap <silent> ,rs :Squash<CR>
nmap <silent> ,re :Edit<CR>
nmap <silent> ,rr :Reword<CR>
nmap <silent> ,rf :Fixup<CR>
nmap <silent> <Tab> :Cycle<CR>
```

I mostly use the window management and file navigation-related ones, but most of
the time using a `<Leader>` combo is a time saver.

---

I hope you learned some tips while reading this and I'd be interested by
comments or tweets about your own workflow.

Happy coding!
