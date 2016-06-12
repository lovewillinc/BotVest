module.exports = function() {
    web3 = new Web3();
    account = localStorage.account ? JSON.parse(localStorage.account) : null;
    // contracts = localStorage.contracts ? JSON.parse(localStorage.contracts) : {};

    return web3Helper = {
        /**
         * Creates a new Ethereum wallet
         * @return {void} this function does not return anything
         */
        createAccount: function() {
            var privKey = new bitcore.PrivateKey().toString();
            var userKey = new Buffer(privKey, 'hex')
            var wallet = Wallet.fromPrivateKey(userKey);
            account = {
                address: wallet.getAddressString(),
                privateKey: privKey
            }
            localStorage.account = JSON.stringify(account);
            console.log("localStorage.account is:", localStorage.account);
        },
        getAccountBalance: function() {
            var deferred = m.deferred();
            deferred.resolve(web3.fromWei(web3.eth.getBalance(account.address), "wei").toString())
            return deferred.promise
        },
        sendransaction: function(toAddress, amount) {
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
                    console.log("ERROR: Transaction didn't go through. See console.");
                } else {
                    console.log("Transaction Successful!");
                    console.log(err, result);
                }
            })
        },
        getPurchaseData: function(address) {

        }
    }
}()
