self.port.on('performReplace', function(list){performReplace(list);});

function performReplace(ignoredUsers){
	if(ignoredUsers == null || ignoredUsers == undefined)
		ignoredUsers = [];
	
	console.log("Removing posts by: "+ignoredUsers.toSource());
	if(document.getElementById('forumBoth')){
		if(!window.jQuery){
			throw('jquery did not load succesfully!');
		}
		
		$('#cookieContent').parent().parent().remove();
		
		$('.postHeader').each(function(){
			var name = $(this).find('a[href*="/bojownik/"]').attr('href').replace('/bojownik/','');
			if(ignoredUsers.indexOf(name) == -1){
				$(this).append($('<a/>').text('Ignoruj').attr('data-name',name).attr('style', 'cursor: pointer;text-decoration:none;font-size:10px;color:#aaa').addClass('niepoka_addignore'));
			} else{
				$(this).append($('<span/>').text('(Użytkownik ignorowany)').attr('style', 'text-decoration:none;font-size:10px;color:#aaa'));
			}
		});
		$('.niepoka_addignore').on('click', function(){
			try{
				self.port.emit('niepoka_addperson', $(this).attr('data-name'));
				$(this).replaceWith($('<span/>').text('Dodano').attr('style', 'text-decoration:none;font-size:10px;color:#aaa'));
			} catch(e){
				alert(e);
			}
		});
		
		for(var i = 0; i < ignoredUsers.length; ++i){
			var userName  = ignoredUsers[i];
			$('div#forumLeft > div.postBox:has(div:has(a[href="/bojownik/'+userName+'"]))').each(function(){
				var prev = $(this).prev();
				$(this).hide();
				$(this).detach();
				var box = getReplacementBox(userName, $(this));
				box.prepend($(this));
				prev.after(box);
			});
		}
	}
}

function getReplacementBox(userName,post){
	var hideMsg = 'Tu był post użytkownika: '+userName+'. Kliknij aby pokazać.';
	var box = jQuery('<div/>',{
		class: 'niepoka_replace'
	});
	var show = jQuery('<a/>',{
		text: hideMsg,
		style: "cursor: pointer"
	});
	show.click(function(){
		if(!post.is(':visible')){
			post.show();
			show.text('Kliknij aby schować.');
		}else{
			post.hide();
			show.text(hideMsg);
		}
	});
	box.append(show);
	return box;
}