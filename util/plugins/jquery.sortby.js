/**
 * @author Justin Evans
 * 
 * jquery.sortby.js
 * 
 * Extends jQuery by adding sort functionality to arrays of objects.
 * 
 * Note: This is an implementation of Prototype.js' .sortBy() method for jQuery
 *
 * Usage:
 * 
 * var dataArray = [ 
 *  { firstName : 'Justin', lastName : 'Evans' },
 *  { firstName : 'John', lastName : 'Doe' }
 * ];
 * 
 * var sortedArray = $(dataArray).sortBy(function(name){
 *     return name.lastName;
 * };
 * 
 * // Results of 'sortedArray':
 * 
 * [
 *  { firstName : 'John', lastName: 'Doe' },
 *  { firstName : 'Justin', lastName : 'Evans' }
 * ]
 * 
 */

;(function($) {
	
	$.fn.extend({
    		sortBy: function(iterator) 
		{
			var results = [];
			var r = [];

			$(this).each(function(index,value){		
				r.push({value: value, criteria : iterator.call(this, value, index)});
			});

			r.sort(function(left, right) {
				var a = left.criteria, b = right.criteria;
				return a < b ? -1 : a > b ? 1 : 0;
			});
		
			$(r).each(function(index, value){
				results.push(value['value']);
			});
		
			return results;
    		}
	});
})(jQuery);
