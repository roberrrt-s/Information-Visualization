import graph from '../resources/data.json'

const APP = {
	NAME: 'InfoViz 2020 University of Amsterdam concept',
	VERSION: '1.0.0',
	AUTHOR: 'Robert Spier, Joshua Onwezen, Cas Obdam, Daan Visser',
	CREATION_DATE: new Date().getFullYear()
};

class App {

	constructor() {
		document.querySelector('svg').setAttribute('height', window.innerHeight);
		document.querySelector('svg').setAttribute('width', window.innerWidth);


		var svg = d3.select("svg"),
			width = +svg.attr("width"),
			height = +svg.attr("height"),
			radius = 6;

		var color = d3.scaleOrdinal(d3.schemeCategory20);

		var tooltip = d3.select("body")
			.append("div")
			.attr("class", "tooltip")
			.style("position", "absolute")
			.style("z-index", "10")
			// .style("visibility", "hidden")
			.style("visibility", "hidden");

		//https://github.com/d3/d3-force USE force/distanceMax etc
		var simulation = d3.forceSimulation()
			.force("link", d3.forceLink().id(function(d) { return d.id; }))
			.force("charge", d3.forceManyBody().strength(-200))
			.force("center", d3.forceCenter(width / 2, height / 2));


		var link = svg.append("g")
			.attr("class", "links")
			.selectAll("line")
			.data(graph.links)
			.enter().append("line")
			.attr("stroke-width", function(d) { return Math.sqrt(d.value); });

		var node = svg.append("g")
			.attr("class", "nodes")
			.selectAll("g")
			.data(graph.nodes)
			.enter().append("g")
			.call(d3.drag()
				.on("start", dragstarted)
				.on("drag", dragged)
				.on("end", dragended))
			
		var circles = node.append("rect")
			//Change shape for followed instead of standard 30 weight
			.attr("rx", function(d) { return d.followed ?  0 : 100})
			.attr("ry", function(d) { return d.followed ?  0 : 100})
			.attr("x",function(d) { return -(d.followed ?  26 : d.weight * 2) / 2})
   			.attr("y",function(d) { return -(d.followed ?  26 : d.weight * 2) / 2})
			.attr("width", function(d) { return d.followed ?  26 : d.weight * 2 })
			.attr("height", function(d) { return d.followed ?  26 : d.weight * 2 })
			.attr("stroke","white")

			.attr("fill", function(d) { return color(d.group); })
				.on("mouseover", function(d){
					node
						.style("cursor", "pointer")

					var weight = d.followed ? '' : "<br/>"  + 'Linked: ' + d.weight;

					tooltip
						.style("opacity", 0)
						.style("visibility", "visible")
						.html('Subreddit: ' + '/r/' + d.id + "<br/>"  + 'Category: ' + d.group + weight)
						.transition()
						.duration(130)
						.style("opacity", 1)
					})
				.on("mousemove", function(){return tooltip.style("top", (event.pageY-10)+"px").style("left",(event.pageX+10)+"px");})
				.on("mouseout", function(){
					tooltip
						.transition()
						.duration(130)
						.style("opacity", 0)
						.style("cursor", "pointer")
						;});


		var lables = node.append("text")
			.text(function(d) {
				return d.id;
			})
			.attr('x', 6)
			.attr('y', 3);

		node.append("title")
			.text(function(d) { return d.id; });

		simulation
			.nodes(graph.nodes)
			.on("tick", ticked);

		simulation.force("link")
			.links(graph.links);

		function ticked() {
			link
				.attr("x1", function(d) { return d.source.x; })
				.attr("y1", function(d) { return d.source.y; })
				.attr("x2", function(d) { return d.target.x; })
				.attr("y2", function(d) { return d.target.y; });

			node
				.attr("transform", function(d) {
				return "translate(" + d.x + "," + d.y + ")";
				})
				.attr("cx", function(d) { return d.x = Math.max(radius, Math.min(width - radius, d.x)); })
				.attr("cy", function(d) { return d.y = Math.max(radius, Math.min(height - radius, d.y)); });
		}
		

		function dragstarted(d) {
		if (!d3.event.active) simulation.alphaTarget(0.3).restart();
		d.fx = d.x;
		d.fy = d.y;
		}

		function dragged(d) {
		d.fx = d3.event.x;
		d.fy = d3.event.y;
		}

		function dragended(d) {
		if (!d3.event.active) simulation.alphaTarget(0);
		d.fx = null;
		d.fy = null;
		}
}
}
const app = new App();
