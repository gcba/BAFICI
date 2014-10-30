/*
 *	v1.0.0 alpha
 * 	
 *  Version Alpha del medidor de emociones para BAFICI 2014
 * 
 */

//acumulo los segundos donde no hubo actividad
var tiempoInactivo = 0;
setInterval(
	function () {
 		tiempoInactivo++;
		// activa el salvapantallas de reposo.
 		if (tiempoInactivo >= tiempoSalvapantallas){
			$("#reposo").css("display", "block");
			$("#reposo").animate({opacity: 1},750);
		}
	},1000);


// Inicializo los nodos iniciales para force layout
var	nodes = d3.range(n).map(function(data) {
		var i = data,
			r = Math.sqrt((i + 1) / m * -Math.log(Math.random())) * maxRadius,
			d = {
				cluster : i,
				radius : 0,
			x : Math.cos(i / m * 2 * Math.PI) * 10 + width / 2 + Math.random(),
			y : Math.sin(i / m * 2 * Math.PI) * 10 + height / 2 + Math.random()
		};
		if (!clusters[i] || (r > clusters[i].radius))
			clusters[i] = d;
		return d;
	});


/*
 * quitoOverflow() elimina el primer nodo del array nodes
 * con clase .nuevo y updatea el forcelayout.
 * 
 */
function quitoOverflow (){
		node = svg.select(".nuevo").remove();
		nodes.splice(6,1);
		node = svg.selectAll(".nuevo").data(nodes);
		update();
}

/*
 * statistics() chequea la superficie de la pantalla vs la suma del
 * radio de todos los nodos agregados. También chequea que si hay mas
 * nodos en pantalla que los permitidos. Si una de las dos condiciones
 * es verdadera quita el nodo mas viejo.
 * 
 */

function statistics (nodos,radio,sCan, sCir){
	if ( limitePorcentaje < ( sCir * 100 / sCan )){
		quitoOverflow(); 
	}
	
	if  (limiteNodos < nodos){
		quitoOverflow(); 
	}	
}


// init de force layout
var force = d3.layout.force()
					.nodes(nodes)
					.size([width, height])
					.gravity(0.05)
					.charge(0.05)
					.friction(.7)
					.linkStrength(1)
					.on("tick", tick)
					.start();

var svg = d3.select("#force")
			.append("svg")
			.attr("width", "100%")
			.attr("height", "100%")
			.attr("shape-rendering","optimizeSpeed")
			.attr("color-rendering","optimizeSpeed")
			.attr("viewBox", "0 0 1280 720");

		// agrego bounding box
		svg.append("svg:rect")
			.attr("width", "100%")
			.attr("height", "100%")
			.attr("viewBox", "0 0 1280 720")
		    .style("opacity", "0");

var node = svg.selectAll("circle")
				.data(nodes)
				.enter()
				.append("circle")
				.attr("class", "node")
				.style("fill", function(d) {
					return color(d.cluster);
				});





// aplica force a los nodos y al bounding box
function tick(e) {
	node.each(cluster(3 * e.alpha * e.alpha))
		.each(collide(.08))
		.attr("cx", function(d) {
			return d.x;
		})
		.attr("cy", function(d) {
			return d.y;
		}
	);
	
	node.attr("cx", function(d) { return d.x = Math.max(maxRadius, Math.min(width - maxRadius, d.x)); })
        .attr("cy", function(d) { return d.y = Math.max(maxRadius, Math.min(height - maxRadius, d.y)); });  	
}

// mueve el nuevo nodo al cluster correspondiente
function cluster(alpha) {
	return function(d) {
		var cluster = clusters[d.cluster];
		if (cluster === d)
			return;
		var x = d.x - cluster.x, y = d.y - cluster.y, l = Math.sqrt(x * x + y * y), r = d.radius + cluster.radius;
		if (l != r) {
			l = (l - r) / l * alpha;
			d.x -= x *= l;
			d.y -= y *= l;
			cluster.x += x;
			cluster.y += y;
		}
	};
}

// resuelve colisiones entre el nuevo nodo y el escenario
function collide(alpha) {
	var quadtree = d3.geom.quadtree(nodes);
	return function(d) {
		var r = d.radius + maxRadius + Math.max(padding, clusterPadding),
			nx1 = d.x - r,
			nx2 = d.x + r,
			ny1 = d.y - r,
			ny2 = d.y + r;

		quadtree.visit(function(quad, x1, y1, x2, y2) {
			if (quad.point && (quad.point !== d)) {
				var x = d.x - quad.point.x,
					y = d.y - quad.point.y,
					l = Math.sqrt(x * x + y * y),
					r = d.radius + quad.point.radius + (d.cluster === quad.point.cluster ? padding : clusterPadding);
		
				if (l < r) {
					l = (l - r) / l * alpha;
					d.x -= x *= l;
					d.y -= y *= l;
					quad.point.x += x;
					quad.point.y += y;
				}
			}
			return x1 > nx2 || x2 < nx1 || y1 > ny2 || y2 < ny1;
		});
	};
}


// Updatea, Enter nuevos nodos, Exit viejos nodos, y restartea el force layout
function update() {
	node = svg.selectAll("circle").data(nodes);
	node.enter().append("circle").attr("class","nuevo").attr("cx", function(d) {
		return d.x;
	}).attr("cy", function(d) {
		return d.y;
	}).attr("r", function(d) {
		return d.radius;
	}).style("fill", function(d) {
		return color(d.cluster);
	});
	node.exit().remove();
	force.start();
}

//Agrega un nuevo nodo a determinado cluster del gráfico
function addNode(clust, rad) {
	nodes.push({
		cluster : clust,
		radius: rad,
		x : entrada[clust], // coordenadas desde donde entran
		y : height
	});
	update();
}

// limita y escala un numero dado un rango limitado.
function translate(sensor_val, in_from, in_to, out_from, out_to) {
    var out_range = out_to - out_from;
    var in_range = in_to - in_from;
    var in_val = sensor_val - in_from;
    val = ( in_val / in_range) * out_range; 
    var out_val = out_from+val;
    return out_val;
}


//escucha todos los mensajes que envia socket.io
socket.on('message', function(message) {

	var msgSensor = message.search("bS");
	var msg = message;
	var i = msg.indexOf(",");

	if ( msgSensor >  0 ){
		if ( msg.charAt( i + 1 ) == 1 && sensores[msg.charAt( i - 1 )] == 0){
			sensores[msg.charAt( i - 1 )] = 1;
			addNode(msg.charAt( i - 1 ), 1);
			pointers[msg.charAt( i - 1 )] = svg.select("circle:last-child");
			position[msg.charAt( i - 1 )] = nodes.length - 1;

			// sensor activado
			var nameSensor = "sensor" + msg.charAt( i - 1 );
			var spanSensor = document.getElementById(nameSensor);
			tiempoInactivo = 0;

			$("#reposo").css("display", "none");
			$("#reposo").css("opacity", "0");
			
			$(spanSensor).css("color", "rgba(255,255,255,1)");
			$(spanSensor).parent().animate({transform: "translateY (-15px)"},100,'easeInOutBack');

			pointers[msg.charAt( i - 1 )] 
				.style("stroke-width", 5)
				.style("stroke-alpha", 1)			
				.style("stroke", "white")
				.style("fill", "white")
				.style("alpha", 0)
				.transition()
				.duration(500)
				.style("fill", function(d) {
					return color(d.cluster);
				});				
		}
		
		// sensor desactivado
		if ( msg.charAt( i +  1 ) == 0 && sensores[msg.charAt( i - 1 )] == 1){

			$("#sensor" + sensores.indexOf(1)).css({color: "rgba(255,255,255,0.7)"},10);
			var resetear = $("#sensor" + sensores.indexOf(1)).parent();
			$(resetear).animate({transform: "translateY(0px)"},10,'easeInOutBack');

			sensores[msg.charAt( i - 1 )] = 0;

			pointers[msg.charAt( i - 1 )]
				.transition()
				.duration(duration)
				.style("stroke-width", 0)
				.style("fill", function(d) {
					return color(d.cluster);
				});

				try{
					radioAcumulado = radioAcumulado + Math.floor( nodes [ position[msg.charAt( i - 1 )]]["radius"] );		
					supCirculos = Math.floor(supCirculos +  (Math.PI * ( nodes [ position[msg.charAt( i - 1 )]]["radius"]  * nodes [ position[msg.charAt( i - 1 )]]["radius"] )));
  				} catch(err) {
   					//el elemento dejo de existir
  				}

			statistics ( nodes.length , radioAcumulado , width * height , supCirculos );
		}

	} else {

		if ( sensores[msg.charAt( i - 1 )] == 1){
			
			// activacion continua del sensor
			if ( msg.slice(i + 1, msg.length) < maxRadius){
			
				var radio = translate( msg.slice(i + 1.5, msg.length) , 1 , maxRadius , minRadius, maxRadius);

				pointers[msg.charAt( i - 1 )]
					.attr("r", radio );

				try{
					nodes[ position[msg.charAt( i - 1 )]]["radius"] = radio;
  				} catch(err) {
   					//el elemento dejo de existir
  				}

				// el sensor llega al máximo
				if (radio >= maxRadius - 1){ 
					pointers[msg.charAt( i - 1 )]
						.transition()
						.duration(duration)
						.style("stroke-width", 0)
						.attr("r", radio + 10 );
				}
			}
		}
	}
});


