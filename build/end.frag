
    //Use almond's special top-level, synchronous require to trigger factory
    //functions, get the final module value, and export it as the public
    //value.
    return require('brook');
}));
