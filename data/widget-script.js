function init(){
 var widgetButton = document.getElementById("jmaddonwidgetbutton");
  widgetButton.onclick = function() {
    addon.port.emit('showpanel');
  }
}