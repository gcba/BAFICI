 /*
  * Este archivo es responsable de chequear si existen los archivos
  * de estadísticas y de generar los gráficos en D3 si existen
  */

var archivo01 = ["datos/innovatiba_0.csv", "#chart1"],
	archivo02 = ["!datos/innovatiba_1.csv", "#chart2"],
	archivo03 = ["!datos/innovatiba_2.csv", "#chart3"];




function checkeoArchivos(archivo){

    $.ajax({
        url: archivo[0],
        type: "HEAD",
        success: function() {
            generoGrafico(archivo[0], archivo[1]);
            console.log ("genero grafico");
        }
    });


}

function generoGrafico(archivo, svgid) {
    var width = 420,
        barHeight = 40;

    var x = d3.scale.linear()
        .range([0, width]);

    var chart = d3.select(svgid)
        .attr("width", width);

    d3.csv(archivo, type, function(error, data) {
        x.domain([0, d3.max(data, function(d) {
            return d.valor;
        })]);

        chart.attr("height", barHeight * data.length);

        var bar = chart.selectAll("g")
            .data(data)
            .enter().append("g")
            .attr("transform", function(d, i) {
                return "translate(0," + (i * barHeight) + ")";
            });

        bar.append("rect")
            .attr("width", function(d) {
                return x(d.valor);
            })
            .attr("height", barHeight - 10)
            .attr("fill", function (d,i){
               return color(i);
            });

        bar.append("text")
            .attr("x", 0)
            .attr("y", barHeight / 2)
            .attr("dy", ".26em")
            .text(function(d,i) {
                return emociones[i];
            });
    });

}

function type(d) {
    d.valor = +d.valor; // coerce to number
    return d;
}

var tiempoInactivo = 0;
setInterval(
    function () {
        console.log("vigilo archivos");
        checkeoArchivos(archivo01);
        checkeoArchivos(archivo02);
        checkeoArchivos(archivo03);
    }, tiempoSalvapantallas * 999);



