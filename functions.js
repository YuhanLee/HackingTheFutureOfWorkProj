$(document).ready(function () {
	$(".graphContent").click(function() {
		$(this).closest("body").find("div.selectIndicator").removeClass('selectIndicator');
		$(this).addClass('selectIndicator');
	});
});