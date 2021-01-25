
var moment = require('moment'); 
module.exports = {
    ifeq: function(a, b, options){
      if (a === b) {
        return options.fn(this);
        }
      return options.inverse(this);
    },
    stringify: function(date){
        if (!date) {
            return;
        }
        return JSON.stringify(date);
    },
    objParse: function(date){
        if (!date) {
            return;
        }
        return JSON.parse(date);
    },
    noSpaceStr:function(str){
      return str.split(' ').join('_')
    },
    assign:function (varName, varValue, options) {
        if (!options.data.root) {
            options.data.root = {};
        }
        options.data.root[varName] = varValue;
    },
    format_date:function(dateString,format) {
      return  moment(dateString).format(format);
    },
    ifeq: function (a, b, options) {
      if (a == b) { return options.fn(this); }
      return options.inverse(this);
    },
    ifnoteq:function (a, b, options) {
      if (a != b) { return options.fn(this); }
      return options.inverse(this);
    },

  }