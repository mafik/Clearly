/*
   Clearly is a programmable text editor implemented as a modular
   set of javascript libraries.

   Copyright (C) 2013 Marek Rogalski

   This program is free software: you can redistribute it and/or
   modify it under the terms of the GNU General Public License as
   published by the Free Software Foundation, either version 3 of the
   License, or (at your option) any later version.

   This program is distributed in the hope that it will be useful, but
   WITHOUT ANY WARRANTY; without even the implied warranty of
   MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
   General Public License for more details.

   You can find a copy of the GNU General Public License at
   http://clearly.pl/LICENSE.html. If it's not there, see
   http://www.gnu.org/licenses/.
*/

$Clearly = { selector : 'h1, h2, h3, h4, h5, h6, section, p, blockquote, ul, ol, pre, hr, li',
	     inhibitSelector : 'a, button, input',
             active : undefined,
             killring : [],
             activity : [],
             on : {},
             install : {} };

$Clearly.Keys = {
  8: "BACKSPACE",
  9: "TAB",
  13: "ENTER",
  16: "SHIFT",
  17: "CTRL",
  18: "ALT",
  19: "PAUSE/BREAK",
  20: "CAPS LOCK",
  27: "ESCAPE",
  33: "PAGE UP",
  34: "PAGE DOWN",
  35: "END",
  36: "HOME",
  37: "LEFT ARROW",
  38: "UP ARROW",
  39: "RIGHT ARROW",
  40: "DOWN ARROW",
  45: "INSERT",
  46: "DELETE",
  48: "0",
  49: "1",
  50: "2",
  51: "3",
  52: "4",
  53: "5",
  54: "6",
  55: "7",
  56: "8",
  57: "9",
  65: "A",
  66: "B",
  67: "C",
  68: "D",
  69: "E",
  70: "F",
  71: "G",
  72: "H",
  73: "I",
  74: "J",
  75: "K",
  76: "L",
  77: "M",
  78: "N",
  79: "O",
  80: "P",
  81: "Q",
  82: "R",
  83: "S",
  84: "T",
  85: "U",
  86: "V",
  87: "W",
  88: "X",
  89: "Y",
  90: "Z",
  91: "LEFT WINDOW KEY",
  92: "RIGHT WINDOW KEY",
  93: "SELECT KEY",
  96: "NUMPAD 0",
  97: "NUMPAD 1",
  98: "NUMPAD 2",
  99: "NUMPAD 3",
  100: "NUMPAD 4",
  101: "NUMPAD 5",
  102: "NUMPAD 6",
  103: "NUMPAD 7",
  104: "NUMPAD 8",
  105: "NUMPAD 9",
  106: "MULTIPLY",
  107: "ADD",
  109: "SUBTRACT",
  110: "DECIMAL POINT",
  111: "DIVIDE",
  112: "F1",
  113: "F2",
  114: "F3",
  115: "F4",
  116: "F5",
  117: "F6",
  118: "F7",
  119: "F8",
  120: "F9",
  121: "F10",
  122: "F11",
  123: "F12",
  144: "NUM LOCK",
  145: "SCROLL LOCK",

  59: "SEMICOLON", // firefox
  186: "SEMICOLON", // chrome

  187: "EQUAL SIGN",
  188: "COMMA",
  189: "DASH",
  190: "PERIOD",
  191: "FORWARD SLASH",
  192: "GRAVE ACCENT",
  219: "OPEN BRACKET",
  220: "BACKSLASH",
  221: "CLOSE BRAKET",
  222: "SINGLE QUOTE"
};

$Clearly.Keycodes = {
  "BACKSPACE": [8],
  "TAB": [9],
  "ENTER": [13],
  "SHIFT": [16],
  "CTRL": [17],
  "ALT": [18],
  "PAUSE/BREAK": [19],
  "CAPS LOCK": [20],
  "ESCAPE": [27],
  "PAGE UP": [33],
  "PAGE DOWN": [34],
  "END": [35],
  "HOME": [36],
  "LEFT ARROW": [37],
  "UP ARROW": [38],
  "RIGHT ARROW": [39],
  "DOWN ARROW": [40],
  "INSERT": [45],
  "DELETE": [46],
  "0": [48],
  "1": [49],
  "2": [50],
  "3": [51],
  "4": [52],
  "5": [53],
  "6": [54],
  "7": [55],
  "8": [56],
  "9": [57],
  "A": [65],
  "B": [66],
  "C": [67],
  "D": [68],
  "E": [69],
  "F": [70],
  "G": [71],
  "H": [72],
  "I": [73],
  "J": [74],
  "K": [75],
  "L": [76],
  "M": [77],
  "N": [78],
  "O": [79],
  "P": [80],
  "Q": [81],
  "R": [82],
  "S": [83],
  "T": [84],
  "U": [85],
  "V": [86],
  "W": [87],
  "X": [88],
  "Y": [89],
  "Z": [90],
  "LEFT WINDOW KEY": [91],
  "RIGHT WINDOW KEY": [92],
  "SELECT KEY": [93],
  "NUMPAD 0": [96],
  "NUMPAD 1": [97],
  "NUMPAD 2": [98],
  "NUMPAD 3": [99],
  "NUMPAD 4": [100],
  "NUMPAD 5": [101],
  "NUMPAD 6": [102],
  "NUMPAD 7": [103],
  "NUMPAD 8": [104],
  "NUMPAD 9": [105],
  "MULTIPLY": [106],
  "ADD": [107],
  "SUBTRACT": [109],
  "DECIMAL POINT": [110],
  "DIVIDE": [111],
  "F1": [112],
  "F2": [113],
  "F3": [114],
  "F4": [115],
  "F5": [116],
  "F6": [117],
  "F7": [118],
  "F8": [119],
  "F9": [120],
  "F10": [121],
  "F11": [122],
  "F12": [123],
  "NUM LOCK": [144],
  "SCROLL LOCK": [145],
  "SEMICOLON": [59,186], // firefox & chrome
  "EQUAL SIGN": [187],
  "COMMA": [188],
  "DASH": [189],
  "PERIOD": [190],
  "FORWARD SLASH": [191],
  "GRAVE ACCENT": [192],
  "OPEN BRACKET": [219],
  "BACKSLASH": [220],
  "CLOSE BRAKET": [221],
  "SINGLE QUOTE": [222]
};

$Clearly.Mode = function(name) { this.name = name; };
$Clearly.Mode.prototype.bind = function(o, f) {
  var end = this, queue = ['ctrl', 'shift', 'meta', 'alt'];
  for(var i = 0; i<queue.length; ++i) {
    var prop = queue[i];
    var val = o[prop];
    if(end[val] === undefined) {
      end[val] = { };
    }
    end = end[val];
  }
  end[o.code] = f;
};
$Clearly.Mode.prototype.start = function() {
  $Clearly.on[this.name || this] = this;
};
$Clearly.Mode.prototype.end = function() {
  delete $Clearly.on[this.name || this];
};

$Clearly.SingleKeyMode = function() {
  this.bind({ ctrl:false
            , alt:false
            , shift:false
            , meta:false
            , code:'27'}, function() {
    this.end();
  });
};
$Clearly.SingleKeyMode.prototype.bind = function(o, f) {
  var f2 = function(event) {
    f(event);
    this.end();
  };
  $Clearly.Mode.prototype.bind.call(this, o, f2);
};
$Clearly.SingleKeyMode.prototype.install = function(mode, options) {
  var self = this;
  mode.bind(options, function() {
    self.old_on = $Clearly.on;
    $Clearly.on = { 'single key mode':this };
  });
};
$Clearly.SingleKeyMode.prototype.end = function() {
  $Clearly.on = this.old_on;
  delete this.old_on;
};

/* // Przykład zastosowania 
var minimode = new $Clearly.SingleKeyMode();
minimode.bind('?', question);
$Clearly.nav.bind({code:'i'}, minimode.start);
*/

$Clearly.keydown = function(event) {
  var end = [], queue = ['ctrl', 'shift', 'meta', 'alt', 'code'], i, j;
  var data = { shift : event.shiftKey,
	       ctrl : event.ctrlKey,
	       alt : event.altKey,
	       meta : event.metaKey,
	       code : event.keyCode
	     };
  
  //console.log(JSON.stringify(data));
  for(i in $Clearly.on) {
    end.push($Clearly.on[i]);
  }
  for(i=0; end.length > 0 && i < queue.length; ++i) {
    var param = queue[i];
    var val = data[param];
    var new_end = [];
    for(j=0; j<end.length; ++j) {
      var current = end[j];
      if(current[val]) new_end.push(current[val]);
      if(current[undefined]) new_end.push(current[undefined]);
    }
    end = new_end;
  }
  if(end.length > 1) {
    console.warn('More than one handler for event', data);
  }
  var ret = true;
  for(j=0; j<end.length; ++j) {
    ret = end[j](event) && ret;
  }
  return ret;
};
        
$Clearly.save = function() {
  localStorage[location.pathname] = $('body').html();
};

$Clearly.load = function() {
  if(!localStorage || !getSelection) {
    console.warn('localStorage and getSelection not found. Clearly will clearly fail.');
  }
  if(localStorage[location.pathname]) {
    $('body').html(localStorage[location.pathname]);
    $Clearly.active = $('.active');
  } else {
    $($Clearly.selector).first().activate();
  }
  
  setTimeout('window.scroll(0, $Clearly.active.offset().top - parseInt(getComputedStyle($Clearly.active[0]).marginTop));', 500);
  
  document.addEventListener('keydown', $Clearly.keydown);
};

$.fn.isReal = function() {
  var element = this[0];
  while (element) {
    if (element == document) {
      return true;
    }
    element = element.parentNode;
  }
  return false;
};


$.fn.activate = function(){
  if(this.length == 0) return this;
  if($Clearly.active) {
    $Clearly.active.removeClass('active');
    if($Clearly.active.is('[class=""]')) {
      $Clearly.active.removeAttr('class');
    }
    $Clearly.activity.push($Clearly.active);
  }
  this.addClass('active');
  $Clearly.active = this;
  return this;
};

$Clearly.deleteActive = function(saveToKillRing) {

  var next = $Clearly.active.next();
  if(next.length == 0) {
    next = $Clearly.active.prev();
  }
  if(next.length == 0) {
    next = $Clearly.active.parent($Clearly.selector);
  }
  if(next.length == 0) {
    next = $('body').append("<p \>").children().last();
  }

  $Clearly.active.remove();
  if(saveToKillRing) {
    $Clearly.killring.push($Clearly.active);
  }
  
  next.activate().scrollShow();
  
  /*
  while($Clearly.activity.length > 0) {
    var candidate = $Clearly.activity.pop();
    if(candidate.isReal()) {
      candidate.activate().scrollShow();
      break;
    }
  }
   */
};

(function() {
  function filterFunction() {
    return this.nodeType == 3 && /^\s*$/.test(this.nodeValue);
  }
  function filterTextNodes() {
    return this.nodeType == 3;
  }
  $.fn.removeEmptyTextNodes = function() {
    this.contents().filter(filterFunction).remove();
    return this;
  };
  $.fn.textNodes = function() {
    return this.contents().filter(filterTextNodes);
  };
})();

(function() {
  var scrollFunction = function(pos) {
	//console.log("scroll to", pos);
	$('html, body').animate({ scrollTop:pos }, {duration: 200, queue: false});
      };
  $.fn.scrollShow = function() {
    if(this.length > 0) {
      var docViewTop = $(window).scrollTop();
      var docViewHeight = $(window).height();
      var docViewBottom = docViewTop + docViewHeight;
      
      var elemTop = this.offset().top - parseInt(this.css('margin-top'));
      var elemHeigth = this.height()
                     + parseInt(this.css('margin-bottom'))
                     + parseInt(this.css('margin-top'));
      var elemBottom = elemTop
            + elemHeigth;
      
      //console.log("docViewTop", docViewTop);
      //console.log("docViewHeight", docViewHeight);
      //console.log("docViewBottom", docViewBottom);
      //console.log("elemTop", elemTop);
      //console.log("elemBottom", elemBottom);

      if(docViewHeight > elemHeigth) {
        if(elemTop < docViewTop) {
          scrollFunction(elemTop);
        } else if(elemBottom > docViewBottom) {
          scrollFunction(elemBottom - $(window).height());
        }
      } else {
        scrollFunction(elemTop);
      }
    }
    return this;
  };
})();


$Clearly.removeSection = function() {
  $Clearly.active.parent().closest('section').children().unwrap();
  $Clearly.active.scrollShow();
};

$Clearly.makeSection = function() {
  var wrapped = $Clearly.active.closest("h1, h2, h3, h4, h5, h6, p, pre, blockquote, ul, ol, section");
  wrapped.wrap('<section></section>');
  $Clearly.active.scrollShow();
};

$Clearly.changeTag = function(x) {
  var a = $Clearly.active, b;
  a.wrapInner(x);
  b = a.children().first();
  b.attr('class', a.attr('class'));
  if(a.attr('contenteditable')) b.attr('contenteditable', 'true');
  b.activate().unwrap();
};

  
$Clearly.smartNew = function() {
  /**
   * smartNew is selection aware:
   * - p, blockqote, li, header: duplicate it, copy attributes
   * - section: make new paragraph inside
   * - list: add new list item
   */
  var a = $Clearly.active, inside, tag;
  if(a.is('section')) {
    inside = true; tag = '<p></p>';
  } else if(a.is('ul, ol')) {
    inside = true; tag = '<li></li>';
  } else if(a.is('li')) {
    inside = false; tag = '<li></li>';
  } else {
    inside = false; tag = '<p></p>';
  }
  var mark_todo = $Clearly.todo.isTask(a);
  if(inside) {
    mark_todo = $Clearly.todo.isTask(a.children().last());
    a.append(tag).children().last().activate();
  } else {
    a.after(tag).next().activate();
  }
  if(mark_todo) {
    $Clearly.todo.first();
  }
};

// Editor
(function () {
  function end() { // Don't invoke directly. $Clearly.active.blur() instead.
    var a = $Clearly.active;
    a.removeAttr('contenteditable');
    a.removeEmptyTextNodes();
    if(a.is('section')) {
      a.textNodes().wrap("<p></p>");
      a.find('div').each(function(i, e) {
	$(e).wrap('<p></p>');
	$(e).after($(e).contents());
	$(e).remove();
      });
      //a.children('br').remove();
    } else if(a.is('ul, ol')) {
      a.children('br').remove();
      a.contents().not('li').wrap("<li></li>");
      a.find('div').children().unwrap();
      a.textNodes().wrap("<li></li>");
    } else {
      var c = a.contents();
      while(c.length) {
        if(c.last().is('br')) {
          c.last().remove();
        } else {
          break;
        }
        c = a.contents();
      }
    }
    if(a.text().length == 0) {
      $Clearly.deleteActive(false);
    }
    // window.getSelection().removeAllRanges();
    delete $Clearly.on.edit;
    $Clearly.nav.start();
    return true;
  }
  
  function start () {
    var a = $Clearly.active;

    var ramax = document.createRange();
    ramax.selectNodeContents(a[0]);
    
    var range, ri;
    
    /* *
    var ans = [];
    ans[-1] = "before";
    ans[0] = "at";
    ans[1] = "after";
    /* */
    
    var sel = window.getSelection();
    for(ri=0; ri < sel.rangeCount; ++ri) {
      range = sel.getRangeAt(ri);
      
      /* *
      console.log("Start of selection is ",
		  ans[range.compareBoundaryPoints(Range.START_TO_START, ramax)],
		  "start of active");

      console.log("Start of selection is ",
		  ans[range.compareBoundaryPoints(Range.END_TO_START, ramax)],
		  "end of active");

      console.log("End of selection is ",
		  ans[range.compareBoundaryPoints(Range.START_TO_END, ramax)],
		  "start of active");

      console.log("End of selection is ",
		  ans[range.compareBoundaryPoints(Range.END_TO_END, ramax)],
		  "end of active");
      /* */

      if(range.compareBoundaryPoints(Range.START_TO_START, ramax) == -1) {
	range.setStart(ramax.startContainer, ramax.startOffset);
	//console.log("Start -> Start");

	if(range.compareBoundaryPoints(Range.START_TO_END, ramax) == -1) {
	  range.setEnd(ramax.startContainer, ramax.startOffset);
	  //console.log("End -> Start");
	}
      }

      if(range.compareBoundaryPoints(Range.END_TO_END, ramax) == 1) {
	range.setEnd(ramax.endContainer, ramax.endOffset);
	//console.log("End -> End");

	if(range.compareBoundaryPoints(Range.END_TO_START, ramax) == 1) {
	  range.setStart(ramax.endContainer, ramax.endOffset);
	  //console.log("Start -> End");
	}
      }
    }

    a.attr('contenteditable', 'true').focus();
    $Clearly.on.edit = $Clearly.edit;
    if($Clearly.on.nav) {
      $Clearly.on.nav.end();
    }
    a.one('blur', end);
  }
  
  $Clearly.edit = new $Clearly.Mode('edit');
  $Clearly.edit.start = start;
  $Clearly.edit.end   = function() { $Clearly.active.blur(); };
  
  
  $Clearly.edit.bind({ ctrl:false, code:'27' }, function(event) {
    
    $Clearly.active.blur();
    $Clearly.save();
  });
  
  
  $Clearly.edit.bind({ shift:false, code:'13' }, function(event) {
    
    if($Clearly.active.is('p, li, blockquote, h1, h2, h3, h4, h5, h6')) {
      var sel = window.getSelection();
      var range = sel.getRangeAt(0);
      if(sel.isCollapsed && $Clearly.active.contents().length) {
        range.setEndAfter($Clearly.active.contents().last()[0]);
      }
      var fragment = $(range.extractContents());

      var left_empty = ($Clearly.active.text().length == 0);
      var right_empty = (fragment.text().length == 0);

      if(left_empty && right_empty) {
	// do nothing
      } else if(left_empty) {
	$Clearly.active.text('dummy');
	$Clearly.edit.end();
        $Clearly.smartNew();
	$Clearly.active.html(fragment);
	$Clearly.nav.up();
	$Clearly.active.text('');
	$Clearly.edit.start();
      } else if(right_empty) {
	$Clearly.edit.end();
        $Clearly.smartNew();
	$Clearly.edit.start();
      } else {
	$Clearly.edit.end();
        $Clearly.smartNew();
	$Clearly.active.html(fragment);
	$Clearly.edit.start();
      }
      event.preventDefault();
      return false;
    }
    return true;
    
  }); 
  
  
  function bind(code, func) {
    
    var state = { ctrl:true
                , shift: false
                , alt: false
                , meta: false
                , code: code };
    $Clearly.edit.bind(state, func);
    
  };
  
  var removeFormat = function(event) {
    document.execCommand('removeFormat', false, null);
    document.execCommand('unlink', false, null);
    event.preventDefault();    
  };
  $Clearly.edit.bind({ ctrl:true // shift: undefined
                , alt: false
                , meta: false
                , code: 27 }, removeFormat); // escape
  
  bind('66', function(event) { // b
    
    document.execCommand('bold', false, null);
    event.preventDefault();
    
  });
  
  bind('73', function(event) { // i
    
    document.execCommand('italic', false, ' ');
    event.preventDefault();
        
  });
  
  bind('85', function(event) { // u
    
    document.execCommand('underline', false, ' ');
    event.preventDefault();
        
  });
  
  bind('83', function(event) { // s
    
    document.execCommand('strikeThrough', false, ' ');
    event.preventDefault();
        
  });
  
  bind('38', function(event) { // up
    
    document.execCommand('superscript', false, ' ');
    event.preventDefault();
        
  });
  
  bind('40', function(event) { // down
    
    document.execCommand('subscript', false, ' ');
    event.preventDefault();
        
  });
  
  bind('69', function(event) { // e
    var url = prompt('URL');
    $Clearly.edit.start();
    //console.log(url);
    document.execCommand('createLink', false, url);
    event.preventDefault();
    return false;
  });
  
  var wrap_with = function(makeElem) {
	
	var sel = window.getSelection(), ri, range, elem, fragment;
	for(ri=0; ri < sel.rangeCount; ++ri) {
	  elem = makeElem();
	  range = sel.getRangeAt(ri);
	  try {

	    range.surroundContents(elem);

	  } catch (x) {

	    fragment = range.extractContents();
	    range.insertNode(elem);
	    elem.appendChild(fragment);
	    range.selectNode(elem);

	  }
	}
      };
  
  bind('68', function(event) { // d -> <code>
    
    wrap_with(function() {
      return document.createElement('code');
    });
    event.preventDefault();
        
  });
  
  bind('70', function(event) { // f -> <... class="fancy">
    
    wrap_with(function() {
      var e = document.createElement('em');
      e.className = 'fancy';
      return e;
    });
    event.preventDefault();
        
  });
  
  var decreaseFontSize = function(event) { // -_
    if ($.browser.mozilla || $.browser.opera) {
      document.execCommand('decreaseFontSize', false, null);
    } else {
      wrap_with(function() { return document.createElement('small') });
    }
    event.preventDefault();
  };

  var increaseFontSize = function(event) { // =+
    if ($.browser.mozilla || $.browser.opera) {
      document.execCommand('increaseFontSize', false, null);
    } else {
      wrap_with(function() { return document.createElement('big') });
    }
    event.preventDefault();
  };

  bind('109', decreaseFontSize);
  bind('189', decreaseFontSize);
  
  bind('61', increaseFontSize);
  bind('187', increaseFontSize);

})();

// Navigator

(function() {
  $Clearly.nav = new $Clearly.Mode('nav');
  
  $Clearly.nav.hide = function(state) {
    if(state === undefined) {
      $Clearly.active.toggleClass('compact');
    } else if(state) {
      $Clearly.active.addClass('compact');
    } else {
      $Clearly.active.removeClass('compact');
    }
    setTimeout('$Clearly.active.scrollShow()', 300);
  };

  $Clearly.nav.down = function() {
    $Clearly.active.next($Clearly.selector).activate().scrollShow();
  };

  $Clearly.nav.walkDown = function() {
    var a = $Clearly.active, b, nav = $Clearly.selector;
    b = a.children(nav).first();
    if(b.length == 0) {
      b = a.next(nav);
    }
    while(b.length == 0) {
      a = a.parent(nav);
      if(a.length > 0) {
        b = a.next(nav);
      } else {
        break;
      }
    }
    b.activate().scrollShow();
  };

  $Clearly.nav.up = function() {
    $Clearly.active.prev($Clearly.selector).activate().scrollShow();
  };

  $Clearly.nav.walkUp = function() {
    var a = $Clearly.active, b, nav = $Clearly.selector;
    b = a.prev(nav);
    if(b.length == 0) {
      b = a.parent(nav);
    } else {
      a = b.children(nav);
      while(a.length) {
        b = a.last();
        a = b.children(nav);
      }
    }
    b.activate().scrollShow();
  };
  
  var bind = function(keyname, conversionFunction, creationFunction) {
    var codes = $Clearly.Keycodes[keyname];
    var code = codes[0];
    
    for(var i=0; i<codes.length; ++i) {

      code = codes[i];

      if(conversionFunction) {
	$Clearly.nav.bind({ctrl:false, code:code}, conversionFunction);
      }

      if(creationFunction) {
	$Clearly.nav.bind({ctrl:true, code:code}, creationFunction);
      }
      
    }
  };
  
  var makeTagCreator = function(tag) {
	return function(event) {
	  if(event.shiftKey) {
            $Clearly.active.before(tag).prev().activate().scrollShow();
	  } else {
            $Clearly.active.after(tag).next().activate().scrollShow();
	  }
	  $Clearly.edit.start();
	  event.preventDefault();
	};
      };
  
  var makeNestedTagCreator = function(tags) {
	return function(event) {
	  if(event.shiftKey) {
            $Clearly.active.before(tags).prev().scrollShow().children().first().activate();
	  } else {
            $Clearly.active.after(tags).next().scrollShow().children().first().activate();
	  }
	  $Clearly.edit.start();
	  event.preventDefault();
	};

	var simple = makeTagCreator(tags);
	return function(event) {
	  simple();
	  
	};
      };
  
  var makeTagConverter = function(tag) {
    return function(event) {
      $Clearly.changeTag(tag);
      $Clearly.save();
      event.preventDefault();
    };
  };
  
  // TODO: This function should be integrated with $Clearly.changeTag (possibly even into jquery)
  function change_tag(a, tag) {
    a.wrapInner(tag);
    var b = a.children().first();
    for(var i = 0,
            attributes = a.get(0).attributes;
	i < attributes.length; ++i) {
      
      b.attr(attributes[i].name, attributes[i].value);
      
    }
    b.unwrap();
  }
  
  var bindTextTag = function(keyname, tag) {
    var creator = makeTagCreator(tag);
    var converter = makeTagConverter(tag);
    
    var textConverter = function(event) {
	  if($Clearly.active.is('h1, h2, h3, h4, h5, h6, p, blockquote, pre')) {

	    converter(event);
	    return;

	  } else if($Clearly.active.is('li')) {
	    
	    change_tag($Clearly.active.parent(), '<section></section>');
	    $Clearly.active.siblings().andSelf().each(function(i, e) {
	      change_tag($(e), tag);
	    });
	    $('.active').activate();
	    $Clearly.save();
	    
	  }
	  event.preventDefault();
	};
    
    bind(keyname, textConverter, creator);
  };
  
  bindTextTag('P', '<p />');
  bindTextTag('B', '<blockquote />');
  bindTextTag('SEMICOLON', '<pre />');

  for(var i=1; i<=6; ++i) {
    bindTextTag(String(i), '<h' + i + ' />');
  }
  
  bind('BACKSLASH', null, makeTagCreator('<hr>'));
  
  var sectionConverter = function(event) {
	if($Clearly.active.is('ul, ol')) {
	  $Clearly.changeTag("<section></section>");
	  $Clearly.active.children().each(function(i, e) {
	    change_tag($(e), "<p></p>");
	  });
	}
	$Clearly.save();
	event.preventDefault();
      };

  bind('E', sectionConverter, makeNestedTagCreator('<section><p></p></section>'));
  
  var makeListConverter = function(tagName) {
	var tag = '<'+tagName+'></'+tagName+'>';
	return function(event) {

	  if($Clearly.active.is('section')) {
	    var allowed = $Clearly.active.find('h1, h2, h3, h4, h5, h6, p, pre, blockquote, li');
	    $Clearly.changeTag(tag);
	    $Clearly.active.empty().append(allowed);
	    $Clearly.active.children().each(function(i, e) {
	      change_tag($(e), '<li></li>');
	    });
	  } else if($Clearly.active.is('ol, ul')) {
	    $Clearly.changeTag(tag);
	  } else if($Clearly.active.parent().is('ol, ul')) {
	    change_tag($Clearly.active.parent(), tag);
	  }
	  $Clearly.save();
	  event.preventDefault();
	  
	};
      };
  
  bind('U', makeListConverter('ul'), makeNestedTagCreator('<ul><li></li></ul>'));
  bind('O', makeListConverter('ol'), makeNestedTagCreator('<ol><li></li></ol>'));
  

  bind('SINGLE QUOTE', function(event) {
    var a = $Clearly.active;
    if(event.shiftKey) {
      a.html(a.text());
    } else {
      a.text(a.html());
    }
    event.preventDefault();
    $Clearly.save();
  }, null);
  
  // END element rules
  var del = function(event) { // del
    $Clearly.deleteActive(!event.shiftKey);
    $Clearly.save();
    event.preventDefault();
  };

  var insert = function(event) { // insert
    if(event.shiftKey) {
      $Clearly.active.before($Clearly.killring.pop());
    } else {
      $Clearly.active.after($Clearly.killring.pop());
    }
    $Clearly.save();
    event.preventDefault();
  };
  
  $Clearly.nav.bind({code:'46'}, del); // everybody besides mac
  $Clearly.nav.bind({ctrl:false, code:'8'}, del); // mac
  
  $Clearly.nav.bind({code:'45'}, insert); // everybody besides mac
  $Clearly.nav.bind({ctrl:true, code:'8'}, insert); // mac
  
  $Clearly.nav.bind({code:'72'}, function(event) { // h
    $Clearly.nav.hide();
    $Clearly.save();
    event.preventDefault();
  });
  
  $Clearly.nav.bind({ ctrl: true, code: $Clearly.Keycodes['S'] }, function(event) { // Ctrl + s
    
    $Clearly.save();
    localStorage[location.pathname + '~'] = localStorage[location.pathname];
    event.preventDefault();

  });
  
  $Clearly.nav.bind({ ctrl: true, code: $Clearly.Keycodes['R'] }, function(event) { // Ctrl + r
    
    $Clearly.save();
    
    var backup_name = location.pathname + '~',
	current_name = location.pathname;

    var backup  = localStorage.getItem(backup_name),
	current = localStorage.getItem(current_name);
    
    if(event.shiftKey) {
      localStorage.removeItem(backup_name);
      backup = null;
    } else {
      localStorage.setItem(backup_name, current);      
    }

    if(backup) {
      localStorage.setItem(current_name, backup);
    } else {
      localStorage.removeItem(current_name);
    }
    

    if(event.shiftKey) {
      window.location.reload();
    } else {
      $Clearly.load();
    }

    event.preventDefault();

  });
  
  $Clearly.nav.bind({ctrl:true, shift:true, code:'37'}, function(event) { // left
    $Clearly.removeSection();
    $Clearly.save();
    event.preventDefault();
  });
  
  $Clearly.nav.bind({ctrl:true, shift:true, code:'39'}, function(event) { // right
    $Clearly.makeSection();
    $Clearly.save();
    event.preventDefault();
  });
  
  $Clearly.nav.bind({ctrl:false, shift:false, code:'37'}, function(event) { // left
    $Clearly.active.parent($Clearly.selector).activate().scrollShow();
    event.preventDefault();
  });
  
  $Clearly.nav.bind({ctrl:false, shift:false, code:'39'}, function(event) { // right
    $Clearly.active.children($Clearly.selector).first().activate().scrollShow();
    event.preventDefault();
  });
  
  $Clearly.nav.bind({ctrl:true, code:'35'}, function(event) {
    $('body').children($Clearly.selector).last().activate().scrollShow();
    event.preventDefault();
  });
  
  $Clearly.nav.bind({ctrl:true, code:'36'}, function(event) {
    $('body').children($Clearly.selector).first().activate().scrollShow();
    event.preventDefault();
  });
  $Clearly.nav.bind({ctrl:false, code:'35'}, function(event) {
    $Clearly.active.siblings($Clearly.selector).andSelf().last().activate().scrollShow();
    event.preventDefault();
  });
  
  $Clearly.nav.bind({ctrl:false, code:'36'}, function(event) {
    $Clearly.active.siblings($Clearly.selector).andSelf().first().activate().scrollShow();
    event.preventDefault();
  });
  
  $Clearly.nav.bind({shift:false, code:'38'}, function(event) { // up
    if(event.ctrlKey) {
      $Clearly.nav.walkUp();
    } else {
      $Clearly.nav.up();
    }
    event.preventDefault();
  });
  
  $Clearly.nav.bind({shift:false, code:'40'}, function(event) { // down
    if(event.ctrlKey) {
      $Clearly.nav.walkDown();
    } else {
      $Clearly.nav.down();
    }
    event.preventDefault();
  });
  
  $Clearly.nav.bind({shift:false, code:'13'}, function(event) { // enter
    if(event.ctrlKey) {
      $Clearly.smartNew();
    }
    $Clearly.edit.start();
    event.preventDefault();
  });
  
})();

// # Click handling
$(function() {

  $(document).on('click', $Clearly.selector, function(event) {

    // 1. Click inside edited element -> move the cursor
    if($(this).closest("[contenteditable=true]").length) {
      return false;
    }

    // 2. Clicked on clickable element (link/button) -> make default action
    if($(event.target).is($Clearly.inhibitSelector)) {
      event.stopPropagation();
      return true;
    }
    
    // 3. Clicked inside active element -> turn on edit mode
    if($(this).is('.active')) {
      $Clearly.edit.start();
      return false;
    }
    
    // 4. Otherwise -> activate this element
    $(this).activate();
    return false;
  });
  
});

(function() {
  $Clearly.swap = new $Clearly.Mode('swap');
  
  var swap = function(forward, inside) {
	var a = $Clearly.active, b, s = $Clearly.selector;
	
	b = forward ? a.next(s) : a.prev(s);
	
	if(inside) {
	  if(b.length === 0) { // Stepping out
	    b = a.parent(s);
	    if(a.is('li')) {
	      $Clearly.changeTag("<p></p>");
	      a = $Clearly.active;
	    }
	  } else if(b.is('section')) { // Entering section

	    forward ?
	      b.prepend(a) :
	      b.append(a);

	    return;

	  } else if(b.is('ul, ol')) { // Entering lists

	    if(a.is('p')) {
	      forward ?
		b.prepend(a) :
		b.append(a);
	      $Clearly.changeTag("<li></li>");
	      return;
	    }

	  }
	}

	forward ?
	  b.after(a) :
	  b.before(a);
	
      };
  
  $Clearly.swap.down = function(inside) {
    swap(true, inside);
  };

  $Clearly.swap.up = function(inside) {
    swap(false, inside);
  };
  
  $Clearly.nav.bind({shift:true, code:'38'}, function(event) {
    $Clearly.swap.up(event.ctrlKey);
    $Clearly.active.activate().scrollShow();
    $Clearly.save();
    event.preventDefault();
  });
  
  $Clearly.nav.bind({shift:true, code:'40'}, function(event) {
    $Clearly.swap.down(event.ctrlKey);
    $Clearly.active.activate().scrollShow();
    $Clearly.save();
    event.preventDefault();
  });

})();

(function() {
  $Clearly.todo = new $Clearly.Mode('todo');
  $Clearly.todo.states = ['todo', 'working', 'done', 'cancelled'];
  
  $Clearly.todo.getStates = function(elem) {
    var a = elem.closest('[data-todo-states]');
    if(a.length) {
      return a.attr('data-todo-states').split(' ');
    }
    return this.states;
  };
  
  $Clearly.todo.setStates = function(s) {
    if(s) {
      $Clearly.active.attr('data-todo-states', s);
    } else {
      $Clearly.active.removeAttr('data-todo-states');
    }
  };
  
  $Clearly.todo.isTask = function(elem) {
    var a = elem.closest('[data-todo-states]');
    if(a.length) return true;
    var s = this.getStates(elem);
    for(var i = 0; i<s.length; ++i) {
      if(elem.is('.' + s[i])) {
        return true;
      }
    }
    return false;
  };
  
  $Clearly.todo.first = function() {
    var a = $Clearly.active;
    var s = this.getStates(a);
    for(var i = 0; i<s.length; ++i) {
      if(a.is('.' + s[i])) {
        break;
      }
    }
    if(i < s.length) {
      a.removeClass(s[i]);
    }
    a.addClass(s[0]);
  };
  
  $Clearly.todo.toggle = function(forward) {
    //console.log('toggle with', forward);
    var a = $Clearly.active;
    var s = this.getStates(a);
    for(var i = 0; i<s.length; ++i) {
      if(a.is('.' + s[i])) {
        break;
      }
    }
    if(i == s.length) {
      if(forward) {
        a.addClass(s[0]);
      } else {
        a.addClass(s[s.length-1]);
      }
    } else {
      a.removeClass(s[i]);
      if(i > 0 && !forward) {
        a.addClass(s[i-1]);
      } else if(i < s.length-1 && forward) {
        a.addClass(s[i+1]);
      }
    }
  };
  
  var tab_handler = function(event) {
	$Clearly.todo.toggle(!event.shiftKey);
	$Clearly.save();
	event.preventDefault();
      };
  
  var tab_keydesc = { ctrl:false,
		      alt:false,
		      meta:false,
		      code:'9' };
  
  $Clearly.todo.bind(tab_keydesc, tab_handler);
  
})();

$Clearly.nav.start();
$Clearly.swap.start();
$Clearly.todo.start();
