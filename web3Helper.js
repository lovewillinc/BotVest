module.exports = function() {

    HookedWeb3Provider = require("hooked-web3-provider");
    provider = new HookedWeb3Provider({
        host: "http://0.0.0.0:10918",
        transaction_signer: {
            hasAddress: function(address, callback) {
                callback(null, true);
            },
            signTransaction: function(txParams, callback) {
                function strip0x(input) {
                    if (typeof(input) !== 'string') {
                        return input;
                    } else if (input.length >= 2 && input.slice(0, 2) === '0x') {
                        return input.slice(2);
                    } else {
                        return input;
                    }
                }

                function add0x(input) {
                    if (typeof(input) !== 'string') {
                        return input;
                    } else if (input.length < 2 || input.slice(0, 2) !== '0x') {
                        return '0x' + input;
                    } else {
                        return input;
                    }
                }

                var ethjsTxParams = {};
                ethjsTxParams.from = add0x(txParams.from || account.address);
                ethjsTxParams.to = add0x(txParams.to);
                ethjsTxParams.gasLimit = add0x(15e6);
                ethjsTxParams.gasPrice = add0x(1);
                ethjsTxParams.nonce = add0x(txParams.nonce || new Date().getTime() + parseInt(Math.random() * 100));
                ethjsTxParams.value = add0x(txParams.value);
                ethjsTxParams.data = add0x(txParams.data);

                var tx = new Tx(ethjsTxParams);
                console.log(ethjsTxParams);
                tx.sign(new Buffer(txParams.fromObj && txParams.fromObj.private || account.privateKey, 'hex'));
                var serializedTx = '0x' + tx.serialize().toString('hex');

                callback(null, serializedTx);
            }
        }
    });
    web3 = new Web3(provider);
    account = {};

    return web3Helper = {
        getAccountBalance: function() {
            var deferred = m.deferred();
            if (!Object.keys(account).length) return deferred.reject("no account");
            balance = web3.fromWei(web3.eth.getBalance(account.address), "wei").toString();
            deferred.resolve(balance);
            return deferred.promise;
        },
        sendTransaction: function(toAddress, amount) {
            var deferred = m.deferred();
            web3.eth.sendTransaction({
                from: account.address,
                fromObj: account,
                to: toAddress,
                value: amount,
                gas: 7e4,
                gasPrice: 10
            }, function(err, result) {
                if (err != null) {
                    console.log(err);
                    deferred.reject(err)
                    console.log("ERROR: Transaction didn't go through. See console.");
                } else {
                    deferred.resolve(result);
                    console.log("Transaction Successful!");
                    console.log(err, result);
                }
            })
            return deferred.promise;
        },
        fundAccount: function(toAddress) {
            var deferred = m.deferred();

            web3.eth.sendTransaction({
                from: coinbase.address,
                fromObj: coinbase,
                to: toAddress,
                value: 100000
            }, function(err, result) {
                if (err != null) {
                    console.log(err);
                    deferred.reject(false)
                    console.log("ERROR: Transaction didn't go through. See console.");
                } else {
                    deferred.resolve(true);
                    console.log("Transaction Successful!");
                    console.log(err, result);
                }
            })
            return deferred.promise;
        },
        getPurchaseData: function(address) {
            var deferred = m.deferred();
            var purchaseAsset = asset.at(address);
            var purchaseData = {
                shareValue: purchaseAsset.currentPrice.call().toNumber(),
                sharesAvailable: purchaseAsset.availableShares.call().toNumber()
            }
            deferred.resolve(purchaseData);
            return deferred.promise;
        },
        purchaseAsset: function(address, value, callback) {
            var purchaseAsset = asset.at(address);
            purchaseAsset.buyShares({
                value: value,
                from: account.address,
                fromObj: account
            }, function(response){
                var sharesOwned = purchaseAsset.balanceOf(account.address).toNumber()
                console.log("sharesOwned", sharesOwned)
                callback(sharesOwned)
                console.log("response from purchaseAsset!!!:", arguments);
            })
        },
        updateAssetBalances: function(callback) {
            try {
                var ownedAssets = JSON.parse(localStorage.ownedAssets);
                Object.keys(ownedAssets).map(function(ownedAsset) {
                    var theAsset = asset.at(ownedAsset.address);
                    ownedAsset.sharesOwned = theAsset.balanceOf(account.address).toNumber()
                })
                localStorage.ownedAssets = JSON.stringify(ownedAssets);
                callback(ownedAssets)
            } catch(e) {
                console.log("no owned assets", e)
            }
        },
        payBot: function(asset, callback) {
            web3Helper.sendTransaction(asset.address, asset.price).then(function() {
                callback()
            })
        }
    }
}()
