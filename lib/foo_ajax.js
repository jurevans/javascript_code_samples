/*
    FOO.Ajax
    
    lib/foo_ajax.js

    Ajax functions and constructors, definitions of Ajax objects used in site.
    Author(s): Justin Evans
    Copyright 2009, 2010, 2011, FOO, Inc.
  
    Requires jquery.1.4[+].x[.min].js
    Requires jQuery-Tools
    Requires JSON.js (Douglas Crockford)
  
    ----------------------------------------
    Requires Foo JavaScript Framework:
    ------------------
    
    lib/foo_global.js
    lib/foo_validation.js
    lib/foo_ajax.js
    lib/foo_utils.js
    lib/foo_ui.js
    
    ------------------

    Version 0.5 Beta
    
    ----------------------------------------
*/

FOO = FOO || {};

FOO.AJAX = {
	htmlDecode : function(str)
	{
		return str.replace(/&amp;/g,'&').replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&quot;/g, '"');
	}
};

FOO.AJAX.Base = function() {};
FOO.AJAX.Base.prototype = {
	submit : function(callBackHandler,errorHandler, args)
	{
		
		var handler = function(responseJSON, status)
		{
			responseJSON = eval(responseJSON); // eval! :)
			//run omniture/other client side script generated from the server
			if(responseJSON.clientScript)
			{
				eval(responseJSON.clientScript);
			}
		
			//if success was explicitely set as false on the server, we need to display the error message
			if(!responseJSON.Success)
			{
				if(!errorHandler)
					FOO.Val.$.handleAjaxLogicError(responseJSON);
				else
					errorHandler(responseJSON);
			}
			else
			{
				callBackHandler(responseJSON.ajaxObject,responseJSON, status);			
			}
		}
		
		$.ajax({
			type: "POST",
			dataType: "json",
			cache: false,
			error: FOO.Val.handleAjaxNonLogicError,
			url: '/post/url/',
			success: handler,
			processData: false,
			data: JSON.stringify(this)
		});
	}
};

FOO.AJAX.Array = function(){
	this.array = [];
	
	this.push = function(obj){
		this.array.push(obj);
	};
	
	this.getLength = function()
	{
		return this.array.length;
	};
};

FOO.Extend( FOO.AJAX.Array, FOO.AJAX.Base );

//override the submit function
FOO.AJAX.Array.prototype.submit = function(callBackHandler, errorHandler){
	FOO.AJAX.Array.superclass.submit.call(this.array, callBackHandler, errorHandler);	
};

FOO.AJAX.UserInfo = function()
{
	this.FirstName = '';
	this.LastName = '';
	this.Company = '';
	this.StreetAddress1 = '';
	this.StreetAddress2 = '';
	this.City = '';
	this.State = '';
	this.ZIP = '';
	this.DayPhone = '';
	this.NightPhone = '';
	this.Email = '';
	this.OptIn = false;
	
	// Get User Info JSON
	this.get = function() {
		return {
			'first_name' : '\'' + this.FirstName + '\'',
			'last_name' : '\'' + this.LastName + '\'',
			'company' : '\'' + this.Company + '\'',
			'address' : {
				'street_address_1' : '\'' + this.StreetAddress1 + '\'',
				'street_address_2' : '\'' + this.StreetAddress2 + '\'',
				'city' : '\'' + this.City + '\'' + this.City + '\'',
				'state' : '\'' + this.State + '\'' + this.State + '\'',
				'zip' : '\'' + this.ZIP + '\''
			},
			'phones' : [
				{
					'type' : 'day',
					'number' : '\'' + this.DayPhone + '\''
				},
				{
					'type' : 'night',
					'number' : '\'' + this.NightPhone + '\''
				}
			],
			'email' : '\'' + this.Email + '\'',
			'opt_in' : '\'' + this.OptIn + '\''
		}
	};

};

//inherit from base class
FOO.Extend( FOO.AJAX.UserInfo, FOO.AJAX.Base );

//Address and Account are merged into one
FOO.AJAX.Account = function( a )
{
	this.action = a;

	this.PrimaryAddress = new FOO.AJAX.Address();
	this.AccountID = 0;
	this.UserName = '';
	this.Password= '';
	this.Remember = false;
};

//inherit from base user info class
FOO.Extend( FOO.AJAX.Account, FOO.AJAX.Base );

FOO.AJAX.Address = function(a)
{
	this.action = a;
	this.Nickname = '';
	this.AccoundID = 0;
	this.AddressID = 0;
	this.Override = false;
}

//inherit from base user info class
FOO.Extend( FOO.AJAX.Address, FOO.AJAX.UserInfo );

FOO.AJAX.ContactUs = function(a)
{
	this.action = a;
	
	this.Subject = '';
	this.Other = '';
	this.OrderNum = 0;
	this.ItemNum = 0;
	this.Process = '';
	this.Comments = '';
};

//inherit from base user info class
FOO.Extend( FOO.AJAX.ContactUs, FOO.AJAX.UserInfo );

//Request Catalogue / Announcement Cards, Swatches
FOO.AJAX.Request = function(a)
{
	this.action = a;
	
	this.RequestCountry = "USA";
	this.RequestCount = 0;	
	this.SwatchID;
}
FOO.Extend(FOO.AJAX.Request, FOO.AJAX.UserInfo);

