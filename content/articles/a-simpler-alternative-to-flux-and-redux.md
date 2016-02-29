---
title: A simpler alternative to Flux & Redux
description: A proposal for a simpler alternative to Flux and Redux.
twitter: true
disqus: true
---
# A simpler alternative to Flux & Redux

*February 29<sup>th</sup>, 2016*

## Why?

While I like [Flux][flux] and love [Redux][redux], I always found them to be a
little bit complicated to grasp.

Apart from being radical new approaches to how we design and develop Web
applications, they also come with their lot of boilerplate, which I often find
unnecessary and cumbersome.

The [Flux Architecture Overview][flux:overview] is a difficult read, especially
if you're not accustomed to these architecture patterns.

On the other hand, the [Redux][redux] documentation is quite meaty but
introduces a lot of concepts which can also put off beginners.

## Proposal

I wanted to keep the [Three Principles][redux:3principles] of Redux:

- Single source of truth
- Read-only state
- Changes are made with pure functions

But I wanted to do this while eliminating the parts I didn't like, and most of
the boilerplate.

After some fiddling and discussions on the [Putain de Code
chatroom][p!:discord], I came up with my own implementation and [Uhsac][uhsac]
found a name for it: Madux ☺. Although the name was nice, I found another one:
[elfi][elfi] which stands for *Elegant & Lightweight Flux Implementation*.

Here is the implementation of a store in Elfi:

```javascript
function createStore(initialState) {
  if (!initialState) {
    throw new Error("Missing initial state in store creation")
  }
  let state = initialState
  const subscribers = new Set()

  return {
    getState() {
      return state
    },

    dispatch(action, ...args) {
      if (typeof action !== "function") {
        throw new Error("action must be a function")
      }

      const oldState = state
      state = action(state, ...args)

      if (state === oldState) {
        return
      }

      subscribers.forEach((subscriber) => subscriber(state, oldState))
    },

    subscribe(subscriber) {
      subscribers.add(subscriber)

      return function unsubscribe() {
        if (subscribers.has(subscriber)) {
          subscribers.delete(subscriber)
        }
      }
    },
  }
}
```

As you can see the code is **quite short** and expressive. Its concepts are
simple to grasp as well:

- A *store* keeps some state;
- *Actions* can be *dispatched* to modify this state;
- Actions are *pure functions* taking the state and some other arguments and
  returning a new state;
- *Subscribers* can be added to the store. They are functions that will get the
  new and old states as arguments and called after each dispatch.

Below is a simple app built with Elfi, [Deku][deku] and [Immutable].

```javascript
/** @jsx element */

import {element, createApp} from 'deku'
import Immutable from 'immutable'
import {createStore} from 'elfi'

const initialState = Immutable.fromJS({
  isOn: false
})

const actions = {
  toggleOnOff (state) {
    return state.set('isOn', !state.get('isOn'))
  }
}

const App = {
  render ({context, dispatch}) {
    const isOn = context.get('isOn')
    return (
      <div>
        <button onClick={() => dispatch(actions.toggleOnOff)}>
          Click me!
        </button>
        <span>
          {isOn ? 'On.' : 'Off.'}
        </span>
      </div>
    )
  }
}

const store = createStore(initialState)
const render = createApp(document.getElementById('app'), store.dispatch)
store.subscribe((state) => render(<App />, state))
store.dispatch((s) => s)
```

## What's next?

I still haven't found how to elegantly deal with async actions, maybe by
checking the return type of an action and act differently when it's a promise.

Using two actions like in Redux works (one to the request, one for the
response) but it does bring some bloat to the code.

I'm also thinking about a way to implement middleware-like functionality, like
in Redux.

[flux]: https://facebook.github.io/flux/
[flux:overview]: https://facebook.github.io/flux/docs/overview.html
[redux]: http://redux.js.org/
[redux:3principles]: http://redux.js.org/docs/introduction/ThreePrinciples.html
[deku]: http://dekujs.github.io/deku/
[immutable]: https://facebook.github.io/immutable-js/
[uhsac]: https://github.com/Uhsac
[p!:discord]: http://putaindecode.io/discuss/
[elfi]: https://github.com/madx/elfi
