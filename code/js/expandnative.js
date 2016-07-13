HTMLElement.prototype.hasClass = function(c){
    var re = new RegExp("(^|\\s)" + c + "(\\s|$)", "g");
    return re.test(this.className);
};
HTMLElement.prototype.addClass = function(c){
    if (!this.hasClass(c)) {
		this.className = (this.className + " " + c).replace(/\s+/g, " ").replace(/(^ | $)/g, "");
	}
    return this;
};
HTMLElement.prototype.removeClass = function(c){
    var re = new RegExp("(^|\\s)" + c + "(\\s|$)", "g");
    this.className = this.className.replace(re, "$1").replace(/\s+/g, " ").replace(/(^ | $)/g, "");
    return this;
};
HTMLElement.prototype.toggleClass = function(c){
	return this.hasClass(c) ? this.removeClass(c) : this.addClass(c);
};
HTMLElement.prototype.appendFirstChild = function(node){
    this.firstChild ? this.insertBefore(node, this.firstChild) : this.appendChild(node);
};
HTMLElement.prototype.exchange = function(refNode){
	var tempParentNode = refNode.parentNode,
		tempBeforeNode = refNode.nextElementSibling;
	this.parentNode.insertBefore(refNode,this);
	if(tempBeforeNode){
		tempParentNode.insertBefore(this,tempBeforeNode);
	}else{
		tempParentNode.appendChild(this);
	}
	return refNode;
};

function extend(Child, Parent){
	var F = function(){};
	F.prototype = Parent.prototype;
	Child.prototype = new F();
	Child.prototype.constructor = Child;
}

function augment(receivingObject, givingObject){
	var i, methodName;
	if(arguments[2]){
		for(i = 2, len = arguments.length; i < len; i++){
			receivingObject.prototype[arguments[i]] = givingObject.prototype[arguments[i]];
		}
	}else{
		for(methodName in givingObject.prototype){
			receivingObject.prototype[methodName] = givingObject.prototype[methodName];
		}
	}
}
augment(NodeList, Array, 'forEach', 'filter', 'slice');
augment(HTMLCollection, Array, 'forEach', 'filter', "slice");