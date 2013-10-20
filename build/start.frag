//Copyright 2012, etc.

(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD.
        define(factory);
    } else {
        // Browser globals
        root.Brook = factory();
    }
}(this, function () {

