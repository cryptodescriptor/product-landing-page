var UID = {
  _current: 0,
  getNew: function(){
    this._current++;
    return this._current;
  }
};

/* proto allows editing of pseudo element styles */
HTMLElement.prototype.pseudoStyle = function(element,prop,value) {
  var _this = this;
  var _sheetId = "pseudoStyles";
  var _head = document.head || document.getElementsByTagName('head')[0];
  var _sheet = document.getElementById(_sheetId) || document.createElement('style');
  _sheet.id = _sheetId;
  var className = "pseudoStyle" + UID.getNew();
  
  _this.className +=  " "+className; 
  
  _sheet.innerHTML += " ."+className+":"+element+"{"+prop+":"+value+"}";
  _head.appendChild(_sheet);
  return this;
};

Object.prototype.hasClass = function(className) {
  return (this.classList.contains(className));
};

Object.prototype.addClass = function(className) {
  this.classList.add(className);
}

Object.prototype.addClasses = function(classes) {
  var self = this;

  classes.forEach(function(c) {
    self.classList.add(c);
  });
}