module.exports = function(ctrl) {
    return [
        m("h3", "PUrchase BotVest"),
        m('a', {
            onclick: ctrl.purchaseAsset
        }, 'purchase'),
        m('a', {
            onclick: function() {
                ctrl.activeView = 'homepage'
            }
        }, 'cancel')
    ]
}
