function GraficaVentasChart() {

    $(function() {
        "use strict";
        // ============================================================== 
        // Sales overview
        // ============================================================== 
        new Chartist.Line('#sales-overview2', {
            labels: ['Jul', 'Aug', 'Sep', 'Oct', 'Nov'],
            series: [
                { meta: "Earning ($)", data: [120, 150, 260, 308, 432] }
            ]
        }, {
            low: 0,
            high: 400,
            showArea: true,
            divisor: 10,
            lineSmooth: false,
            fullWidth: true,
            showLine: true,
            chartPadding: 30,
            axisX: {
                showLabel: true,
                showGrid: false,
                offset: 50
            },
            plugins: [
                Chartist.plugins.tooltip()
            ],
            // As this is axis specific we need to tell Chartist to use whole numbers only on the concerned axis
            axisY: {
                onlyInteger: true,
                showLabel: true,
                scaleMinSpace: 50,
                showGrid: true,
                offset: 10,
                labelInterpolationFnc: function(value) {
                    return (value / 100) + 'k';
                },

            }

        });
        new Chartist.Bar('#ct-sales3-chart', {
            labels: ['Jul', 'Aug', 'Sep', 'Oct', 'Nov'],
            series: [
                [140, 130, 300, 120, 140],
                [230, 300, 200, 400, 280],
                [400, 370, 240, 200, 280]
            ]
        }, {
            stackBars: true,
            axisX: {
                showGrid: false
            },
            axisY: {
                labelInterpolationFnc: function(value) {
                    return (value);
                },
                showGrid: true
            },
            plugins: [
                Chartist.plugins.tooltip()
            ],
        }).on('draw', function(data) {
            if (data.type === 'bar') {
                data.element.attr({
                    style: 'stroke-width: 15px'
                });
            }
        });
    });
}