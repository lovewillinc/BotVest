module.exports = function(ctrl) {
    return [
        m("[layout='column'][layout-align='center center']", [
            m(".logo-big.signup", ""),
            m("a.btn.u-width-314", {
                onclick: ctrl.generateAccount
            }, "Create Account"),
            m("p.u-width-314.center", "Click the button above to generate a new investment account.")
        ])
    ]
}
