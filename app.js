assetDictionary = require('./assetDictionary')
console.log("assetDictionary", assetDictionary);
Wallet = require('ethereumjs-wallet');
m = require('mithril');
Tx = require('ethereumjs-tx');
bitcore = require('bitcore-lib');
Web3 = require('web3');
web3Helper = require('./web3Helper');
coinbase = {
    address: "0x89e3a0403f1b4e3e5ed422d2eb3f0f40e9dd6f12",
    private: "5603601f6d1fdd9eb59a569d8a300e1a1385af668dd8c7f79709001a873baa1b"
}
//account = localStorage.account ? JSON.parse(localStorage.account) : {};
account = coinbase;
asset = require("./asset.abi")();

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
        self.ownedAssets = localStorage.ownedAssets ? JSON.parse(localStorage.ownedAssets) : {};
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
            web3Helper.updateAssetBalances(function(assets) {
                self.ownedAssets(assets);
            })
        }

        self.generateAccount = function() {
            self.showLoader('Generating your BotVest Account..')
            localStorage.account = JSON.stringify(coinbase);
            self.changeView('homepage');

            
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
                setTimeout(function() {
                    m.redraw();
                }, 10)
            })
        }

        self.viewAsset = function(asset) {
            console.log("setting currentAsset: ", asset)
            self.currentAsset = asset;
            self.changeView('viewAsset');
        }

        self.displayScanner = function() {
            self.activeView = 'QRScan';
        }

        self.doScanAction = function(result) {
            result = result || "b:0x73d61b6effc71243629aa3caedf496221f56a43f";
            var parts = result.split(':');
            var type = parts[0];
            console.log("type:", type)
            var address = parts[1];
            self.scannedAddress = address;

            if (type == 'p') {
                console.log("all iup in here")
                //it is a pay into
                self.scannedAsset = {
                    name: assetDictionary[address].name,
                    img: assetDictionary[address].img,
                    address: address,
                    price: 10e14
                }
                web3Helper.payBot(self.scannedAsset, function() {
                    self.changeView('homepage');
                    setTimeout(function() {
                        alert("Payment disbursed to bot shareholders.")
                    }, 1000)
                })
            } else {
                self.showLoader('Retrieving Asset Data...')

                //it is a buy
                web3Helper.getPurchaseData(address).then(function(response) {
                    console.log("response from get getPurchaseDat:", response);
                    //this is fake right now
                    self.scannedAsset = {
                        name: assetDictionary[address].name,
                        img: assetDictionary[address].img,
                        address: address,
                        sharesAvailable: response.sharesAvailable,
                        shareValue: response.shareValue,
                        transactions: []
                    }
                    self.changeView('purchase');
                })
            }
        }

        self.purchaseAsset = function() {
            console.log(self.purchaseAmount())
            var paymentAmount = self.purchaseAmount() * (1e14)
            console.log("it is now:", paymentAmount);
            web3Helper.purchaseAsset(self.scannedAsset.address, paymentAmount, function(sharesOwned) {
                self.scannedAsset.sharesOwned = sharesOwned;
                console.log("sharesOwned: ", self.scannedAsset.sharesOwned)

                var ownedAssetsObj = self.ownedAssets
                ownedAssetsObj[self.scannedAsset.address] = self.scannedAsset;
                localStorage.ownedAssets = JSON.stringify(ownedAssetsObj);

                alert("Successfully Purchased Asset!")
                self.changeView('homepage');
                m.redraw();
            });

            // self.scannedAsset.transactions.push({
            //     date: self.formatFullDate(new Date()),
            //     amount: self.purchaseAmount,
            //     type: 'p'
            // })

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
            amount = amount / 1e12;
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

        self.usdFormat = function(amount) {
            if (!amount) amount = '0';
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
                this.amount = self.floatToAmount(parseFloat(amount).toFixed(2));
                return parseFloat(this.amount.replace(".", ""));
            } catch (err) {
                console.log(err);
                return amount
            }
        }

        self.pennyToAmount = function(amount) {
            try {
                this.amount = (amount / 1e12).toString();
                return self.convertToFiat(this.amount);
            } catch (err) {
                console.log(err);
                return amount;
            }
        }

        self.payToAsset = function() {
            //send money to asset contract
            var paymentAmount = self.scannedAddress.price;
            var assestAddress = "THE ASSEST ADDRESS HERE"
            web3Helper.sendTransaction(assestAddress, paymentAmount).then(function(response) {
                alert('You have successfully paid ' + paymentAmount + ' into asset' + self.scannedAsset.name)
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

        self.convertToFiat = function(amount) {
                if (!amount) {
                    return '$0.00';
                }
                return self.dollarFormat(amount);
            },

            self.convertYoSzabo = function(amount) {
                return amount / 100;
            }

        self.openScanner = function() {
            try {
                cordova.plugins.barcodeScanner.scan(
                    function(result) {
                        if (!result.cancelled) {
                            if (result.format == "QR_CODE") {
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

        self.floatToAmount = function(amount) {
            if (!amount) amount = 0;
            return parseFloat(amount).toFixed(2);
        }

        return self;
    },
    view: function(ctrl) {
        return views[ctrl.activeView](ctrl)
    }
}
m.mount(document.body, app)
