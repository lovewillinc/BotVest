module.exports = function(ctrl) {
    return m('div', {
        config: function(element, isInit, ctx) {
            // if(!isInit)
                //ctrl.openScanner();
        }
    }, [
        m("h3", "QR Scanner here"),
        m("h5", "Buy Shares"),
        m("div", Object.keys(assetDictionary).map(function(address) {
            return m("div", [
                m('a', {
                    onclick: ctrl.doScanAction.bind(ctrl, "b:"+address)
                }, 'Scan to buy shares in: ' + assetDictionary[address].name)
            ])
        })),
        m("h5", "Pay Bot $10"),
        m("div", Object.keys(assetDictionary).map(function(address) {
            return m("div", [
                m('a', {
                    onclick: ctrl.doScanAction.bind(ctrl, "p:"+address)
                }, 'Scan to pay bot $10: ' + assetDictionary[address].name)
            ])
        })),
        
    ])
}