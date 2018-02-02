Vue.component('todo-item', {
	props: ['todo'],
	template:'<li>{{ todo.text }}</li>'
})

var app = new Vue({
  el: '#app',
  data: {
    message: 'Hello Vue!'
  },
  created: function () {
  	console.log(this.message);
  }
})

var app3 = new Vue({
	el: '#app-3',
	data: {
		seen: true
	}
})

var app4 = new Vue({
	el: '#app-4',
	data: {
		todos: [
			{text: '学习'},
			{text: '运动'},
			{text: '睡觉'}
		]
	},
	created: function () {
		console.log(this.todos);
	}
})

var app5 = new Vue({
	el: '#app-5',
	data: {
		message: "请输入数据:"
	},
	methods: {
		reverseMessage: function () {
			this.message = this.message.split('').reverse().join('')
		}
	}
})

var app6 = new Vue({
	el: '#app-6',
	data: {
		message: 'Hello',
		items:[
			{ id: 0, text: 'aa'},
			{ id: 1, text: 'bb'}
		]
	}
})

var app7 = new Vue({
	el: '#app-7',
	data: {
		a: 2,
		groceryList: [
		  { id: 0, text: '蔬菜'},
		  { id: 1, text: '奶酪'},
		  { id: 2, text: '肉'}
		]
	},
	created: function () {
		console.log('a is: ' + this.a)
	}
})