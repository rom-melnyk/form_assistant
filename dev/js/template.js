(function (FA) {
  /**
   * @private
   * @param {Object} obj
   * @param {String} path
   * @return {*|undefined}        the value deep in the object
   */
  var _resolve = function (obj, path) {
    var firstPointPos, key, newPath;
    if (typeof obj === 'undefined') {
      return undefined;
    } else {
      firstPointPos = path.indexOf('.');
      if (firstPointPos === -1) {
        return obj[path];
      } else {
        key = path.substr(0, firstPointPos);
        newPath = path.substr(firstPointPos + 1);
        return _resolve(obj[key], newPath);
      }
    }
  };

  /**
   * @private
   * This will be attached to the `$FA.template()` output.
   * Replaces the `{{placeholders}}` with the actual data.
   * @param {Object} data
   * @return {String}           compiled string
   */
  var _compile = function (data) {
    var ret = this.tpl || '';
    // fucken magic; makes the RegExp working over multiple lines
    var fragments = ret.match(/\{\{[\w.]+\}\}/g) || [];
    var key, value;

    while (fragments.length) {
      key = fragments.shift();
      key = key.substring(2, key.length - 2);
      value = _resolve(data, key);
      if (value === undefined) {
        value = '';
      }
      ret = ret.replace(new RegExp('\\{\\{' + key + '\\}\\}', 'gm'), value);
    }

    return ret;
  };

  var _emptyFn = function () {};

  /**
   * @factory
   * @param {String} tplName        the value of the "data-id" attribute of the <tpl> element
   * @return {Object}               the object with the template string and with all the necessary methods
   */
  FA.template = function (tplName) {
    var obj = {};
    var tplDom = document.querySelector('tpl[data-id=' + tplName + ']');

    if (!tplDom) {
      obj.tpl = '';
      obj.compile = _emptyFn;
      obj.build = _emptyFn;
    } else {
      obj.tpl = tplDom.innerHTML;
      obj.compile = _compile;
      /**
       * @param {Object|Array} data
       * @void
       */
      obj.build = function (data) {
        var legacyDomElements = document.querySelectorAll('tpl[data-rendered=' + tplName + ']');
        Array.prototype.slice.call(legacyDomElements)
          .forEach(function (elm) {
            elm.parentNode.removeChild(elm);
          });

        if (data.constructor !== Array) {
          data = [data];
        }
        data.forEach(function (dataObj) {
          var domEl = document.createElement('tpl');
          domEl.setAttribute('data-rendered', tplName);
          domEl.innerHTML = obj.compile(dataObj);
          tplDom.parentNode.appendChild(domEl);
        });
      }
    }

    return obj;
  };
})(window.$FA);
