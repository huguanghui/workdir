import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const state = {
	count: 0
}

const mutations = {
	increment (state) {
		state.count++
	},
	decrement (state) {
		state.count--
	}
}

const actions = {

}

const getters = {
	evenOrOdd: state => state.count % 2 === 0 ? 'even' : 'odd'
}

export default new Vue.Store({
	state,
	getters,
	actions,
	mutations
})