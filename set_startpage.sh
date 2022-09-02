new_tab_url="ln.topdf.de/newNewTab/"

js="/usr/lib/firefox/defaults/pref/autoconfig.js"
cfg="/usr/lib/firefox/autoconfig.cfg"

touch $js
cat >$js <<EOL
//
pref("general.config.filename", "autoconfig.cfg");
pref("general.config.obscure_value", 0);
pref("general.config.sandbox_enabled", false);
EOL

touch $cfg
cat >$cfg <<EOL
//
var {classes:Cc,interfaces:Ci,utils:Cu} = Components;

/* set new tab page */
try {
  Cu.import("resource:///modules/AboutNewTab.jsm");
  var newTabURL = ${new_tab_url};
  AboutNewTab.newTabURL = newTabURL;
} catch(e){Cu.reportError(e);} // report errors in the Browser Console
EOL