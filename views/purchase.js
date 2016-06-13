module.exports = function(ctrl) {
    return [
        m("[layout='column'][layout-align='start center']", [
            m("nav", [
                m("[layout='row'][layout-align='space-between center']", [
                    m("[layout='row'][layout-align='start center']", [
                        m(".u-width-56",{
                            onclick: function(){
                                ctrl.activeView = 'homepage';
                            }
                        }, [
                            m("i.material-icons.firstIcon", "arrow_back")
                        ]),
                        m("span.title", "Purchase Asset")
                    ]),
                    m("[layout='row'][layout-align='end center']", [
                        m("i.material-icons",{
                            onclick: function() {
                                ctrl.activeView = 'QRScan';
                            }
                        }, "credit_card"),
                        m("i.material-icons",{
                            onclick: function() {
                                ctrl.activeView = 'portfolio';
                            }
                        }, "work")
                    ])
                ])
            ]),
            m(".content", [
                m(".grey.lighten-5", [
                    m(".balance-row[layout='column'][layout-align='center start']", [
                        m(".balance-title", ctrl.scannedAsset.name),
                        m("span", ctrl.scannedAsset.address)
                    ]),
                    m(".asset-row[layout='row'][layout-align='space-between center']", [
                        m("strong", "Shares Available"),
                        m("div", ctrl.scannedAsset.sharesAvailable)
                    ]),
                    m(".asset-row[layout='row'][layout-align='space-between center']", [
                        m("strong", "Share Value"),
                        m("div", ctrl.scannedAsset.shareValue)
                    ]),
                    m(".asset-row.u-marginBottom-24[layout='row'][layout-align='space-between center']", [
                        m("strong", "Total Share Value"),
                        m("div", ctrl.scannedAsset.totalShareValue)
                    ])
                ]),
                m("section.u-padding-0_16", [
                    m(".inputPurchaseTitle", "Enter Purchase Amount"),
                    m("input.inputBorder[name='dollarAmount'][placeholder='$0.00'][type='number']", {
                        oninput: m.withAttr("value", ctrl.purchaseAmount),
                        value: ctrl.purchaseAmount()
                    }),
                    m("span.inputBalanceLabel", "Current Balance: " + ctrl.accountBalance )
                ]),
                // m(".asset-row.u-noBorder[layout='row'][layout-align='space-between center']", [
                //     m("div", "Shares to be purchased"),
                //     m("div", ctrl.purchaseShares)
                // ]),
                m(".purchase.u-padding-0_16[layout='row'][layout-align='space-between center']", [
                    m("a.btn.btn-primary[href='#']",{
                        onclick: ctrl.purchaseAsset
                    }, "Purchase"),
                    m("a.btn",{
                        onclick: function() {
                            ctrl.activeView = "homepage";
                        }
                    }, "Cancel")
                ])
            ])
        ])
    ]
}
