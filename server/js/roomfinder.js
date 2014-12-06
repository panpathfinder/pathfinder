function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

$(document).ready(function() {
    console.log('ready')
    // Optimalisation: Store the references outside the event handler:
    var $window = $(window);
    function checkWidth() {
        console.log('checkWidth');
        var w = $window.width();
        var h = $window.height();
        console.log(w);
        console.log(h);

        var paper = Raphael(0, 0, w, h);
        paper.image('/img/4301f5.png', 0, 0, w, h);
        var r = 15;
        var x = getRandomInt(2*r, w-2*r);
        var y = getRandomInt(2*r, h-2*r);
        console.log(x)
        console.log(y)
//        var star = paper.star(x, y, r, r / 2, 5);
//        console.log(star)
//        star.attr({ fill: "#79DE00" });
paper.star(paper, x, y, r).attr({
//    fill: "#F90900",
//    fill: "yellow",
    fill: "#00FF00",
    'stroke-width': 1
});

//        if (windowsize > 440) {
//            //if the window is greater than 440px wide then turn on jScrollPane..
//            $pane.jScrollPane({
//                scrollbarWidth:15,
//                scrollbarMargin:52
//            });
//        }
    }
    // Execute on load
    checkWidth();
    // Bind event listener
    $(window).resize(checkWidth);
});