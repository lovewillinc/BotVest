views = {
    welcome: function(ctrl) {
        return m("h3", "Welcome")
    },
    homepage: function(ctrl) {
        return m("h3", "Homepage")
    },
    viewAsset: function(ctrl) {
        return m("h3", "View Asset info")
    },
    QRScan: function(ctrl) {
        return m("h3", "QR Scan")
    },
    purchase: function(ctrl) {
        return m("h3", "purchase")
    },
    portfolio: function(ctrl) {
    	return m("h3", "portfolio")
    }
}
var app = {
    controller: function() {
        var self = this;
        self.activeView = "welcome";
        return self;
    },
    view: function(ctrl) {
    	console.log("ctrl is:", ctrl);
        return views[ctrl.activeView](ctrl)
    }
}
m.mount(document.body, app)
