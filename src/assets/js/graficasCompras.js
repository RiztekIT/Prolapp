function graficasCompras() {

    $(function() {
        "use strict";
        // ============================================================== 
        // Sales overview
        // ============================================================== 
        new Chartist.Line('#sales-overview2', {
            labels: ['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            series: [
                { meta: "Earning ($)", data: [240, 240, 320, 350, 340, 480] }
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
    });
}