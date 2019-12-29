/***************************************************
 * 
 * Required: slik@1.8.1
 **************************************************/


/*
 * Here is our slider options we. For more information see:
 * 
 * @see https://kenwheeler.github.io/slick/
 */
var options = {
		accessibility: true,
		adaptiveHeight: false,
//		appendArrows: $widget.getElement(),
//		appendDots: $widget.getElement(),
		arrows: true,
//		asNavFor: $widget.getElement(),
		autoplay: false,
		autoplaySpeed: 300,
		centerMode: false,
		centerPadding: '50px',
		cssEase: 'ease',
//		customPaging; function(){},
		dots: false,
		dotsClass: 'slick-dots',
		draggable: true,
		easing: 'linear',
		edgeFriction: 0.15,
		fade: false,
		focusOnSelect: false,
		focusOnChange: false,
		infinite: true,
		initialSlide: 0,
		lazyLoad: 'ondemand',
		mobileFirst: false,
		nextArrow: '<button type="button" class="slick-next" style="right: 25px; z-index: 1;">Next</button>',
		pauseOnDotsHover: false,
		pauseOnFocus: true,
		pauseOnHover: true,
		prevArrow: '<button type="button" class="slick-prev" style="left: 25px; z-index: 1;">Previous</button>',
		respondTo: 'window',
		rows: 1,
		rtl: false,
//		slide: '',
		slidesPerRow: 1,
		slidesToScroll: 1,
		slidesToShow: 1,
		speed: 300,
		swipe: true,
		swipeToSlide: false,
		touchMove: true,
		touchThreshold: 5,
		useCSS: true,
		useTransform: true,
		variableWidth: false,
		vertical: false,
		verticalSwiping: false,
		waitForAnimate: true,
		zIndex: 1000,
		
        responsive: [{
            breakpoint: 800,
            settings: {
                centerPadding: '40px',
                slidesToShow: 3
            }
        },
        {
            breakpoint: 500,
            settings: {
                centerPadding: '40px',
                slidesToShow: 1
            }
        }]
};


/*
 * We keep in mind if the slider is enabled
 */
var slideEnabled = false;


/*
 * Enable the slider
 *
 * Load slider library and enable the slider.
 */
function enableSlides(){
    if(slideEnabled){
        return;
    }
    slideEnabled = true;
    $widget.setProperty('style.display');
    $widget.setProperty('style.flexDirection');
    $widget.getElement().slick(options);
}

/**
 * Enables editor area
 * 
 * In editor mode, slider is removed and all items are ready to edit.
 */
function enableEditor(){
    if(!slideEnabled){
        return;
    }
    slideEnabled = false;
    $widget.getElement().slick('unslick');
    $widget.setProperty('style.display', 'flex');
    $widget.setProperty('style.flexDirection', 'column');
}

/**
 * Updates view based on the current state of the widget
 * 
 * If widget is ready and we can load the slider, then we change the
 * display to show the slider.
 * 
 */
function updateView(){
    $window.loadLibrary('//cdn.jsdelivr.net/npm/slick-carousel@1.8.1/slick/slick.min.js')
    .then(function(){
        if($widget.state === 'ready'){
            enableSlides();
        } else {
            enableEditor();
        }
    });
}

$widget.on('stateChanged', updateView);


