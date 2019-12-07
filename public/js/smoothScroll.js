(function () {

    var smoothScroll = function (event) {

        $('html, body').animate({
            scrollTop: $('#gtco-contact').offset().top
        }, 500, 'easeInOutExpo');

        return false;
        // $(window).scroll(function () {

        // 	var $win = $(window);
        // 	if ($win.scrollTop() > 200) {
        // 		$('.register-button').addClass('active');
        // 	} else {
        // 		$('.register-button').removeClass('active');
        // 	}

        // });
    }

    $(function () {
        smoothScroll()
    });


}());