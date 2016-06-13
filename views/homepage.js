module.exports = function(ctrl) {
    ctrl.updateBalance();
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
                        config: function(elem, isInit, ctx) {}
                    }, (!ctrl.accountBalance()) ? 'Retrieving...' : ctrl.dollarFormat(ctrl.accountBalance())),
                    m("span", "Account Balance")
                ]),
                m(".section-title", "Assets"),
                Object.keys(ctrl.ownedAssets).length == 0 ? m(".asset-row[layout='row'][layout-align='space-between center']", [
                    m("div", "No assets are currently owned."),
                ]) : m('div', [
                    Object.keys(ctrl.ownedAssets).map(function(i) {
                        var asset = ctrl.ownedAssets[i];
                        console.log("asset is@:", asset);
                        return m(".asset-row[layout='row'][layout-align='space-between center']", {
                            onclick: function() {
                                ctrl.viewAsset(asset);
                            }
                        }, [
                            m("div", asset.name),
                            m("div", asset.sharesOwned)
                        ])
                    })
                ])
            ])
        ]),
    ]
}
