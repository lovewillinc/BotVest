module.exports = function(ctrl) {
    return [
        m("h3", "Welcome to BotVest"),
        m("a", {
            onclick: ctrl.generateAccount
        }, "Tap here to generate account")
    ]
}
