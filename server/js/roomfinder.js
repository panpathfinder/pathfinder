function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

$(document).ready(function () {
    var floor = 1;
    var building = 1;

    $search = $("#search");
    $searched = $("#searched");

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
            var label;
            if (entry['rooms']) {
                label = entry.display + ' GAP' + entry.building + '/' + entry['floor'] + ' (' + entry.rooms + ')';
                if (entry["has_projector"]) {
                    label += " Projector";
                }
            } else {
                label = entry.display + ' GAP' + entry.building + '/' + entry['floor'] + ' (' + entry.cube + ') ' + entry['phone'];
            }
            $searched.text(label);

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

    var resizeMap = function () {
        console.log('resizeMap');
        var tw = $toolbar.width();
        var th = $toolbar.height();
        var w = $window.width();
        var padding = 5;
        var h = $window.height() - th - padding;
        console.log(w);
        console.log(h);
        var paper = Raphael(0, th, w, h);
        paper.image(getMapImageSource(), 0, 0, w, h);
        var r = 12;
        var x = getRandomInt(2 * r, w - 2 * r);
        var y = getRandomInt(2 * r, h - 2 * r);
        var star = paper.star(paper, x, y, r).attr({
            fill: "#00FF00",
            'stroke-width': 1
        });
        rect = paper.rect(30, 30, 90, 90);
        rect.attr({
            stroke: "none",
            "fill-opacity": 0.05,
            fill: "#f00"
        });
        rect.hover(function () {
                rect.attr({"stroke": "#000"});
            },
            function () {
                rect.attr({"stroke": "none"});
            }
        );
        $(rect.node).qtip({
            content: {
                text: 'name: mac<br/>cube: 5566'
            }
        })

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