function render(h, tag, slot) {
	if(tag) return h(tag, slot);
	if(1< slot.length) return slot[0];
	console.error('Ripped has no surrounding tag and has many vnodes to render')
}

export const Ripper = {render(h) { return h(); }};
export const Pimp = {
	model: {
		prop: 'items',
		event: 'items'
	},
	computed: {
		slots: function() {
			return this.$slots.default
				.map(x=>x.componentInstance)
				.filter(x=>x);
		}
	},
	methods: {
		give(items) {
			this.oldSlots = items;
			var slots = {};
			items.forEach(item => slots[item._uid] = item);
			this.$emit('items', slots);
		}
	},
	props: ['items', 'tag'],
	render(h) {
		return h(this.tag||'div', {style:{display: 'none'}}, this.$slots.default);
	},
	mounted() {
		//We wrap the values in a function to be sure the vnodes does not become observed
		this.give(this.slots);
	},
	updated() {
		var slots = this.slots;
		if(slots.length != this.oldSlots.length)
			this.give(slots);
		else for(let i in slots)
			if(slots[i]!== this.oldSlots[i])
				return this.give(slots);
	}
};

export const Ripped = {
	props: {
		tag: {type: String},
		template: {default: 'default', type: String},
		scope: {type: Object},
		ripper: {type: Object}
	},
	render(h) {
		var ripper = this.ripper.$children[0],
			slot = this.scope ?
			ripper.$scopedSlots[this.template](this.scope) :
			ripper.$slots[this.template];
		return render(h, this.tag, slot);
	}
};

const components = {Ripper, Pimp, Ripped};
export default {
	install(Vue, options) {
		for(let i in components) Vue.component(i, components[i]);
	}
};