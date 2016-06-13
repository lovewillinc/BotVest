module.exports = function(ctrl) {
    return [m("[layout='column'][layout-align='start center']", [
        m("nav", [
            m("[layout='row'][layout-align='space-between center']", [
                m("[layout='row'][layout-align='start center']", [
                    m(".u-width-56[layout='row'][layout-align='start center']", [
                        m("img.logo-small[src='img/bot.png']")
                    ]),
                    m("span.title", "BotVest")
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
            m(".grey.lighten-5", [
                m(".item-purchase[layout='column'][layout-align='center start']", [
                    m(".title", ctrl.scannedAsset.name),
                    m("span.u-marginBottom-24", ctrl.scannedAsset.address),
                    m(".balance-title", "$90,000.00"),
                    m("span", "Purchase price")
                ])
            ]),
            m("section.u-padding-0_16", [
                m(".inputPurchaseTitle", [

                ]),
                m("input.inputBorder[name='dollarAmount'][placeholder='$0.00'][type='number']", {
                    oninput: m.withAttr("value", ctrl.purchaseAmount),
                    value: ctrl.purchaseAmount()
                }),
                m("span.inputBalanceLabel", "Current Balance: " + ctrl.accountBalance)
            ]),
            m(".purchase.u-padding-0_16[layout='row'][layout-align='space-between center']", [
                m("a.btn.btn-primary", {
                    onclick: ctrl.purchaseAsset
                }, "Purchase"),
                m("a.btn", {
                    onclick: function() {
                        ctrl.activeView = "homepage";
                    }
                }, "Cancel")
            ])
        ])
    ])]
}