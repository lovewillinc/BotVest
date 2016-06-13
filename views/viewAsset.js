module.exports = function(ctrl) {
    return [
        m("h3", "Viewing Asset"),
        m("div", [
        	Object.keys(ctrl.currentAsset).map(function(key) {
        		return m("span", key + ": " + ctrl.currentAsset[key])
        	})
        ])
    ]
}
