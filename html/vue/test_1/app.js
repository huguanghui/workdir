var app = new Vue({
  el: '#app',
  data: {
    message: 'Hello Vue!'
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
		message: 'Hello'
	}
})