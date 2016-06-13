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
                ethjsTxParams.from = add0x(account.address);
                ethjsTxParams.to = add0x(txParams.to);
                ethjsTxParams.gasLimit = add0x(3e6);
                ethjsTxParams.gasPrice = add0x(1);
                ethjsTxParams.nonce = add0x(txParams.nonce || new Date().getTime() + parseInt(Math.random() * 100));
                ethjsTxParams.value = add0x(txParams.value);
                ethjsTxParams.data = add0x(txParams.data);

                var tx = new Tx(ethjsTxParams);
                tx.sign(new Buffer(account.privateKey, 'hex'));
                var serializedTx = '0x' + tx.serialize().toString('hex');

                callback(null, serializedTx);
            }
        }
    });
    web3 = new Web3(provider);
    account = {};
    var coinbase = {
        address:"0x89e3a0403f1b4e3e5ed422d2eb3f0f40e9dd6f12",
        privateKey:"5603601f6d1fdd9eb59a569d8a300e1a1385af668dd8c7f79709001a873baa1b"
    }

    return web3Helper = {
        getAccountBalance: function() {
            var deferred = m.deferred();
            setTimeout(function() {
                    deferred.resolve(100);
                }, 2000)
                //deferred.resolve(web3.fromWei(web3.eth.getBalance(account.address), "wei").toString())
            return deferred.promise
        },
        sendransaction: function(toAddress, amount) {
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
            return deferred.promise();
        },
        fundAccount: function(toAddress, amount) {
            var deferred = m.deferred();
            web3.eth.sendTransaction({
                from: coinbase.address,
                fromObj: coinbase,
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
            return deferred.promise();
        },
        getPurchaseData: function(address) {
            var deferred = m.deferred();

            deferred.resolve(true);

            return deferred.promise;
        }
    }
}()
