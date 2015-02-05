/*
    FOO.* {Global Methods}
    
    lib/foo_global.js

    Utility Functions related to Framework
    Author(s): Justin Evans
    Copyright 2009, 2010, 2011, FOO Inc.
  
    Requires jquery.1.2[+].x[.min].js
    Requires jQuery-Tools
    Requires JSON.js (Douglas Crockford)
  
    -----------------------------------------------------------
    Foo JavaScript Framework (files that depend on this):
    ------------------
    
    lib/foo_global.js
    lib/foo_val.js
    lib/foo_ajax.js
    lib/foo_utils.js
    lib/foo_ui.js
    
    ------------------

    Version 0.5 Beta
    
    ----------------------------------------
*/

// Define Root Namespace -JRE

var FOO = {};

//used to automate the inheritance process for our JS classes
FOO.Extend = function(subClass, superClass) {
	//create empty container
	var F = function() {};
	
	//set prototype to the super class prototype
	F.prototype = superClass.prototype;
	
	//set the prototype of the subclass to our container
	subClass.prototype = new F();
	
	//reset the subclass constructor
	subClass.prototype.constructor = subClass;
	
	//set the superclass to the super class prototype
	subClass.superclass = superClass.prototype;
	
	if(superClass.prototype.constructor == Object.prototype.constructor) {
		superClass.prototype.constructor = superClass;
	}
}
// Override Configuration to match Forms
FOO.Config = {
	defaultMessageContainerId : "#validation",
	defaultErrorClass : "error",
	defaultSuccessClass : "success"
};

FOO.Debug = {
	trace : function(str)
	{
		if(console)
		{
			console.log(str);
		}
	},
	error : function(str)
	{
		if(console)
		{
			console.error(str);
		}
	}
}

