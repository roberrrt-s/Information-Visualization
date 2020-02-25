import json from '../resources/datalinks.json'

const APP = {
	NAME: 'InfoViz 2020 University of Amsterdam concept',
	VERSION: '1.0.0',
	AUTHOR: 'Robert Spier, Joshua Onwezen, Cas Obdam, Daan Visser',
	CREATION_DATE: new Date().getFullYear()
};

class App {

	constructor() {
		createForceLayout(json.nodes, json.links)
		function createForceLayout(nodes, edges) {
			var roleScale = d3.scaleOrdinal()
				.domain(["contractor", "employee", "manager"])
				.range(["#75739F", "#41A368", "#FE9922"])

			var nodeHash = nodes.reduce((hash, node) => {
			hash[node.id] = node;
				return hash;
			}, {})

			edges.forEach(edge => {
				edge.weight = parseInt(edge.weight)
				edge.source = nodeHash[edge.source]
				edge.target = nodeHash[edge.target]
			})

			var linkForce = d3.forceLink()

			var simulation = d3.forceSimulation()
				.force("charge", d3.forceManyBody().strength(-40))
				.force("center", d3.forceCenter().x(300).y(300))
				.force("link", linkForce)
				.nodes(nodes)
				.on("tick", forceTick)

			simulation.force("link").links(edges)

			d3.select("svg").selectAll("line.link")
				.data(edges, d => `${d.source.id}-${d.target.id}`)
				.enter()
				.append("line")
				.attr("class", "link")
				.style("opacity", .5)
				.style("stroke-width", d => d.weight);

			var nodeEnter = d3.select("svg").selectAll("g.node")
				.data(nodes, d => d.id)
				.enter()
				.append("g")
				.attr("class", "node");
			nodeEnter.append("circle")
				.attr("r", 5)
				.style("fill", d => roleScale(d.role))
			nodeEnter.append("text")
				.style("text-anchor", "middle")
				.attr("y", 15)
				.text(d => d.id);

			function forceTick() {
				d3.selectAll("line.link")
					.attr("x1", d => d.source.x)
					.attr("x2", d => d.target.x)
					.attr("y1", d => d.source.y)
					.attr("y2", d => d.target.y)
				d3.selectAll("g.node")
					.attr("transform", d => `translate(${d.x},${d.y})`)
			}
		}



	};
}
const app = new App();
