var app = {
	controller: function() {
		var ctrl = {
			foo: "bar"
		}
		console.log("Inside of the controller.")
		return ctrl;
	},
	view: function(ctrl) {
		return [
			m("h3", "Baby Mithril")
		]
	}
}
m.mount(document.body, app)