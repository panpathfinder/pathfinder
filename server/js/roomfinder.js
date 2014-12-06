function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

$(document).ready(function () {
    var paper;
    var floor = 1;
    var building = 1;
    var starred = null;
    $search = $("#search");
    $searched = $("#searched");

    var getDesc = function(entry) {
        var label = '';
        if (entry['rooms']) {
            label = entry.display + ' GAP' + entry.building + '/' + entry['floor'] + ' (' + entry.rooms + ')';
            if (entry["has_projector"]) {
                label += " Projector";
            }
        } else {
            label = entry.display + ' GAP' + entry.building + '/' + entry['floor'] + ' (' + entry.cube + ') ' + entry['phone'];
        }
        return label;
    };

    var searchChanged = function () {
        var val = $search.val();
        console.log(val);
        if (ldapdb[val]) {
            var entry = ldapdb[val];
            console.log(entry['building']);
            console.log(entry['floor']);
            if (entry['building'] && entry['floor']) {
                floor = entry['floor'];
                building = entry['building'];
                resizeMap();
            }
            $searched.text(getDesc(entry));
            starred = entry;
            drawStarred();
        }
    };

    var getRelativeX = function(x,xmax) {
        return  (0.0 + x)*paper.width/xmax;
    };
    var getRelativeY = function(y,ymax) {
        return  (0.0 + y)*paper.height/ymax;
    };

    var drawStarred = function () {
        if (starred && starred['floor'] == floor && starred['building'] == building) {
            if (starred.x && starred.y && starred.xmax && starred.ymax) {
                console.log('draw star');
                var r = 10;
                var x = getRelativeX(starred.x,starred.xmax);
                var y = getRelativeY(starred.y,starred.ymax);
                var star = paper.star(paper, x, y, r).attr({
                    fill: "#00FF00",
                    'stroke-width': 1
                });
            }
        }
    };

    $search.autocomplete({
        source: ldapkeys
    });
//    $search.keyup(searchChanged);
    $search.keypress(searchChanged);
    $search.change(searchChanged);
    $search.blur(searchChanged);
//    $search.focus(searchChanged);
    $search.on('autocompleteselect', searchChanged);


    var getMapImageSource = function () {
        var src = '/img/4' + (building == 1 ? '3' : '4') + '01' + 'f' + floor + '.png';
        console.log('image = ' + src);
        return src;
    };

    var $window = $(window);
    var $toolbar = $('#toolbar');

    var getQtip = function(entry) {
        var label = '';
        if (entry['rooms']) {
            label = entry.display + ' (' + entry.rooms + ')' + '<br/>' +
                ' GAP' + entry.building + '/' + entry['floor'];
            if (entry["has_projector"]) {
                label += '<br/>' + "Projector";
            }
        } else {
            label = entry.display  + '<br/>' +
                entry.title  + '<br/>' +
                entry.phone  + '<br/>' +
                ' GAP' + entry.building + '/' + entry['floor'] + '<br/>' +
            entry.office

        }
        return label;
    };
    var drawHotspots = function() {
        for(var n in ldapdb) {
            var entry = ldapdb[n];
            if (entry && entry['floor'] == floor && entry['building'] == building) {
                if (entry.x && entry.y && entry.xmax && entry.ymax) {
                    var r = 12;
                    var x = getRelativeX(entry.x,entry.xmax);
                    var y = getRelativeY(entry.y,entry.ymax);
                    var cir = paper.circle(x, y, r).attr({
                        stroke: "none",
                        "fill-opacity": 0.10,
                        fill: "pink"
                    });
                    (function(cir) {
                        cir.hover(function () {
                                cir.attr({"stroke": "red"});
                            },
                            function () {
                                cir.attr({"stroke": "none"});
                            }
                        );
                    })(cir);
                    $(cir.node).qtip({
                        content: {
                            text: getQtip(entry)
                        }
                    });
                }
            }
        }
    };

    var resizeMap = function () {
        console.log('resizeMap');
        var tw = $toolbar.width();
        var th = $toolbar.height();
        var w = $window.width();
        var padding = 5;
        var h = $window.height() - th - padding;
        console.log(w);
        console.log(h);
        paper = Raphael(0, th, w, h);
        paper.image(getMapImageSource(), 0, 0, w, h);
        drawStarred();
        drawHotspots();
    };
    resizeMap();
    $(window).resize(resizeMap);
    for (var b = 1; b <= 2; b++) {
        (function (f) {
            $('#GAP' + f).on('click', function () {
                building = f;
                resizeMap();
            });
        })(b);
    }
    for (var f = 1; f <= 5; f++) {
        (function (f) {
            $('#floor' + f).on('click', function () {
                floor = f;
                resizeMap();
            });
        })(f);
    }
});