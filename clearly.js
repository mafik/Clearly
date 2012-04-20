/**
 * @author: Marek Rogalski
 * @license: GPLv3
 */

$Clearly = { selector : 'h1, h2, h3, h4, h5, h6, section, p, blockquote, ul, ol, pre, hr, li',
	     inhibitSelector : 'a, button, input',
             active : undefined,
             killring : [],
             activity : [],
             on : {},
             install : {} };

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
  
  //console.log(JSON.stringify(data, null, '  '));
  console.log(JSON.stringify(data));
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
  
  //setTimeout('window.scroll(0, $Clearly.active.offset().top - 10);', 500);
  window.scroll(0, $Clearly.active.offset().top - 10);

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
  var sel = window.getSelection();
  var range = document.createRange();
  range.selectNodeContents(this[0]);
  range.collapse(true);
  sel.removeAllRanges();
  sel.addRange(range);
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
    delete $Clearly.on.edit;
    $Clearly.nav.start();
    return true;
  }
  
  function start () {
    var a = $Clearly.active;
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
  
  
  bind('27', function(event) { // escape
    
    document.execCommand('removeFormat', false, null);
    document.execCommand('unlink', false, null);
    event.preventDefault();
        
  });
  
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
  
  bind('109', function(event) { // -_
    
    document.execCommand('decreaseFontSize', false, null);
    event.preventDefault();
        
  });
  
  bind('61', function(event) { // =+
    
    document.execCommand('increaseFontSize', false, null);
    event.preventDefault();
        
  });

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
    $Clearly.active.scrollShow(200);
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
  
  // TODO: Everything below this comment is a mess & needs fixing.
  
  var keys = {
	p: 80,
	b: 66,
	e: 69,
	r: 82,
	u: 85,
	o: 79,
	s: 83,
	';': 186,
	'\\': 220,
	'1': 49, '2': 50, '3': 51, '4': 52, '5': 53, '6': 54
      };
  
  function bind_tag_creation(code, tag) {
    $Clearly.nav.bind({ctrl:true, code:code}, function(event) {
      if(event.shiftKey) {
        $Clearly.active.before(tag).prev().activate().scrollShow();
      } else {
        $Clearly.active.after(tag).next().activate().scrollShow();
      }
      $Clearly.edit.start();
      event.preventDefault();
    });
  }
  
  function bind_tag_conversion(code, tag) {
    $Clearly.nav.bind({ctrl:false, code:code}, function(event) {
      $Clearly.changeTag(tag);
      $Clearly.save();
      event.preventDefault();
    });
  }
  
  // FIXME: serious cleaning needed
  
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
  
  function bind_simple_tag(code, tag) {
    bind_tag_creation(code, tag);

    $Clearly.nav.bind({ctrl:false, code:code}, function(event) {
      if($Clearly.active.is('h1, h2, h3, h4, h5, h6, p, blockquote, pre')) {
	$Clearly.changeTag(tag);
      } else if($Clearly.active.is('li')) {
	
	change_tag($Clearly.active.parent(), '<section></section>');
	$Clearly.active.siblings().andSelf().each(function(i, e) {
	  change_tag($(e), tag);
	});
	$('.active').activate();
	
      }
      $Clearly.save();
      event.preventDefault();
    });
  };
  
  bind_simple_tag(keys.p, '<p></p>'); // p
  bind_simple_tag(keys.b, '<blockquote></blockquote>'); // b
  bind_simple_tag(keys[';'], '<pre></pre>'); // pre

  for(var i=0; i<6; ++i) {
    bind_simple_tag(i+49, '<h' + (i+1) + ' />');
  }
  
  /**
   * Sections: e
   */

  bind_tag_creation(keys.e, '<section><p></p></section>');

  $Clearly.nav.bind({ctrl:false, code:keys.e}, function(event) {
    if($Clearly.active.is('ul, ol')) {
      $Clearly.changeTag("<section></section>");
      $Clearly.active.children().each(function(i, e) {
	change_tag($(e), "<p></p>");
      });
    }
    $Clearly.save();
    event.preventDefault();
  });
  
  /**
   * Unordered lists: u
   */
  
  bind_tag_creation(keys.u, '<ul><li></li></ul>');

  $Clearly.nav.bind({ctrl:false, code:keys.u}, function(event) {
    if($Clearly.active.is('section')) {
      var allowed = $Clearly.active.find('h1, h2, h3, h4, h5, h6, p, pre, blockquote, li');
      $Clearly.changeTag("<ul></ul>");
      $Clearly.active.empty().append(allowed);
      $Clearly.active.children().each(function(i, e) {
	change_tag($(e), "<li></li>");
      });
    } else if($Clearly.active.is('ol')) {
      $Clearly.changeTag("<ul></ul>");
    } else if($Clearly.active.parent().is('ol')) {
      change_tag($Clearly.active.parent(), "<ul></ul>");
    }
    $Clearly.save();
    event.preventDefault();
  });
  
  /**
   * Ordered lists: o
   */

  bind_tag_creation(keys.o, '<ol><li></li></ul>');

  $Clearly.nav.bind({ctrl:false, code:keys.o}, function(event) {
    if($Clearly.active.is('section')) {
      var allowed = $Clearly.active.find('h1, h2, h3, h4, h5, h6, p, pre, blockquote, li');
      $Clearly.changeTag("<ol></ol>");
      $Clearly.active.empty().append(allowed);
      $Clearly.active.children().each(function(i, e) {
	change_tag($(e), "<li></li>");
      });
    } else if($Clearly.active.is('ul')) {
      $Clearly.changeTag("<ol></ol>");
    } else if($Clearly.active.parent().is('ul')) {
      change_tag($Clearly.active.parent(), "<ol></ol>");
    }
    $Clearly.save();
    event.preventDefault();
  });
  
    
  /**
   * Horizontal rules: \
   */
    
  $Clearly.nav.bind({ctrl:true, code:keys['\\']}, function(event) {
    if(event.shiftKey) {
      $Clearly.active.before('<hr>').prev().scrollShow();
    } else {
      $Clearly.active.after('<hr>').next().scrollShow();
    }
    event.preventDefault();
  });
  
  $Clearly.nav.bind({code:'46'}, function(event) { // del
    $Clearly.deleteActive(!event.shiftKey);
    $Clearly.save();
    event.preventDefault();
  });
  
  $Clearly.nav.bind({ctrl:false, code:'45'}, function(event) { // insert
    if(event.shiftKey) {
      $Clearly.active.before($Clearly.killring.pop());
    } else {
      $Clearly.active.after($Clearly.killring.pop());
    }
    $Clearly.save();
    event.preventDefault();
  });
  
  $Clearly.nav.bind({code:'72'}, function(event) { // h
    $Clearly.nav.hide();
    $Clearly.save();
    event.preventDefault();
  });
  
  $Clearly.nav.bind({ctrl:true, code:keys.s}, function(event) { // Ctrl + s
    
    $Clearly.save();
    localStorage[location.pathname + '~'] = localStorage[location.pathname];
    event.preventDefault();

  });
  
  $Clearly.nav.bind({ctrl:true, code:keys.r}, function(event) { // Ctrl + r
    
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
