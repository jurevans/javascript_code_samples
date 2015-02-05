// jQuery :: jquery.genericplugin.js
// Plugin Skeleton
;(function($) {

	// Private Variables and Functions
	var privateVariable = {};
	
	function privateFunction() {
		// Do Something Privately
		return true;
  	};

  	// Public Variables and Methods
  	$.namespace = {
		options: {},
		publicVariable: [],
		publicMethod: function() {
			// Do Something Publicly
			return true;
		}
  	};

	// Prototype Methods
  	$.fn.extend({
		namespacedMethod : function() {
			return this.each(function(i, v) {
				// Example Setting Persistent DOM Variables
				this.contextVariable = 'foo';
			});
    	},
    	unnamespacedMethod : function() {
    		return this.each(function() {
       			// Example Removing Persistent DOM Variables
			delete this.contextVariable;
		});
    	}
  	});

  	//Initialization Code
  	$(function() {
		$.namespace.publicMethod();
  	});

})(jQuery);
