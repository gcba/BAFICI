 /*
  * Este archivo es responsable de chequear si existen los archivos
  * de estadísticas y de generar los gráficos en D3 si existen
  */

var archivo01 = "datos/innovatiba_0.csv",
	archivo02 = "datos/innovatiba_1.csv",
	archivo03 = "datos/innovatiba_2.csv";



$.ajax({
	url: archivo01,
	type: "HEAD",
	error: function() {
    	console.log("no encuentro la url");
	},

     success: function() {
     	console.log(data, textStatus, xhr);
     	// genero el grafico de barras
     	generoGrafico("datos/innovatiba_0.csv");
     }
 });

 function generoGrafico(archivo) {
     var width = 420,
         barHeight = 30;

     var x = d3.scale.linear()
         .range([0, width]);

     var chart = d3.select(".chart")
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
             .attr("height", barHeight - 10);

         bar.append("text")
             .attr("x", 0)
             .attr("y", barHeight / 2)
             .attr("dy", ".35em")
             .text(function(d) {
                 return d.emocion;
             });
     });

 }


 function type(d) {
     d.valor = +d.valor; // coerce to number
     return d;
 }
