<template>
	<ripper>
		<template slot="header">
			{{letter.toUpperCase()}}
		</template>
		<template scope="scope">
			{{letter.toLowerCase() + scope.number}}
		</template>
		{{letter.toLowerCase()}}
	</ripper>
</template>

<script lang="ts">
import * as Vue from 'vue'
import {Component, Inject, Model, Prop, Watch} from 'vue-property-decorator'

@Component
export default class Column extends Vue {
	@Prop() letter: string
}
</script>