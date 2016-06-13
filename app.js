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

asset  = require("./asset.abi");

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
        self.accountBalance = m.prop();
        self.currentAsset = null;
        self.ownedAssets = [];
        self.purchaseAmount = m.prop(0);
        self.purchaseShares = 0;
        self.scannedAddress = '';

        self.updateBalance = function() {
            console.log("going to get the balance:");
            web3Helper.getAccountBalance().then(function(balance) {
                m.startComputation();
                self.accountBalance(balance);
                m.endComputation();
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
            web3Helper.fundAccount(account.address).then(function() {
                self.accountBalance(100000)
                self.changeView('homepage');
                setTimeout(function(){
                    m.redraw();
                },10)
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
            var parts = result.split(':');
            var type = parts[0];
            var address = parts[1];
            var price = parts[2];
            var name = parts[3]
            self.scannedAddress = address;

            if(type == 'p'){
                //it is a pay into
                self.scannedAsset = {
                    address:address,
                    price: price,
                    name: name,
                    transactions:[]
                }
                self.changeView('pay');
            } else {
                self.showLoader('Retrieving Asset Data...')

                //it is a buy
                web3Helper.getPurchaseData().then(function(response) {
                    //this is fake right now
                    self.scannedAsset = {
                        address: address,
                        name: name,
                        sharesAvailable: "1000",
                        shareValue: "$1.00",
                        totalShareValue: "$1,000.00",
                        transactions:[]
                    }
                    self.changeView('purchase');
                })
            }
        }

        self.purchaseAsset = function() {
            self.scannedAsset.transactions.push({
                date: self.formatFullDate(new Date()),
                amount: self.purchaseAmount,
                type: 'p'
            })
            self.ownedAssets.push(self.scannedAsset);
            alert("Successfully Purchased Asset!")
            self.changeView('homepage');
            return
        }

        self.showLoader = function(message) {
            self.loaderMessage = message;
            self.activeView = 'loader';
            self.doRedraw();
        }

        self.changeView = function(view) {
            m.startComputation();
            self.activeView = view;
            m.endComputation();
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
            web3Helper.sendTransaction(assestAddress, paymentAmount).then(function(response){
                alert('You have successfully paid '+paymentAmount+' into asset'+ self.scannedAsset.name)
                self.changeView('homepage')
            })
        }

        self.formatFullDate = function(date) {
            var dd = date.getDate();
            var mm = date.getMonth() + 1; //January is 0!
            var yyyy = date.getFullYear();

            if (dd < 10) {
                dd = '0' + dd
            }

            if (mm < 10) {
                mm = '0' + mm
            }

            date = mm + '/' + dd + '/' + yyyy;
            return date;
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
