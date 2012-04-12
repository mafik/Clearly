/**
 * @author: Marek Rogalski
 * @license: GPLv3
 */

$Clearly = { selector : 'h1, h2, h3, h4, h5, h6, section, p, blockquote, dl, ul, ol, pre, hr'
        , active : undefined
        , killring : []
        , activity : []
        , on : {}
        , install : {} };
        
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
  var data = { shift : event.shiftKey
             , ctrl : event.ctrlKey
             , alt : event.altKey
             , meta : event.metaKey
             , code : event.keyCode };
  
  // console.log(data);
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
  localStorage['body_contents'] = $('body').html();
};

$Clearly.load = function() {
  if(!localStorage || !getSelection) {
    console.warn('Your browser is killing Clearly. Trace this message if you want to know why.');
    console.info('If you want to use Clearly without interruptions switch to HTML5 compatible browser.');
  }
  if(localStorage.body_contents) {
    $('body').html(localStorage.body_contents);
    $Clearly.active = $('.active');
  } else {
    $($Clearly.selector).first().activate();
  }
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
}


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
  $Clearly.active.remove();
  if(saveToKillRing) {
    $Clearly.killring.push($Clearly.active);
  }
  while($Clearly.activity.length > 0) {
    var candidate = $Clearly.activity.pop();
    if(candidate.isReal()) {
      candidate.activate().scrollShow();
      break;
    }
  }
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
  }
  $.fn.textNodes = function() {
    return this.contents().filter(filterTextNodes);
  }
})();

(function() {
  var scrollFunction = function(pos) {
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
  var a = $Clearly.active, nav = $Clearly.selector;
  if(a.parent().is(nav)) {
    a.unwrap().scrollShow();
  }
};

$Clearly.makeSection = function() {
  $Clearly.active.wrap('<section></section>').scrollShow();
};

$Clearly.changeTag = function(x) {
  var a = $Clearly.active, b;
  a.wrapInner('<'+x+'></'+x+'>');
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
  } else if(a.is('dl')) {
    inside = true; tag = '<dt></dt>';
  } else if(a.is('dt')) {
    inside = false; tag = '<dd></dd>';
  } else if(a.is('dd')) {
    inside = false; tag = '<dt></dt>';
  } else {
    inside = false; tag = '<p></p>';
  }
  if(inside) {
    a.append(tag).children().last().activate();
  } else {
    a.after(tag).next().activate();
  }
  if($Clearly.todo && $Clearly.todo.isTask(a)) {
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
      a.children('br').remove();
    } else if(a.is('blockquote')) {
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
    
    if($Clearly.active.is('p, li, blockquote')) {
      var sel = window.getSelection();
      var range = sel.getRangeAt(0);
      if(sel.isCollapsed) {
        range.setEndAfter($Clearly.active.contents().last()[0]);
      }
      var fragment = $(range.extractContents());
      var left_empty = ($Clearly.active.text().length == 0);
      if(left_empty) $Clearly.active.text('dummy');
      
      $Clearly.edit.end();
      
      //console.log($Clearly.active.text(), $Clearly.active.text().length, left_empty, fragment);
      $Clearly.smartNew();
      
      if(fragment) {
        $Clearly.active.html(fragment);
      }
      if(left_empty) {
        $Clearly.active.prev().text('').activate();
      } else {
        $Clearly.active.prev().removeAttr('contenteditable');
        $Clearly.save();
        $Clearly.active.attr('contenteditable', 'true').focus();
      }
      $Clearly.edit.start();
      
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
  
  $('.active').live('click', function() {
    if($Clearly.on.edit) return true;
    $Clearly.edit.start();
    return false;
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
  }

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
  
  function register_tag(code, tag) {
    $Clearly.nav.bind({ctrl:false, code:code}, function(event) {
      $Clearly.changeTag(tag);
      $Clearly.save();
      event.preventDefault();
    });
    
    $Clearly.nav.bind({ctrl:true, code:code}, function(event) {
      if(event.altKey) {
        $Clearly.active.before('<'+tag+' />').prev().activate().scrollShow();
      } else {
        $Clearly.active.after('<'+tag+' />').next().activate().scrollShow();
      }
      $Clearly.edit.start();
      event.preventDefault();
    });
  }
  
  register_tag(80, 'p'); // p
  register_tag(85, 'ul'); // u
  register_tag(69, 'section'); // e
  //register_tag(69, 'blockquote'); // o
  //register_tag(79, 'pre'); // e
  
  // Shift - odwrócenie kolejności
  // Ctrl - nowy element
  // Pierwszy plus za specyfikacje, drugi za implementacje
  // u - ul
  // o - ol
  // i - dl
  // e - section
  // \ - hr
  // p - p
  // +1-6 - h#
  // ' - blockquote
  // +; - pre
  // enter - smart edit/create
  /**
   * ";" changes current node to pre. All sub-nodes are joined and
   *     stripped of tags and only their text contents are saved.
   *     Old contents are saved in the killring.
   * Ctrl + [Shift] + ";" creates new pre element and starts edit mode (if in section or toplevel)
   */
  
  /**
   * 1..6 changes tag of selection to a header (from other header or paragraph)
   * Ctrl + [Shift] + 1..6 creates new header and starts edit mode (if in section or toplevel)
   */
  
  for(var i=0; i<6; ++i)
    register_tag((i+49).toString(), 'h' + (i+1));
    
  /**
   * [Ctrl] + \ creates new horizontal rule after currently selected tag (if in section or toplevel)
   * [Ctrl] + Shift + \ creates new rule before currently selected tag (if in section or toplevel)
   */
  
  $Clearly.nav.bind({ctrl:true, code:'82'}, function(event) {
    if(event.shiftKey) {
      $Clearly.active.before('<hr>').prev().activate().scrollShow();
    } else {
      $Clearly.active.after('<hr>').next().activate().scrollShow();
    }
    $Clearly.save();
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
  
  $Clearly.nav.bind({shift:true, code:'35'}, function(event) {
    $('body').children($Clearly.selector).last().activate().scrollShow();
    event.preventDefault();
  });
  
  $Clearly.nav.bind({shift:true, code:'36'}, function(event) {
    $('body').children($Clearly.selector).first().activate().scrollShow();
    event.preventDefault();
  });
  $Clearly.nav.bind({shift:false, code:'35'}, function(event) {
    $Clearly.active.siblings($Clearly.selector).andSelf().last().activate().scrollShow();
    event.preventDefault();
  });
  
  $Clearly.nav.bind({shift:false, code:'36'}, function(event) {
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
  
  $($Clearly.selector).live('click', function() {
    if($(this).is('.active')) return false;
    $(this).activate();
    return false;
  });
  
})();

(function() {
  $Clearly.swap = new $Clearly.Mode('swap');
  
  $Clearly.swap.down = function(inside) {
    var a = $Clearly.active, b, s = $Clearly.selector;
    if(inside) {
      b = a.next(s);
      if(b.length) {
        b.prepend(a);
      } else {
        a.parent(s).after(a);
      }
    } else {
      a.next(s).after(a);
    }
  };

  $Clearly.swap.up = function(inside) {
    var a = $Clearly.active, b, s = $Clearly.selector;
    if(inside) {
      b = a.prev(s);
      if(b.length) {
        b.append(a);
      } else {
        a.parent(s).before(a);
      }
    } else {
      a.prev(s).before(a);
    }
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
  $Clearly.todo.states = ['todo', 'working', 'cancelled', 'done'];
  
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
    var a = $Clearly.active
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
    var a = $Clearly.active
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
  }
  
  $Clearly.nav.bind({ ctrl:false
                 , alt:false
                 , meta:false
                 , code:'90'}, function(event) { // [shift] z
    $Clearly.todo.toggle(!event.shiftKey);
    $Clearly.save();
    event.preventDefault();
  });
  
  $Clearly.nav.bind( { ctrl: true
                  , shift:false
                  , alt:false
                  , meta:false
                  , code:'90'}, function(event) { // z
    $Clearly.smartNew();
    $Clearly.todo.first();
    $Clearly.edit.start();
    event.preventDefault();
  });
})();

$Clearly.nav.start();
$Clearly.swap.start();
$Clearly.todo.start();
