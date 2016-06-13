module.exports = function() {
    web3 = new Web3();
    //web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
    account = localStorage.account ? JSON.parse(localStorage.account) : null;
    // contracts = localStorage.contracts ? JSON.parse(localStorage.contracts) : {};
    coinBaseAddress = '';

    return web3Helper = {
        createAccount: function() {
        	var deferred = m.deferred();
            var privKey = new bitcore.PrivateKey().toString();
            var userKey = new Buffer(privKey, 'hex')
            var wallet = Wallet.fromPrivateKey(userKey);
            account = {
                address: wallet.getAddressString(),
                privateKey: privKey
            }
            localStorage.account = JSON.stringify(account);
            //need to push account to chain and then fund from coinbase address
            setTimeout(function(){
            	deferred.resolve(true);
            }, 2000)
            console.log("localStorage.account is:", localStorage.account);
            return deferred.promise;
        },
        getAccountBalance: function() {
            var deferred = m.deferred();
            setTimeout(function(){
            	m.startComputation();
            	deferred.resolve(100);
            	m.endComputation();
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
        getPurchaseData: function(address) {
        }
    }
}()
