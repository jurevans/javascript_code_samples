/*
    FOO.UI
    
    lib/foo_ui.js

    User-Interface DOM-related features/methods
    Author(s): Justin Evans
    Copyright 2009, 2010, 2011, FOO, Inc.
  
    Requires jquery.1.2[+].x[.min].js
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

// Define Root Namespace -JRE

var FOO = FOO || {};

FOO.UI = FOO.UI || {
    // FOO.UI Constructors
    InputToggle : function( input_class )
    {
        this.input_class = input_class;
        this.default_value = $(input_class).val();
    },
    Numeric : function( objInput )
    {
        this.objInput = objInput;
    },
    AutoTab : 
    {
        // Look for "input" with class "autotab"
        // Requires "maxlength" to be set on "input" fields
        
        init : function(){
            $('.autotab').each(function(){
                $(this).keyup(function(event){
                    FOO.UI.AutoTab.autoTab(this, parseInt(this['maxLength']), event);
                });
            });
        },
        
        // Internal Functions to FOO.UI.AutoTab
        autoTab : function ( input, len, e )
        {
            var keyCode = (this.isNN) ? e.which : e.keyCode; 
            var filter = (this.isNN) ? [0,8,9] : [0,8,9,16,17,18,37,38,39,40,46];
            if(input.value.length >= len && !this.containsElement(filter,keyCode)) {
                input.value = input.value.slice(0, len);
                input.form[(this.getIndex(input)+1) % input.form.length].focus();
            }
        },
        
        isNN : function ( )
        {
            return (navigator.appName.indexOf("Netscape")!=-1);
        },
        
        containsElement : function ( arr, ele )
        {
            var found = false, index = 0;
            while(!found && index < arr.length)
            {
                if(arr[index] == ele) found = true;
                else index++;
            }
            return found;
        },
        
        getIndex : function ( input )
        {
            var index = -1, i = 0, found = false;
            while (i < input.form.length && index == -1)
            {
                if (input.form[i] == input) index = i;
                else i++;
            }
            return index;
        }
    },
    BindEnterKey : function(e, method) // Override "Enter/Return" key "Submit"
    { 
        if(e.keyCode == 13)
        {
            method(e);
            e.preventDefault();
        };
    },
    Limit : function( sel_items, int_limits, sel_control_more, sel_control_less )
    {
        this.sel_items = sel_items;
        this.int_limits = int_limits;
        this.sel_control_more = sel_control_more;
        this.sel_control_less = sel_control_less;
    },
    Filter : function( sel_parent, params, template, data, reset )
    {
        this.sel_parent = sel_parent;   // 'ul.listing', or '#container_div, etc.
        this.params = params;           // [ ['key', 'value'], ['key2', 'value2'] ]
        this.template = template;       // jquery-template template
        this.data = data;               // { JSON DATA }
        this.reset = reset;             // [0 || 1 ]
    }
};

// FOO.UI.InputToggle - toggleText() - useful for inputs with guide text

FOO.UI.InputToggle.prototype = {
    toggleText : function()
    {
        var default_value = this.default_value;
        
        $(this.input_class).focus(function(){
            if (this.value == default_value) {
                this.value = '';
            }
        }).blur(function(){
            if(this.value == '' || this.value == null){
                this.value = default_value;
            }
        });
    }
};

// FOO.UI.Extrapolate - Convert DOM structures into JSON data

// In short, this method does the opposite of jquery.template.js: 
// - It takes a template definition as provided to jquery.template.js to 
//   match a DOM structure 
// - From the variable defintions and the structure of the template it 
//   will build a JSON Data structure.

// Requires jquery.templates.js

// FOO.UI.Extrapolate builds an array of JSON data
// based on the content and data-type definitions
// in the configuration of a set of HTML elements

FOO.UI.Extrapolate = function( options ) {
    var arr = [];
    if ($(options.container) && $(options.container + ' ' + options.divider)) {
        $(options.container + ' ' + options.divider).each(function(){
            var tmpObj = {};
            for (option in options.template.data) {
                typeof options.template.data[option].extrapolate != 'undefined' 
                ? tmpObj[option] = options.template.data[option].extrapolate(this)
                : tmpObj[option] = null;
            }
            arr.push(tmpObj);
            delete tmpObj;
        });
    }
    //console.log(arr);
    return arr;
};

FOO.UI.Extrapolated = []; // Default container

// FOO.UI.Numeric - Bind Numeric checking to keyboard entry

FOO.UI.Numeric.prototype = {
    init : function()
    {
        if(this.objInput)
        {
            $(this.objInput).keyup(function(){
                    
                this.value = /^[0-9]+$/.test(this.value) ? this.value : (function(value){
                    var arrValues = value.split('');
                    var strTrim = '';
                    
                    for(var i=0; i<arrValues.length; i++)
                    {
                        /^[0-9]+$/.test(arrValues[i]) ? strTrim += arrValues[i] + '' : '';
                    }
                    
                    return strTrim;
                
                })(this.value);
            });
        }
    }
};
