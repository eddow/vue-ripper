> Everything is sexual

*Sigmund Freud*
# vue-ripper
This set of 3 components allow a parent component to divide some of its children component to display different parts at different places.

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
import {ripper, pimp, ripped} from 'vue-ripper'
- or -
import ripper from 'vue-ripper'
Vue.install(ripper);
```
## Ripper
The ripper allows to define the component that will be dislocated in pieces.
In our exemlpe, this is the template of the column.
```html
<template>
	<ripper>
		<template slot="header" class="table-header">
			{{letter.toUpperCase()}}
		</template>
		<template scope="scope" class="table-cell">
			{{letter.toLowerCase() + scope.number}}
		</template>
	</ripper>
</template>
```
The ripper allows to define templates and will render nothing (indeed, a comment-node). The ripper should of course be the top-element of the component;

## Pimp

The pimp is used in the parent component to gather all the rippers.

A pimp component will basically render a `<div style="display: none;" />` (although a `tag` attribute can be given like `thead` if needed)
Its role is to keep its `v-model` updated with the list of `VueComponent` it directly contains. For configurable components, that is in the `pimp` that the `<slot />` is placed.

Note: the list is given as a dictionnary `{[uid: string]: component}` so that the uid can be fed to the `:key`

Regular usage:
```html
<pimp v-model="columns">
	<slot name="columns" />
</pimp>
```

## Ripped
The ripped is where a piece of the `ripper` is placed. It specifies the slot name and scope if given.

For example, to render the header of a column :
```html
<tr>
	<ripped v-for="(column, uid) in columns" :key="uid"
		tag="th"
		template="header"
		:ripper="column"
	/>
</tr>
```

- `tag`: If no tag is given, then the template must contain exactly one element and it won't be wrapped. If a tag is given, it will wrap the template.
- `template`: Template name, defaults to `default`
- `scope`: If given, the template will be a scoped slot.
- `ripper`: The `VueComponent` to rip appart.

## Support development
I contribute for free with drive, passion and time.
If you like what I do, you can promote me to do it more.

These are the only *like* buttons that have a real effect.

- [paypal.me/eeddow](https://www.paypal.me/eeddow)
- ETH: 0xb79b61130bc5726ddab6c1d59c3e0479afe69540
- BTC: 39ybn3KGNUvZrhifaLJcf4cJdzkGMdfAMT
- BCH: 3K81iYWwLZuWXY1qHcBL559FYraUqKMkEp