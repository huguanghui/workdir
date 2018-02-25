<template>
	<div id="app">
		Clicked: {{ $store.state.count }} times, count is {{ evenOrOdd }}.
		<button @click="increment">+</button>
		<button @click="decrement">-</buttion>
		<button @click="incrementIfOdd">Increment if odd</button>
		<button @click="incrementAsync">Increment async</button>
	</div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
	computed: mapGetters([
	'eventOrOdd'
	]),
	methods: mapActions([
	'increment',
	'decrement',
	'incrementIfOdd',
	'incrementAsync'
	])
}
</script>