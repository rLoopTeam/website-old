//	Side-Nav init
// $(".button-collapse").sideNav();

var query = document.location.search.toLowerCase();
if (query == '?loopy' || query == '?loopy=true') {
	$('#home-page>header').addClass('loopy');
}