Wallet = require('ethereumjs-wallet');
m = require('mithril');
Tx = require('ethereumjs-tx');
bitcore = require('bitcore-lib');
Web3 = require('web3');
web3Helper = require('./web3Helper');
coinbase = {
    address: "0x89e3a0403f1b4e3e5ed422d2eb3f0f40e9dd6f12",
    privateKey: "5603601f6d1fdd9eb59a569d8a300e1a1385af668dd8c7f79709001a873baa1b"
}
account = localStorage.account ? JSON.parse(localStorage.account):{}; 


views = {
    welcome: require('./views/welcome.js'),
    homepage: require('./views/homepage.js'),
    viewAsset: require('./views/viewAsset.js'),
    QRScan: require('./views/QRScan.js'),
    purchase: require('./views/purchase.js'),
    portfolio: require('./views/portfolio.js'),
    loader: require('./views/loader.js'),
    pay: require('./views/pay.js')
}

var app = {
    controller: function() {

        var self = this;
        self.activeView = (localStorage.account) ? 'homepage' : 'welcome';
        self.loaderMessage = '';
        self.accountBalance = null;
        self.currentAsset = null;
        self.ownedAssets = [];
        self.purchaseAmount = m.prop(0);
        self.purchaseShares = 0;
        self.scannedAddress = '';

        
        self.updateBalance = function() {
            web3Helper.getAccountBalance().then(function(balance) {
                self.accountBalance = balance;
                self.doRedraw();
            })
        }

        self.generateAccount = function() {
            self.showLoader('Generating your BotVest Account..')
            var privKey = new bitcore.PrivateKey().toString();
            var userKey = new Buffer(privKey, 'hex');
            var wallet = Wallet.fromPrivateKey(userKey);
            account = {
                address: wallet.getAddressString(),
                private: privKey
            }
            localStorage.account = JSON.stringify(account);
            web3Helper.fundAccount(account.address, 10000).then(function() {
                self.changeView('homepage')
            })
        }

        self.viewAsset = function(asset) {
            self.currentAsset = asset;
            self.changeView('viewAsset');
        }

        self.displayScanner = function() {
            self.activeView = 'QRScan';
        }

        self.doScanAction = function(result) {
            //first parse the result string to get type,address,price
            //if result is of type p then you immediately diplay the pay template;
            //else if its type b then show loader and get the purchase data for that 
            //address from the chain.
            //Once you have the purchase data from the chain, format scannedAsset to have 
            //requisite data and then show the purchase data template
            self.showLoader('Retrieving Asset Data...')
            var parts = result.split(':');
            self.scannedAddress = parts[1];
            if(parts[0] == 'p'){
                //it is a pay into
                self.scannedAsset = {
                    address: parts[1],
                    price: parts[2],
                    name: 'Asset Name Here'
                }
                self.changeView('pay');
            } else {
                //it is a buy
                web3Helper.getPurchaseData().then(function(response) {
                    //this is fake right now
                    self.scannedAsset = {
                        address: "1321EF232",
                        name: "Fioretti",
                        sharesAvailable: "1000",
                        shareValue: "$1.00",
                        totalShareValue: "$1,000.00"
                    }
                    self.changeView('purchase');
                })
            }
        }

        self.purchaseAsset = function() {
            console.log("now purchasing asset:");
            var response = {
                name: 'Fioretti',
                sharesOwned: "1000",
                shareValue: "$1.00",
                totalShareValue: '$1,000.00',
                transactions: [{
                    date: "03-21-2015",
                    amount: '- $1,000.00'
                }]
            }
            self.ownedAssets.push(response);
            alert("Successfully Purchased Asset!")
            self.changeView('homepage');
            return
            web3Helper.sendransaction(self.scannedAddress, self.purchaseAmount).then(function(response) {
                //now add the purchased asset to owned assets array
                var response = {
                    name: 'Fioretti',
                    sharesOwned: "1000",
                    shareValue: "$1.00",
                    totalShareValue: '$1,000.00',
                    transactions: [{
                        date: "12-12-2012",
                        amount: '+ $100.00'
                    }, {
                        date: "03-21-2015",
                        amount: '- $1,000.00'
                    }]
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

        self.dollarFormat = function(amount) {
            if (!amount) amount = '0';
            amount = amount/1e12;
            amount = amount.toString();
            amount = amount.replace(/\$/g, '');
            amount = amount.replace(/,/g, '');

            var dollars = amount.split('.')[0],
                cents = (amount.split('.')[1] || '') + '00';
            var dollars = dollars.split('').reverse().join('')
                .replace(/(\d{3}(?!$))/g, '$1,')
                .split('').reverse().join('');
            return '$' + dollars + '.' + cents.slice(0, 2);
        }

        self.amountToPenny = function(amount) {
            try {
                this.amount = this.floatToAmount(parseFloat(amount).toFixed(2));
                return parseFloat(this.amount.replace(".", ""));
            } catch (err) {
                console.log(err);
                return amount
            }
        }

        self.pennyToAmount = function(amount) {
            try {
                this.amount = (amount / 1e12).toString();
                return this.convertToFiat(this.amount);
            } catch (err) {
                console.log(err);
                return amount;
            }
        }

        self.payToAsset = function() {
            //send money to asset contract
            var paymentAmount = self.scannedAddress.price;
            var assestAddress = "THE ASSEST ADDRESS HERE"
            web3Helper.sendransaction(assestAddress, paymentAmount).then(function(response){
                alert('You have successfully paid '+paymentAmount+' into asset'+ self.scannedAsset.name)
                self.changeView('homepage')
            })
        }

        self.openScanner = function() {
            try {
                cordova.plugins.barcodeScanner.scan(
                    function(result) {
                        if (!result.cancelled) {
                            if (result.format == "QR_CODE") {
                                alert("got a result");
                                alert(result);
                                self.doScanAction(result);
                            }
                        }
                    },
                    function(error) {
                        alert("Scanning failed: " + error);
                    })
            } catch (e) {
                alert("error");
                alert(e);
            }
        }

        return self;
    },
    view: function(ctrl) {
        return views[ctrl.activeView](ctrl)
    }
}
m.mount(document.body, app)
