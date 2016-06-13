module.exports = function(ctrl) {
    return m('div', {
        config: function(element, isInit, ctx) {
            // if(!isInit)
                //ctrl.openScanner();
        }
    }, [
        m("h3", "QR Scanner here"),
        m("h5", "Buy Shares"),
        m("div", [
            m("img[src='../img/qr1.png']")
        ]),
        m('a', {
            onclick: ctrl.doScanAction
        }, 'Scan '),
        m('a', {
            onclick: function() {
                ctrl.activeView = 'homepage'
            }
        }, 'Cancel')
        
    ])
}