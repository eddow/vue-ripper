export const Ripper = {
	render(h) { return h(); },
	updated() { this.$parent.$emit('updated'); }
};
export const Pimp = {
	model: {
		prop: 'items',
		event: 'items'
	},
	methods: {
		slots() {	//This is in the methods not to be cached : this.$slots.default never invalidates
			return this.$slots.default
				.map(x=>x.componentInstance)
				.filter(x=>x);
		},
		give(items) {
			this.oldSlots = items;
			this.$emit('items', items);
		}
	},
	props: ['items'],
	render(h) {
		return h(this.$vnode.data.tag||'div', {style:{display: 'none'}}, this.$slots.default);
	},
	mounted() {
		this.give(this.slots());
	},
	updated() {
		var slots = this.slots();
		if(slots.length != this.oldSlots.length)
			this.give(slots);
		else for(let i in slots)
			if(slots[i]!== this.oldSlots[i])
				return this.give(slots);
	}
};

export const Ripped = {
	props: {
		template: {default: 'default', type: String},
		scope: {type: Object},
		ripper: {type: Object},
		render: {type: Function}
	},
	//TODO: watch ripper change for $on/$off('updated') !
	methods: {
		childUpdate() {
			this.$forceUpdate();
		}
	},
	mounted() {
		if(!this.scope) this.ripper.$on('updated', this.childUpdate);
	},
	destroyed() {
		if(!this.scope) this.ripper.$off('updated', this.childUpdate);
	},
	render(h) {
		var ripper = this.ripper.$children[0],
			slot = this.scope ?
			ripper.$scopedSlots[this.template] &&
				ripper.$scopedSlots[this.template](this.scope) :
			ripper.$slots[this.template];
		if(!slot) slot = this.$slots.default;
		if(this.render) return this.render(h, slot);
		if(this.$vnode.data.tag) return h(this.$vnode.data.tag, slot);
		if(1< slot.length) return slot[0];
		console.error('Ripped has no surrounding tag and has many vnodes to render')
	}
};

/**
 * Allow you to provide slots and the order in which the slots are displayed
 */
export const Depot = {
	props: {
		order: {type: Array, required: true},
		map: Function	//(string, vnode[], renderFunction) => vnode[]
	},
	render: function(h) {
		var children = [], slot;
		for(let name of this.order||['default']) {
			let slot = this.$slots[name];
			children = children.concat((this.map && this.map(slot, name, h)) || slot);
		}
		return h(this.$vnode.data.tag||'div', children);
	}
}

const components = {Ripper, Pimp, Ripped, Depot};
export default {
	install(Vue, options) {
		for(let i in components) Vue.component(i, components[i]);
	}
};