/*
    FOO.Utils
    
    foo_utils.js

    Utility Functions related to Framework
    Author(s): Justin Evans
    Copyright 2009, 2010, 2011, FOO, Inc.
  
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

// Define Root Namespace -JRE

var FOO = FOO || {};


// General Constructors :: FOO.Utils

FOO.Utils = FOO.Utils ||
{
    // Build Constructors [ Extend, Interface, ScopeDelegate, EventDelegate, ManageCookies ]
    
    // Extend : Inheritance model based on Classical inheritance methods
    Extend : function(sub_class, super_class) {
        // Create empty Object constructor
        var F = function() {};

        F.prototype = super_class.prototype;
		sub_class.prototype = new F();
		sub_class.prototype.constructor = subClass;
		sub_class.superclass = super_class.prototype;
        
        if( super_class.prototype.constructor == Object.prototype.constructor )
        {
            super_class.prototype.constructor = super_class;
        }
    },
    // Interface : Constructor 
    Interface : function(name, methods)
    {
        if( arguments.length != 2 )
        {
            throw new Error('FOO.Utils.Inteface  called with ' +
                            arguments.length +
                            ' arguments, expected exactly 2.');
        }
        
        this.name = name;
        this.mehods = [];
        
        for (var i, l = methods.length; i < l; i++)
        {
            if( typeof( methods[i] ) !== 'string')
            {
                throw new Error( 'Non-string FOO.Utils.Interface constructor names.' );
            }
            
            this.methods.push( methods[i] );
        }
    },
    
    // Call methods outside of their intended scope: Augmented version of "call" & "apply".
    ScopeDelegate : {
        create: function( scope, method ){
            return function(){
                return method.apply(scope, arguments);
            };
        }
    },
    // FOO.Utils.Events
    Events : function( obj_top_level, dom_obj_type, bind_event, func_reference, args ){
        // IMPLEMENTS! --ToDo -JRE
        
        this._obj_top_level = obj_top_level; // Element to listen on
        this._dom_obj_type = dom_obj_type; // Type of element to filter / delegate to.
        this._bind_event = bind_event; // Event to bind on top-level element
        this._func_reference = func_reference; // Function to call on bind
        this._args = (args && args.length > 0) ? args : []; // array of arguments to pass into Function
    },
    
    ManageCookies : {
        getCookie : function( name ) {
            var start = document.cookie.indexOf( name + "=" );
            var len = start + name.length + 1;
            if ( ( !start ) && ( name != document.cookie.substring( 0, name.length ) ) )
            {
                    return null;
            }
            if ( start == -1 )
            {
                    return null;
            }
            var end = document.cookie.indexOf( ';', len );
            if ( end == -1 )
            {
                end = document.cookie.length;
            }
            return unescape( document.cookie.substring( len, end ) );
        },
        
        setCookie : function( name, value, expires, path, domain, secure )
        {
            var today = new Date();
            today.setTime( today.getTime() );
            if ( expires )
            {
                    expires = expires * 1000 * 60 * 60 * 24;
            }
            var expires_date = new Date( today.getTime() + (expires) );
            document.cookie = name + '=' + escape( value ) +
                ( ( expires ) ? ';expires=' + expires_date.toGMTString() : '' ) + //expires.toGMTString()
                ( ( path ) ? ';path=' + path : '' ) +
                ( ( domain ) ? ';domain=' + domain : '' ) +
                ( ( secure ) ? ';secure' : '' );
        },
        
        deleteCookie : function( name, path, domain )
        {
            if ( getCookie( name ) )
            {
                document.cookie = name + '=' +
                    ( ( path ) ? ';path=' + path : '') +
                    ( ( domain ) ? ';domain=' + domain : '' ) +
                    ';expires=Thu, 01-Jan-1970 00:00:01 GMT';
            }
        }
    }
    
};

// FOO.Utils.Inteface.Implements - uses "strict" type checking for a varitey of patterns:
// Factory || Composite || Decorator || Command
// Static class method:

FOO.Utils.Interface.Implements = function( object ) {
    
    if( arguments.length < 2 )
    {
        throw new Error( 'Function FOO.Utils.Interface.Implements called with ' +
                         arguments.length +
                         ' arguments, but expected at least 2.'); // NOTE: Make "arguments" requirement variable
    }
  
    for( var i = 1, l = arguments.length; i < l; i++ )
    {
        var curr_interface = arguments[i];
        if( curr_interface.constructor != FOO.Utils.Interface )
        {
            throw new Error ( 'Function FOO.Utils.Interface.Implements expects ' +
                              'arguments to be instances of FOO.Utils.Interface.' );
        }
        
        for( var j = 0, l_methods = curr_interface.methods.length; j < l_methods; j++ )
        {
            var method = curr_interface.methods[j];
            if(!object[method] || typeof ( object[method] ) !== 'function' )
            {
                throw new Error( 'Function FOO.Utils.Interface.Implements: object ' +
                                 'does not implement the ' + curr_interface.name +
                                 ' interface. Method ' + method + ' was not found.');
            }
        }
    }
    
};


// Event delegation - Static class method:
// FOO.Utils.Events.Delegate() - Also, try non-Namespace version, Util version of this
// (For example, the Delegate methods might work better as a seperate script like memoize.js)

FOO.Utils.Events.Delegate = function()
{
    // Attempt to simplify jquery.live.js-like functionality and reduce usage of that plugin
    // to achieve proper Event Delegation (needs more testing - this is DEMO code!!!)
    
    // Internal Variables (Review):
    // this._obj_top_level : Element to listen on
    // this._dom_obj_type : Examples: 'a', 'ul', 'li', 'p', etc...
    // this._bind_event : Event to bind on top-level element
    // this._func_reference : Function to call
    // this._args : array of arguments to pass into Function
    
    if( FOO.Utils.Interface.Implements ( ) )
    
    // start event delegation [ using traditional event binding at the top level element, top_level]
   	this._obj_top_level[this._bind_event] = function(e)
   	{
   		var target = getTarget(e);
   		if(target.nodeName.toLowerCase() === this._dom_obj_type)
   		{
   			target.apply(this._func_reference, this._args);
   		}
   	}
    
    // Call 'getTarget' to obtain Event source
    function getTarget(x){ // here's the magic, really simple stuff
            x = x || window.event; // Cross-browser
            return x.target || x.srcElement; // Cross-browser
    }
    // end event delegation
};

/*
    Function.prototype.memoize
  	
  	Note - See "util/memoize.js" - this extends the JavaScript object "Function" and is not
  	simply added to this namespace (E.G., FOO.Util.Memoize == no!)
*/