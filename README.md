[![npm](https://img.shields.io/npm/v/vue-ripper.svg)](https://www.npmjs.com/package/vue-ripper)

> Everything is sexual

*Sigmund Freud*
# vue-ripper
This set of 4 components allow a parent component to divide some of its children component to display different parts at different places.

An example is to give a table-definition column-wise:
```html
<mytable>
	<mycolumn letter="a">
	<mycolumn letter="b">
	<mycolumn letter="c">
</mytable>
```
In html, the table will be defined row-wise:
```html
<table>
	<tr>
		<th>a</th>
		<th>b</th>
		<th>c</th>
	<tr>
	<tr>
		<td>
			...
```
In order to do that, we have to separate the table-header and the table-cell definition, to display them at different places.

## Installation

```
npm install --save vue-ripper
```

```typescript
import {Ripper, Pimp, Ripped, Depot} from 'vue-ripper'
- or -
import ripper from 'vue-ripper'
Vue.install(ripper);
```
## The ripping set
These 3 components (`Ripper`, `Pimp`, `Ripped`) often work together. The `ripper`s (often provided by your component' users) are gathered by the `pimp`s that provide the `ripped` parts.

### Ripper
The ripper allows to define the component that will be dislocated in pieces.
In our exemlpe, this is the template of the column.
```html
<template>
	<ripper>
		<template slot="header" class="table-header">
			{{letter.toUpperCase()}}
		</template>
		<template slot-scope="scope" class="table-cell">
			{{letter.toLowerCase() + scope.number}}
		</template>
	</ripper>
</template>
```
The ripper allows to define templates and will render nothing (indeed, a comment element). The ripper should of course be the top-element of the (here `mycolumn`) component.

### Pimp

The pimp is used in the parent component to gather all the rippers.

A `pimp` will basically render a `<div style="display: none;" />`, although a tag can be specified with the `is` keyword : `<thead is="pimp" ...>`. As it is supposed to contain `rippers`, it will contain only comment elements.

Its role is to keep its `v-model` updated with the list of `VueComponent` it directly contains. For configurable components, that is in the `pimp` that the `<slot />` is placed.

Note: the list is given as an array of component. For the key, use `component.uid`

Regular usage:
```html
<pimp v-model="columns">
	<slot />
</pimp>
```

### Ripped
The `ripped` is where a piece of the `ripper` is placed. It specifies the slot name and scope if given.

For example, to render the header of a column :
```html
<th is="ripped" v-for="(column, uid) in columns" :key="uid"
	template="header"
	:ripper="column"
>
	A field
</th>
```

For example, to render the cells of a given `row`:
```html
<td is="ripped"
	v-for="(column, uid) in columns" :key="uid"
	:ripper="column"
	:scope="{row}" />
```

If a custom render function is provided, this function is called with the `createNode` function and the slot (`vNode[]`) as arguments.
If no tag is given (by using `<ripped ...>`), then the template must contain exactly one element and it won't be wrapped. If a tag is given (by using `<span is="ripped" ...>`), it will wrap the template.
- `template`: Name of the slot taken from the `ripper`, defaults to `default`
- `scope`: If given, the template will be a scoped slot.
- `ripper`: The `VueComponent` to rip appart.
- `render: (h: createNode, slot: vNode[]) => vNode[]` to render programatically the ripped.
If the ripper doesn't give the slot, the `ripped`'s content will be used instead.

## Depot
The `depot` is a stand-alone component that can be used to re-order slots and wrap their rendering programmatically.
A `depot` will basically render in a `<div>`, although a tag can be specified with the `is` keyword : `<thead is="depot" ...>`.

It can be given a slot order as an array of string slot-names. Some how, `<depot :order="['a','c','b']">` corresponds to a component with this template :
```html
<div>
	<slot name="a" />
	<slot name="c" />
	<slot name="b" />
</div>
```
The slots that are not specified in the order won't be rendered.
If the `depot` is given no order, it will only render the default slot. (this can be useful to just map it)

The depot can also be given a `map: (slot: vNode[], name: string, h: createElement)=> vNode[]`. If a `map` function is given, it will be called for each rendered slots. The function could return `slot` to have no effect.
- `slot` is the list of elements given in the slot
- `name` is the slot' name
- `h` is the render-function provided by `Vue` to create vNodes.

If the function returns nothing, the `slots` will be used. In order to render nothing, `[]` has to be returned.