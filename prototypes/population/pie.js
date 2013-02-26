Raphael.fn.pieChart = function (cx, cy, r, values, labels, stroke) {
    var paper = this,
        rad = Math.PI / 180,
        chart = this.set();
    function sector(cx, cy, r, startAngle, endAngle, params) {
        var x1 = cx + r * Math.cos(-startAngle * rad),
            x2 = cx + r * Math.cos(-endAngle * rad),
            y1 = cy + r * Math.sin(-startAngle * rad),
            y2 = cy + r * Math.sin(-endAngle * rad);
        return paper.path(["M", cx, cy, "L", x1, y1, "A", r, r, 0, +(endAngle - startAngle > 180), 0, x2, y2, "z"]).attr(params);
    }
    var angle = 0,
        total = 0,
        start = 0,
        process = function (j) {
            var value = values[j],
                angleplus = 360 * value / total,
                popangle = angle + (angleplus / 2),
                color = Raphael.hsb(start, .4, 1),
                ms = 500,
                delta = 30,
                bcolor = Raphael.hsb(start, 1, .5),
                p = sector(cx, cy, r, angle, angle + angleplus, {fill: "90-" + bcolor + "-" + color, stroke: stroke, "stroke-width": 3}),
                txt = paper.text(cx + (r + delta + 55) * Math.cos(-popangle * rad), cy + (r + delta + 25) * Math.sin(-popangle * rad), labels[j]).attr({fill: bcolor, stroke: "none", opacity: 0, "font-size": 20});
            p.mouseover(function () {
                p.stop().animate({transform: "s1.1 1.1 " + cx + " " + cy}, ms, "elastic");
                txt.stop().animate({opacity: 1}, ms, "elastic");
            }).mouseout(function () {
                p.stop().animate({transform: ""}, ms, "elastic");
                txt.stop().animate({opacity: 0}, ms);
            });
            angle += angleplus;
            chart.push(p);
            chart.push(txt);
            start += .05;
        };
    for (var i = 0, ii = values.length; i < ii; i++) {
        total += values[i];
    }
    for (i = 0; i < ii; i++) {
        process(i);
    }
    return chart;
};

$(function () {
    //data source: http://data.wien.gv.at/katalog/bevoelkerung-geburtsland-bezirke.html
    var values = [ 68.258606966, 5.9608681534,         3.8664034505, 2.4871049962, 2.3310143878, 1.9963046296, 0.5393056956, 1.3346436669, 1.0145889547, 0.9098197429, 11.3013393563],
        labels = ["Austria","Serbia and Montenegro","Turkey","Germany","Poland",          "Bosnia","Croatia","Romania",       "Czech Republic",   "Hungary",  "Other"];
        
    Raphael("holder", 700, 700).pieChart(350, 350, 200, values, labels, "#fff");
});
