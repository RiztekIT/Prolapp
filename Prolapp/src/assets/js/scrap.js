function historialLeche() {
    var request = require('request');
    var cheerio = require('cheerio');
    var d = new Date();
    var n = d.getDay();


    request('http://cheesereporter.com/pricenfdmdetails.htm', function(error, response, html) {

        if (!error && response.statusCode == 200) {
            var $ = cheerio.load(html);
            var parsedResults = [];
            $('td').each(function(i, element) {
                // Select the previous element
                var a = $(this).prev();
                // Parse the link title
                var title = a.text();
                // Get the subtext children from the next row in the HTML table.
                var subtext = a.parent().parent().next().children('.subtext').children();
                // Our parsed meta data object
                var metadata = {
                    title: title,
                };
                // Push meta-data into parsedResults array
                parsedResults.push(metadata);
            });

            //obtenemos la fecha y condicionamos si es fin de semana o no, ya que en la pagina donde se realiza el scrap
            //cambia el acomodo dependiendo si es fin de semana o no
            var fecha = new Date();
            var diaSemana = fecha.getDay();
            if (diaSemana >= 1 && diaSemana <= 5) {
                preciolecheF = parsedResults[8];
                diaPrecio = parsedResults[7];
                console.log(JSON.stringify(diaPrecio) + " " + JSON.stringify(preciolecheF));

            } else {
                preciolecheF = parsedResults[20];
                diaPrecio = parsedResults[19];
                console.log(JSON.stringify(diaPrecio) + " " + JSON.stringify(preciolecheF));

            }
        }
    });
};