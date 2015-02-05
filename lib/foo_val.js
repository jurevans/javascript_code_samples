/*
    FOO.Val
    
    lib/foo_val.js

    Form Validation Framework
    Author(s): Justin Evans
    Copyright 2009, 2010, 2011, FOO, Inc
  
    Requires jquery.1.2[+].x[.min].js
    Requires jQuery-Tools
    Requires JSON.js (Douglas Crockford)
  
    ----------------------------------------
    Requires Foo JavaScript Framework:
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


/*
	Two key ideas: there are indiviual handlers and collective handlers
	indiviual handlers are passed into the register method, and are called on individual events
	collective handlers are passed into the object instantiation, and are called on collective events
	onCollectiveError: handler on validation error
	onCollectiveSuccess: handler on validation success
*/

// Define Root Namespace -JRE

var FOO = FOO || {};

FOO.Val = function(onCollectiveError, onCollectiveSuccess)
{
	this.onCollectiveError = onCollectiveError;
	this.onCollectiveSuccess = onCollectiveSuccess;
	
	this.v = [];
	this.Success = false;
	this.scrollToError = true;
};

FOO.Val.prototype = {
	/*args: 
	Required: obj, onValidate
		onValidate must return a true or false indicating success or failure
	Optional: domObj, errorMsg, onError, onSuccess
	*/
	register : function(args)
	{
		this.v.push(args);
	},
	validate : function()
	{
		this.Success = true;
		for(var i = 0;i < this.v.length; i++)
		{
			if(!this.v[i].onValidate(this.v[i].obj))
			{
				this.Success = false;
				//individual
				if(this.v[i].onError) this.v[i].onError(this.v[i]);
				this.v[i].valid = false;
				if( this.v[i].stopOnError )
					break;
			}
			else
			{
				//individual
				if(this.v[i].onSuccess) this.v[i].onSuccess(this.v[i]);
				this.v[i].valid = true;
			}
		}
		
		//collective success/error handlers
		if(this.Success && this.onCollectiveSuccess)
			this.onCollectiveSuccess(this.v);
		
		if(!this.Success && this.onCollectiveError)
			this.onCollectiveError(this.v);
		
		return this.Success;
	}
};

//
//	Form Validator
//
//FOO.Val.Form inherits from our base validation class
//it provides default handling, but you can still supply your own individual/collective error/success handlers
FOO.Val.Form = function(onCollectiveError, onCollectiveSuccess){
	//pass in default values if they are not supplied
	FOO.Val.Form.superclass.constructor.call(this,onCollectiveError || FOO.Val.$.formError, onCollectiveSuccess ||  FOO.Val.$.formSuccess);
};

//inherit from base validation class
FOO.Extend(FOO.Val.Form,FOO.Val);

//override register class
FOO.Val.Form.prototype.register = function(args)
{
	//set default handlers
	if(!args.onError) args.onError = FOO.Val.$.highlight;
	if(!args.onSuccess) args.onSuccess = FOO.Val.$.undoHighlight;
	
	//call base method
	FOO.Val.Form.superclass.register.call(this,args);
}

FOO.Val.Form.CollectiveError = function(v) {
	var totalMessage = '';
	for( var i=0; i<v.length; i++ ) {
		if(!v[i].valid) {
			totalMessage += /* "<div><strong>&raquo;</strong>&nbsp;" + */ v[i].errorMsg /*+ "</div>"*/;
		}
	}

	var container = $(v[0].domObj).closest("form").find(".validation:first");
	container.html(totalMessage);
	container.addClass(FOO.Config.defaultErrorClass);
	container.removeClass("success");
	container.css({display: 'block'});
	
	if( v.scrollToError ) {
		window.scrollTo(container.scrollTop(), container.scrollLeft());
	}
}

FOO.Val.Form.CollectiveSuccess = function(v) {
	var container = $(v[0].domObj).closest("form").find(".validation:first");
	container.css({display: 'none'});
	if( v.scrollToError ) {
		window.scrollTo(0,0);
	}
}

//
//	Line Item Validator
//
//FOO.Val.Form inherits from our base validation class
//it provides default handling, but you can still supply your own individual/collective error/success handlers
FOO.Val.LineItem = function(onCollectiveError, onCollectiveSuccess){
	//pass in default values if they are not supplied
	FOO.Val.LineItem.superclass.constructor.call(this,onCollectiveError,onCollectiveSuccess);
};

//inherit from base validation class
FOO.Extend(FOO.Val.LineItem,FOO.Val);

//override register class
FOO.Val.LineItem.prototype.register = function(args)
{
	//set default handlers
	if(!args.onError) args.onError = FOO.Val.$.lineItemHighlight;
	
	//call base method
	FOO.Val.LineItem.superclass.register.call(this,args);
}

FOO.Val.$ = {//helper class with predefined validation methods
	handleAjaxNonLogicError : function(xmlHttpReq, err, e) //called by jQuery
	{
		var container = $(FOO.Config.defaultMessageContainer);
		container.html("An ajax error occured");
		container.addClass(FOO.Config.defaultErrorClass);
		container.css({display: 'block'});
		
		window.scrollTo(container.scrollTop(), container.scrollLeft());
	},
	
	handleAjaxLogicError : function(responseJSON) //called by FOOAJAX
	{
		var container = $(FOO.Config.defaultMessageContainer);
		container.html(responseJSON.Error);
		container.addClass(FOO.Config.defaultErrorClass);
		container.css({display: 'block'});
		
		window.scrollTo(container.scrollTop(), container.scrollLeft());
	},
	
	formError : function(v) {	
		var totalMessage = '';
		for(var i = 0;i< v.length;i++)
		{
			if(!v[i].valid){totalMessage += "<div><strong>&raquo;</strong>&nbsp;" + v[i].errorMsg + "</div>"}
		}
	
		var container = $(FOO.Config.defaultMessageContainer);
		container.html(totalMessage);
		container.addClass(FOO.Config.defaultErrorClass);
		container.removeClass("success");
		container.css({display: 'block'});
		
		window.scrollTo(container.scrollTop(), container.scrollLeft());
	},
	
	formSuccess : function(v) {
		var container = $(FOO.Config.defaultMessageContainer);
		container.css({display: 'none'});
		//container.html("");
		window.scrollTo(0,0);
	},
	
	highlight : function (v) {
		var obj = $(v.domObj);
		obj.parent("div").addClass(FOO.Config.defaultErrorClass);
		
	},
	
	undoHighlight : function(v) {
		var obj = $(v.domObj);
		obj.parent("div").removeClass(FOO.Config.defaultErrorClass);
	},

	lineItemValidate : function( row ) {
		var num = row.find(".qty").val();
		return FOO.Val.$.IsPositiveNumeric( num );
	},
	
	validateRegistryItem : function( row ) {
		var wants = row.find(".qty").val();
		var has = row.find(".has").val();
		//TODO ignore non numerics
		return !FOO.Val.$.IsPositiveNumeric( wants ) || wants>=has;
	},
	
	lineItemHighlight : function( v ) {
		var row = $(v.domObj);
		row.addClass(FOO.Config.defaultErrorClass);
		row.find(".validation").css({display:'block'}).html(v.errorMsg);
	},

	IsNumeric  : function (num)
	{
	    return !isNaN(num);
	},
	
	IsPositiveNumeric  : function (num)
	{
		if( !FOO.Val.$.IsNumeric( num ) ) {
			return false;
		}
		return num>=0;
	},
	
	IsValidZipCode : function(zip)
	{
		var validZip = /\d{5}(-\d{4})?/
		return validZip.test(zip);  
	},
    
	IsValidEmailAddress : function (email)
	{
		var emailRegex  = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
		return emailRegex.test(email);
	},

	IsValidPhone : function(phoneNumber)
	{
	    var phoneRegex = /\d{10}/;
	    return phoneRegex.test(phoneNumber);
	},
	
	IsValidPhoneNotRequired : function(phoneNumber)
	{
		if($.trim(phoneNumber) == '')
		{
			return true;
		}
		else
		{
			return FOO.Val.$.IsValidPhone(phoneNumber);
		}
	},
 
	 //send in a textbox that is required, returns a msg list with an error
	 IsValidReqTextBox : function(selector)
	 {
		return $.trim($(selector).val()) != '';
	 },
 
	 IsValidReqDDL : function(selector)
	 {
		return $(selector)[0].selectedIndex != 0;
	 },
 
	 IsValidReqRadGroup : function(name)
	 {	
		return $("input[name=" + name + "][checked]").length == 1;
	 },

	IsValidDate : function(date)
	{
		var regex = /\d{1,2}\/\d{1,2}\/\d{4}/;
		return regex.test(date);
	},
	
	IsValidPassVerifyRequired : function(passArray)
	{
		return $.trim($(passArray[0]).val())!= '' && $.trim($(passArray[1]).val()) != '' && $.trim($(passArray[0]).val()) == $.trim($(passArray[1]).val());
	}

//  Old Version of IsValidDate ... 
//	IsValidDate : function(date)
//	{
//		var validDate = new RegExp("(?=\d)^(?:(?!(?:10\D(?:0?[5-9]|1[0-4])\D(?:1582))|(?:0?9\D(?:0?[3-9]|1[0-3])\D(?:1752)))((?:0?[13578]|1[02])|(?:0?[469]|11)(?!\\/31)(?!-31)(?!\.31)|(?:0?2(?=.?(?:(?:29.(?!000[04]|(?:(?:1[^0-6]|[2468][^048]|[3579][^26])00))(?:(?:(?:\d\d)(?:[02468][048]|[13579][26])(?!\x20BC))|(?:00(?:42|3[0369]|2[147]|1[258]|09)\x20BC))))))|(?:0?2(?=.(?:(?:\d\D)|(?:[01]\d)|(?:2[0-8])))))([-.\\/])(0?[1-9]|[12]\d|3[01])\2(?!0000)((?=(?:00(?:4[0-5]|[0-3]?\d)\x20BC)|(?:\d{4}(?!\x20BC)))\d{4}(?:\x20BC)?)(?:$|(?=\x20\d)\x20))");
//	    return validDate.test(date);
//	}
};