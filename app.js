Wallet = require('ethereumjs-wallet');
m = require('mithril');
Transaction = require('ethereumjs-tx');
bitcore = require('bitcore-lib');
Web3 = require('web3');
web3Helper = require('./web3Helper')
HookedWeb3Provider = require("hooked-web3-provider");

views = {
    welcome: require('./views/welcome.js'),
    homepage: require('./views/homepage.js'),
    viewAsset: require('./views/viewAsset.js'),
    QRScan: require('./views/QRScan.js'),
    purchase: require('./views/purchase.js'),
    portfolio: require('./views/portfolio.js'),
    loader: require('./views/loader.js')
}

var app = {
    controller: function() {
        var self = this;
        self.activeView = (account) ? 'homepage' : 'welcome';
        self.loaderMessage = '';
        self.accountBalance = null;
        self.currentAsset = null;
        self.ownedAssets = null;
        self.scannedAddress = null;

        self.updateBalance = function() {
            web3Helper.getAccountBalance().then(function(balance) {
                m.startComputation();
                self.accountBalance = balance
                m.endComputation();
            })
        }


        self.generateAccount = function() {
            self.showLoader('Generating your BotVest Account..')
            web3Helper.createAccount().then(function(response) {
                self.activeView = 'homepage';
                m.redraw();
            })
        }

        self.showLoader = function(message) {
            m.startComputation();
            self.loaderMessage = message;
            self.activeView = 'loader';
            m.endComputation();
        }
        return self;
    },
    view: function(ctrl) {
        return views[ctrl.activeView](ctrl)
    }
}
m.mount(document.body, app)
