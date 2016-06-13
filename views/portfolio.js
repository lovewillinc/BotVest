module.exports = function(ctrl) {
    return [
        m("h3", "PORTFOLIO HERE"),
        m('a',{
        	onclick: function(){
        		ctrl.activeView = 'homepage';
        	}
        }, 'back')
    ]
}
