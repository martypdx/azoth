Azoth and the Search for the JavaScript UI Singularity
===

* intro
* AoT compiled
    * Expressive APIs
    * Fast runtime architectures
* Compiled minimalism
    * No HTML Creation
    * No Binding metadata
    * No Virtual DOM
* Basic Example
* Observables


> "Azoth [is] the essential agent of transformation in alchemy...the animating spirit hidden in all matter that makes transmutation possible." -wikipedia

Azoth is an Ahead-of-Time (AoT) compiled JavaScript UI library that produces a runtime architecture which is minimal in the extreme, resulting in small bundle size and great performance, including time to first render. Azoth leans heavily into the browser and modern JavaScript to let them do the heavy lifting, introducing a few concepts that allow composition and reactive programming to flourish.

--Insert graph with perf--

Because it is compiled, Azoth is both a runtime architecture _and_ a developer API. It offers a highly-functional, JavaScript-first approach for composing UI while adhering to a DOM-based interface.

## The Code Not Written

Let's look at a simple example to better understand what Azoth is and how it works:

```js
import { _ } from 'azoth';

const template = name => _`<div>Hello ${name}</div>`;

document.body.appendChild(template('world'));
```

Azoth uses a JavaScript feature called [TaggedTemplateLiterals](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals#Tagged_templates), but these are not used at runtime, but rather as indicators to the compiler. Compiling the above code would result in two outputs.

First, an extracted html template that would be added to your `.html` by the build system:

```html
<template id="0beef1d388"><div data-bind>Hello <text-node></text-node></div></template>
```

And second, the JavaScript file would be transformed to:

```js
import { __getRenderer, __textBinder } from 'azoth';

const __render0beef1d388 = __getRenderer('0beef1d388');
const template = name => {
  const {__fragment, __nodes} = __render0beef1d388();
  const __child0 = __nodes[0].childNodes[1];
  __textBinder(__child0)(name);
  return __fragment;
};

document.body.appendChild(template('world'));
```

These two pieces are combined by Azoth's rendering engine (invoked at `__render0beef1d388()` in example above, a [seventeen-line file](https://github.com/martypdx/azoth/blob/master/src/renderer.js) the core of which is:

```js
return function render() {
    const clone = fragment.cloneNode(true);
    return {
        __fragment: clone,
        __nodes: clone.querySelectorAll('[data-bind]')
    };
};
```

A couple of things to notice:

1. The tagged template literal was rewritten in place. This means Azoth does not need to know about the JavaScript or the expressions you write, it just supplements it as-is.
1. The return of the the template "function" is DOM, this is why it can be directly passed to the `.appendChild` call.

This compilation and runtime architecture removes three of the primary sources of overhead in rendering:

1. **Creating HTML** Html is extracted at build time and loaded via the associated `.html` page. This means there is no string, metadata or intermediate format that needs to be parsed as JavaScript and then iterated to create DOM. Instead, Azoth makes html using `cloneNode(true)`.

2. **Binding Metadata** There is no metadata or intermediate format used to specify template binding (this is often combined with #1 in other UI frameworks). In Azoth, the compiled JavaScript binds each template in a linear and direct fashion, regardless of the tree structure of the DOM being bound.

3. **Virtual DOM** There is no rendered representation (virtual dom) that needs to be maintained, checked or computed to render or make updates. All change management happens _outside the view layer_ via observables.


Azoth allows binding to normal JavaScript values and objects, as well as 
utilizing observables to bind to data that may change over time or not be
immediately available.