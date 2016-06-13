module.exports = function(ctrl) {
	console.log("inside view web3helper is:", web3Helper);
    return [
        m("h3", "Homepage"),
        m("Balance",{
        	config: function() {
        		ctrl.updateBalance();
        	}
        }, ctrl.accountBalance || "Getting Balance...")
    ]
}
