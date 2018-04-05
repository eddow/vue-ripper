<template>
	<div>
		<pimp v-model="columns">
			<column letter="z" />
			<column letter="x" />
			<column letter="c" />
		</pimp>
		<table>
			<thead>
				<tr>
					<th is="ripped" v-for="(column, uid) in columns" :key="uid"
						template="header"
						:ripper="column"
					/>
				</tr>
			</thead>
			<tbody>
				<tr v-for="(number, index) in numbers" :key="index">
					<td is="ripped" v-for="(column, uid) in columns" :key="uid"
						:ripper="column"
						:scope="{number, index}" />
				</tr>
			</tbody>
		</table>
		--{{columns && columns.length}}--
		<depot :order="['a','c','b']">
			<div slot="c">Slot C.</div>
			<div slot="b">Slot B.</div>
			<div slot="a">Slot A.</div>
		</depot>
	</div>
</template>

<script lang="ts">
import Vue from 'vue'
import {Component, Inject, Model, Prop, Watch} from 'vue-property-decorator'
import column from './column.vue'

@Component({components:{column}})
export default class App extends Vue {
	numbers = [1,3,5]
	columns = null
}
</script>