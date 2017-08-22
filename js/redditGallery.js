var after = '';
var index = 0;
var permalinkMap = new Map();

window.onload = function() {
	var sortType = localStorage.getItem('sortType');
	var time = localStorage.getItem('time');
	loadImages(sortType, time);

	$('.navbar-inverse .navbar-nav > li > #' + sortType).css({"background-color":"#b98c21"});
	
	if (time) {
		$('#' + time + '-dropdown').css({"background-color":"#b98c21"});
		$('.dropdown-menu li #' + time).css({"background-color":"#b98c21"});
	}
}

$(window).scroll(function() {   
	if ($(window).scrollTop() > $(document).height() - $(window).height() - 150) {
		loadImages(localStorage.getItem('sortType'), localStorage.getItem('time'));
	}
});

function appendSortTypeToURL(url, type) {
	if (type === 'new') {
		url += 'new';
	}
	else if (type === 'rising') {
		url += 'rising';
	}
	else if (type === 'controversial') {
		url += 'controversial';
	}
	else if (type === 'top') {
		url += 'top';
	}
	else if (type === 'gilded') {
		url += 'gilded';
	}
	url += '.json?';
	return url;
}

function appendTimeToURL(url, type, time) {
	url = url + 'sort=' + type + '&t=';
	if (time === 'hour') {
		url += 'hour';
	}
	else if (time === 'day') {
		url += 'day';
	}
	else if (time === 'week') {
		url += 'week';
	}
	else if (time === 'month') {
		url += 'month';
	}
	else if (time === 'year') {
		url += 'year';
	}
	else if (time === 'all') {
		url += 'all';
	}
	return url;
}

function loadImages(type, time) {
	var url = 'https://www.reddit.com/r/';
	var subreddits = 'art+artporn+drawing/';
	url += subreddits;
	url = appendSortTypeToURL(url, type);
	if (time) url = appendTimeToURL(url, type, time); 

	url += '&after=' + after;
	//console.log("The URL is:", url);

	$.getJSON(url, function(data) { 
		if (after == data.data.after || after == null) return;
		after = data.data.after;
		$.each(data.data.children, function(i,item) {
			if (item.data.url) {
				var extension = item.data.url.slice(-4);
				var imgur = item.data.url.slice(8,13);

				if (imgur != 'imgur' && (extension === '.jpg' || extension === '.png' || extension === '.gif' || extension === '.gifv')) {
					var boxID = '#box' + index;
					var textID = '#text' + index;
					var imageID = '#image' + index++;
					$('<div class="col-lg-3 col-md-4 col-sm-6"><div class="thumbnail" id="tempBoxID"></div></div>').appendTo('.row');
					$('<img class="center-block" id="tempImageID"/>').attr('src', item.data.url).appendTo('#tempBoxID');
					$('#tempBoxID').prepend('<span class="text" id="tempTextID"></span>');
					document.getElementById("tempTextID").innerHTML = "<br/>" + "<h5>" + item.data.title + "</h5>" + "Author: " 
					+ item.data.author + "<br>" + "Subreddit: " + item.data.subreddit

					$('#tempBoxID').attr({
						id: boxID
					});
					$('#tempTextID').attr({
						id: textID
					});
					$('#tempImageID').attr({
						id: imageID
					});

					var link = "https://www.reddit.com" + item.data.permalink;
					permalinkMap.set(boxID, link);
				}
			}
		});
	});
};

function sortGallery(clickedID, dropdownID) {
	if (clickedID != localStorage.getItem('sortType') || dropdownID) {
		localStorage.setItem('sortType', clickedID);
		localStorage.setItem('time', dropdownID);
		location.reload();
	}
}

$(document).on('mouseover', '.thumbnail', function() {
	var box = $(this).attr('id');
	$(this).click(function() {
		location.href = permalinkMap.get(box);
	});
});
