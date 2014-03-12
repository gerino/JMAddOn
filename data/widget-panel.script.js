back();
//$('#btnNiePoka').button();
//$('#btnNiePoka').button().click(showPage('NiePoka'));
$('#btnBack').button();
$('#btnBack').click(function(){
	back();
	});
	
map("NiePoka");

function map(name){
	$('#btn'+name).button().click(function(event){
		event.preventDefault();
		showPage(name);
	});
}
function showPage(name){
	$('#menu').hide();
	$('.menuPage').hide();
	$('#'+name).show();
	$('#back').show();
}
function back(initial){
	$('.menuPage').hide();
	$('#menu').show();
	$('#back').hide();
}

// === Add Person ===
$('#dialog-form').dialog({
autoOpen: false,
      height: 300,
      width: 350,
      modal: true,
	  buttons: {
		"Dodaj": function() {
			try{
			var name = $('#name');
			var tips = $('.validateTips');
			name.removeClass('ui-state-error');
			
			if(name.val().length == 0){
				name.addClass('ui-state-error');
				tips.addClass('ui-state-highlight');
				  setTimeout(function() {
					tips.removeClass('ui-state-highlight', 1500 );
				  }, 500 );
			}
			self.port.emit('niepoka_addperson', name.val());
			}catch(e){
				alert(e);
			}
			$( this ).dialog('close');
		},
		Cancel: function() {
		  $( this ).dialog('close');
		}
	  },
	  close: function() {
        $('#name').val('').removeClass( "ui-state-error" );
      }
	});
$('#btnAddPerson')
      .button()
      .click(function() {
        $( "#dialog-form" ).dialog( "open" );
      });
	  
// === Ignore List ===
$('#dialog-ignorelist').dialog({
		autoOpen: false,
		height: 300,
		width: 350,
		modal: true,
		buttons: {
			"Zamknij": function(){
				$(this).dialog("close");
			}
		},
		close: function(){
			$(this).empty();
		}
	});
$('#btnIgnoreList').button().click(function(){
	self.port.emit('niepoka_ignorelist_get');
});
self.port.on('niepoka_ignorelist_show', function(list){
	if(list != null && list != undefined){
		var table = $('<table/>');
		for(var i = 0; i < list.length; ++i){
			var name = list[i];
			var tr = $('<tr/>');
			tr.append($('<td/>').text(name));
			var button = $('<button/>').text('Odblokuj').addClass('niepoka_unblock').attr('data-name', name);
			button.click(function(){
			try{
				self.port.emit('niepoka_removeperson', $(this).attr('data-name'));
				$(this).parent().parent().remove();
			}catch(e){
				alert(e);
			}
			});
			tr.append($('<td/>').append(button));
			table.append(tr);
		}
		$('#dialog-ignorelist').append(table);
		$('#dialog-ignorelist').dialog('open');
	}
});

// === Hide Mode ===
$('#dialog-hidemode').dialog({
		autoOpen: false,
		height: 300,
		width: 350,
		modal: true,
		buttons: {
			"Zamknij": function(){
				$(this).dialog("close");
			}
		},
		close: function(){
			$(this).empty();
		}
	});
$('#btnHideMode').button().click(function(){
	self.port.emit('niepoka_hidemode_get');
});
self.port.on('niepoka_hidemode_show', function(silentMode){
	var textEnabled = 'Tryb cichy włączony - posty ignorowanych użytkowników znikają bez śladu.';
	var textDisabled = 'Tryb cichy wyłączony - widzisz nagłówki ukrytych postów oraz możesz je na życzenie wyświetlić.';
	var content = $('<span/>').text(silentMode ? textEnabled : textDisabled);
	var btnSwitch = $('<button/>').attr('style', 'display: block;').text('Zmień').click(function(){
		self.port.emit('niepoka_hidemode_switch');
		self.port.emit('niepoka_hidemode_get');
		$(this).parent().dialog('close');
	});
	$('#dialog-hidemode').append(content).append(btnSwitch);
	$('#dialog-hidemode').dialog('open');
});