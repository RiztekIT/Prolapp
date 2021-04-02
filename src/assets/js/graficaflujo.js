function graficaFlujo() {

    // ============================================================== 
    // Website Visitor
    // ============================================================== 

    var chart = new Chartist.Line('.website-visitor', {
        labels: ['Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sept', 'Oct', 'Nov'],
        series: [
            [0, 5, 6, 8, 25, 9, 8, 24],
            [0, 3, 1, 2, 8, 1, 5, 18],
            [0, 7, 5, 9, 10, 6, 7, 27],

        ]
    }, {
        low: 0,
        high: 28,
        showArea: true,
        fullWidth: true,
        plugins: [
            Chartist.plugins.tooltip()
        ],
        axisY: {
            onlyInteger: true,
            scaleMinSpace: 40,
            offset: 20,
            labelInterpolationFnc: function(value) {
                return (value / 1) + 'T';
            }
        },
    });
    chart.on('draw', function(ctx) {
        if (ctx.type === 'area') {
            ctx.element.attr({
                x1: ctx.x1 + 0.001
            });
        }
    });

    // Create the gradient definition on created event (always after chart re-render)
    chart.on('created', function(ctx) {
        var defs = ctx.svg.elem('defs');
        defs.elem('linearGradient', {
            id: 'gradient',
            x1: 0,
            y1: 1,
            x2: 0,
            y2: 0
        }).elem('stop', {
            offset: 0,
            'stop-color': 'rgba(255, 255, 255, 1)'
        }).parent().elem('stop', {
            offset: 1,
            'stop-color': 'rgba(38, 198, 218, 1)'
        });
    });

}