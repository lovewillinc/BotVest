Wallet = require('ethereumjs-wallet');
m = require('mithril');
Tx = require('ethereumjs-tx');
bitcore = require('bitcore-lib');
Web3 = require('web3');


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
        self.activeView = (localStorage.account) ? 'homepage' : 'welcome';
        self.loaderMessage = '';
        self.accountBalance = null;
        self.currentAsset = null;
        self.ownedAssets = [];
        self.scannedAddress = null;

        if(localStorage.account){
        	web3Helper = require('./web3Helper');
        }

        self.updateBalance = function() {
            web3Helper.getAccountBalance().then(function(balance) {
                self.accountBalance = balance
                self.doRedraw();
            })
        }

        self.generateAccount = function() {
            self.showLoader('Generating your BotVest Account..')
            var privKey = new bitcore.PrivateKey().toString();
            var userKey = new Buffer(privKey, 'hex')
            var wallet = Wallet.fromPrivateKey(userKey);
            account = {
                address: wallet.getAddressString(),
                privateKey: privKey
            }
            localStorage.account = JSON.stringify(account);
            console.log("localStorage.account is:", localStorage.account);
            web3Helper = require('./web3Helper');
            //need to push account to chain and then fund from coinbase address
            setTimeout(function() {
            	self.changeView('homepage')
            }, 2000)
        }

        self.viewAsset = function(asset) {
            self.currentAsset = asset;
            self.changeView('viewAsset');
        }

        self.displayScanner = function() {
            self.activeView = 'QRScan';
            self.currentAsset = asset;
        }

        self.doScanAction = function() {
            console.log("Now doing scan");
            self.scannedAddress = '123929AE23F';
            return;
            web3Helper.sendransaction(self.scannedAddress, self.purchaseAmount).then(function(response) {
                //now add the purchased asset to owned assets array
                var response = {
                    name: 'Fioretti',
                    shares: 1000,
                    sharePrice: 1
                }
                ctrl.ownedAssets.push(response);
                self.changeView('homepage');
            })
        }

        self.showLoader = function(message) {
            self.loaderMessage = message;
            self.activeView = 'loader';
            self.doRedraw();
        }

        self.changeView = function(view) {
            self.activeView = view;
            self.doRedraw();
        }

        self.doRedraw = function() {
            m.startComputation();
            m.endComputation();
        }
        return self;
    },
    view: function(ctrl) {
        return views[ctrl.activeView](ctrl)
    }
}
m.mount(document.body, app)