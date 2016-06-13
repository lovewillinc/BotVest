module.exports = function(ctrl) {
    return [
        m('h3', 'Homepage'),
        m('a', {
            onclick: function() {
                ctrl.activeView = 'QRScan'
            }
        }, 'Purchase Asset'),
        m('br'),
        m('a', {
            onclick: function() {
                ctrl.activeView = 'portfolio'
            }
        }, 'Portfolio'),
        m('div', {
            config: function(elem, isInit, ctx) {
            	if(!isInit)
                	ctrl.updateBalance();
            }
        }, (!ctrl.accountBalance) ? 'Getting Balance...' : 'Account Balance:' + ctrl.accountBalance),
        m('h5', 'Owned Assets'),
        ctrl.ownedAssets.length == 0 ? m('div', "No assets are currently owned") : m('div', [
            ctrl.ownedAssets.map(function(asset) {
                return m('span', {
                    onclick: function() {
                        ctrl.viewAsset(asset)
                    }
                }, asset.name)
            })
        ])
    ]
}
