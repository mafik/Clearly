/*
  This file is part of Clearly provides bindings to MathJax. This file
  is subject to GPLv3 (see http://www.gnu.org/licenses/).
  
  Authors: Marek Rogalski
 */

(function() {
  $Clearly.typesetMath = function() {
    MathJax.Hub.Typeset($Clearly.active[0]);
    $Clearly.save();
  };
  
  //$Clearly.math = new $Clearly.Mode('math');
  $Clearly.nav.bind({ ctrl: false, shift: false,
		       code: $Clearly.Keycodes['M'] }, $Clearly.typesetMath);
  //$Clearly.math.start();

})();

