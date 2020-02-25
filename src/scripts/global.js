import graph from '../resources/datalinks-v2.json'

const APP = {
	NAME: 'InfoViz 2020 University of Amsterdam concept',
	VERSION: '1.0.0',
	AUTHOR: 'Robert Spier, Joshua Onwezen, Cas Obdam, Daan Visser',
	CREATION_DATE: new Date().getFullYear()
};

class App {

	constructor() {
		// console.log(json);
		// createForceLayout(json.nodes, json.links)
		// function createForceLayout(nodes, edges) {
		// 	var roleScale = d3.scaleOrdinal()
		// 		.domain(["contractor", "employee", "manager"])
		// 		.range(["#75739F", "#41A368", "#FE9922"])

		// 	var nodeHash = nodes.reduce((hash, node) => {
		// 	hash[node.id] = node;
		// 		return hash;
		// 	}, {})

		// 	edges.forEach(edge => {
		// 		edge.weight = parseInt(edge.weight)
		// 		edge.source = nodeHash[edge.source]
		// 		edge.target = nodeHash[edge.target]
		// 	})

		// 	var linkForce = d3.forceLink()

		// 	var simulation = d3.forceSimulation()
		// 		.force("charge", d3.forceManyBody().strength(-40))
		// 		.force("center", d3.forceCenter().x(300).y(300))
		// 		.force("link", linkForce)
		// 		.nodes(nodes)
		// 		.on("tick", forceTick)

		// 	simulation.force("link").links(edges)

		// 	d3.select("svg").selectAll("line.link")
		// 		.data(edges, d => `${d.source.id}-${d.target.id}`)
		// 		.enter()
		// 		.append("line")
		// 		.attr("class", "link")
		// 		.style("opacity", .5)
		// 		.style("stroke-width", d => d.weight);

		// 	var nodeEnter = d3.select("svg").selectAll("g.node")
		// 		.data(nodes, d => d.id)
		// 		.enter()
		// 		.append("g")
		// 		.attr("class", "node");
		// 	nodeEnter.append("circle")
		// 		.attr("r", 5)
		// 		.style("fill", d => roleScale(d.role))
		// 	nodeEnter.append("text")
		// 		.style("text-anchor", "middle")
		// 		.attr("y", 15)
		// 		.text(d => d.id);

		// 	function forceTick() {
		// 		d3.selectAll("line.link")
		// 			.attr("x1", d => d.source.x)
		// 			.attr("x2", d => d.target.x)
		// 			.attr("y1", d => d.source.y)
		// 			.attr("y2", d => d.target.y)
		// 		d3.selectAll("g.node")
		// 			.attr("transform", d => `translate(${d.x},${d.y})`)
		// 	}
		// }


		var svg = d3.select("svg"),
			width = +svg.attr("width"),
			height = +svg.attr("height");

		var color = d3.scaleOrdinal(d3.schemeCategory20);

		var simulation = d3.forceSimulation()
			.force("link", d3.forceLink().id(function(d) { return d.id; }))
			.force("charge", d3.forceManyBody())
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
			
		var circles = node.append("circle")
			.attr("r", 5)
			.attr("fill", function(d) { return color(d.group); })
			.call(d3.drag()
				.on("start", dragstarted)
				.on("drag", dragged)
				.on("end", dragended));

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
