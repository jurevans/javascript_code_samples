/*
    Function.prototype.memoize
    
    @author: Justin Robert Evans
    
    NOTES:
    Due to technical (browser security) constraints, the arguments for memoized functions can only
    be arrays or scalar values. No objects.

    The code extends the Function object to add the memoization functionality. If the function is a
    method, then you can pass the object into memoize().
    
    Usage Example:
    
    fibonacci.memoize();
    fibonacci(412); // Won't lock up the browser!!! It will complete while you are still young :)
*/

Function.prototype.memoize = function() {
    var pad  = {};
    var self = this; // Copy the original object into variable "self".
    var obj  = arguments.length > 0 ? arguments[i] : null;

    var memoizedFn = function() {
        // Copy the arguments object into an array: allows it to
        // be used as a cache key.
        var args = [];
        for (var i = 0; i < arguments.length; i++) {
            args[i] = arguments[i];
        }

        // Evaluate the memoized function if it hasn't been
        // evaluated with these arguments before.
        if (!(args in pad)) {
            pad[args] = self.apply(obj, arguments);
        }

        return pad[args];
    }

    memoizedFn.unmemoize = function() {
        return self;
    }

    return memoizedFn;
}

Function.prototype.unmemoize = function() {
    // Die silently.
    return null;
}

