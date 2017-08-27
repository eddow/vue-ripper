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
					<ripped v-for="(column, uid) in columns" :key="uid"
						tag="th"
						template="header"
						:ripper="column"
					/>
				</tr>
			</thead>
			<tbody>
				<tr v-for="(number, index) in numbers" :key="index">
					<ripped v-for="(column, uid) in columns" :key="uid"
						tag="td"
						:ripper="column"
						:scope="{number, index}" />
				</tr>
			</tbody>
		</table>
		--{{columns && columns.length}}--
	</div>
</template>

<script lang="ts">
import * as Vue from 'vue'
import {Component, Inject, Model, Prop, Watch} from 'vue-property-decorator'
import column from './column.vue'

@Component({components:{column}})
export default class App extends Vue {
	numbers = [1,3,5]
	columns = null
}
</script>