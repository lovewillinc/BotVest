module.exports = function(ctrl) {
    return [
        m("[layout='column'][layout-align='start center']", [
            m("nav", [
                m("[layout='row'][layout-align='space-between center']", [
                    m("[layout='row'][layout-align='start center']", [
                        m(".u-width-56", ""),
                        m("span.title", "BotVest")
                    ]),
                    m("[layout='row'][layout-align='end center']", [
                        m("i.material-icons", {
                            onclick: function() {
                                ctrl.activeView = 'QRScan'
                            }
                        }, "credit_card"),
                        m("i.material-icons", {
                            onclick: function() {
                                ctrl.activeView = 'portfolio'
                            }
                        }, "work")
                    ])
                ])
            ]),
            m(".content", [
                m(".balance-row[layout='column'][layout-align='center start']", [
                    m(".balance-title", {
                        config: function(elem, isInit, ctx) {
                            if (!isInit)
                                ctrl.updateBalance();
                        }
                    }, (!ctrl.accountBalance) ? 'Retrieving...' : self.dollarFormat(ctrl.accountBalance)),
                    m("span", "Current account balance")
                ]),
                m(".section-title", "Assets"),
                ctrl.ownedAssets.length == 0 ? m(".asset-row[layout='row'][layout-align='space-between center']", [
                    m("div", "No assets are currently owned."),
                ]), : m('div', [
                    ctrl.ownedAssets.map(function(asset) {
                        return m(".asset-row[layout='row'][layout-align='space-between center']", {
                            onclick: function() {
                                ctrl.viewAsset(asset);
                            }
                        }, [
                            m("div", asset.name),
                            m("div", asset.totalShareValue)
                        ])
                    })
                ])
            ])
        ]),
    ]
}
