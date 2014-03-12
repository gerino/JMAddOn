// Import the page-mod API
var addOnName = 'JM AddOn v.1.0';
var pageMod = require("sdk/page-mod");
var self = require("sdk/self");
var widgets = require("sdk/widget");
var ss = require("sdk/simple-storage");

var widget = widgets.Widget({
  id: "jmAddOn",
  label: addOnName,
  contentURL: self.data.url("widget.html"),
  height: 16,
  width: 16
});

widget.port.on('showpanel', function(){
	var panel = require("sdk/panel").Panel({
	  width: 380,
	  height: 380,
	  contentURL: self.data.url("widget-panel.html"),
	  //contentStyleFile: self.data.url("css/south-street/jquery-ui-1.10.4.custom.css"),
	  contentScriptFile: [
	  self.data.url("js/jquery-1.10.2.js"),
	  self.data.url("js/jquery-ui-1.10.4.custom.js"),
	  self.data.url("widget-panel.script.js")
	  ],
	  position: {
		bottom: 10,
		right: 10
		}
	});

	panel.show();
	
	panel.port.on('niepoka_addperson', function(name){niepoka_addperson(name);});
	panel.port.on('niepoka_ignorelist_get', function(){
		panel.port.emit('niepoka_ignorelist_show', ss.storage.niepoka_ignorelist);
	});
	panel.port.on('niepoka_removeperson', function(name){niepoka_removeperson(name);});
});

pageMod.PageMod({
  include: "*.joemonster.org",
  contentScriptFile: [self.data.url("jquery-2.1.0.min.niepoka.js"), self.data.url("niepoka.js")],
  onAttach: function(worker) {
    worker.port.emit("performReplace", ss.storage.niepoka_ignorelist);
	worker.port.on('niepoka_addperson', function(name){niepoka_addperson(name);});
  }
});



// functions

function niepoka_addperson(name){
	if(ss.storage.niepoka_ignorelist == undefined)
		ss.storage.niepoka_ignorelist = [];
		
	if(ss.storage.niepoka_ignorelist.indexOf(name) == -1)
		ss.storage.niepoka_ignorelist.push(name);
}
function niepoka_removeperson(name){
	if(ss.storage.niepoka_ignorelist != undefined){
		var index = ss.storage.niepoka_ignorelist.indexOf(name);
		if(index > -1){
			ss.storage.niepoka_ignorelist.splice(index, 1);
		}
	}
}