module.exports = function(ctrl) {
    return [
        m("[layout='column'][layout-align='start center']", [
            m("nav", [
                m("[layout='row'][layout-align='space-between center']", [
                    m("[layout='row'][layout-align='start center']", [
                        m(".u-width-56", [
                            m("i.material-icons.firstIcon", {
                                    onclick: function() {
                                        ctrl.activeView = 'homepage';
                                    }
                                },
                                "arrow_back")
                        ]),
                        m("span.title", "View Asset")
                    ]),
                    m("[layout='row'][layout-align='end center']", [
                        m("i.material-icons", {
                            onclick: function() {
                                ctrl.activeView = 'QRScan';
                            }
                        }, "credit_card"),
                        m("i.material-icons", {
                            onclick: function() {
                                ctrl.activeView = 'portfolio';
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
                m(".section-title", 'Asset Details'),
                m(".asset-row[layout='row'][layout-align='space-between center']", [
                    m("strong", 'Shares Owned'),
                    m("div", ctrl.currentAsset.sharesOwned)
                ]),
                m(".asset-row[layout='row'][layout-align='space-between center']", [
                    m("strong", 'Shares Value'),
                    m("div", ctrl.currentAsset.shareValue)
                ]),
                m(".asset-row.u-marginBottom-24[layout='row'][layout-align='space-between center']", [
                    m("strong", 'Total Shares Value'),
                    m("div", ctrl.currentAsset.totalShareValue)
                ]),
                m(".section-title", "Transactions"),
                ctrl.currentAsset.transactions.map(function(transaction) {
                    return m(".asset-row[layout='row'][layout-align='space-between center']", [
                        m("div", [
                            m("span.asset-date", transaction.date),
                        ]),
                        m("div", transaction.amount)
                    ])
                })
            ])
        ])
    ]
}
