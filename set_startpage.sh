touch /usr/lib/firefox/defaults/pref/autoconfig.js
echo '//\npref("general.config.filename", "autoconfig.cfg");\npref("general.config.obscure_value", 0);\npref("general.config.sandbox_enabled", false);' > /usr/lib/firefox/defaults/pref/autoconfig.js

touch /usr/lib/firefox/autoconfig.cfg
echo '//\nvar {classes:Cc,interfaces:Ci,utils:Cu} = Components;  \n  \n/* set new tab page */  \ntry {  \n  Cu.import("resource:///modules/AboutNewTab.jsm");  \n  var newTabURL = "ln.topdf.de/newNewTab/";  \n  AboutNewTab.newTabURL = newTabURL;  \n} catch(e){Cu.reportError(e);} // report errors in the Browser Console  ' > /usr/lib/firefox/autoconfig.cfg
