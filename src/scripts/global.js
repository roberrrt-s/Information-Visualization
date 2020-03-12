import graph from '../resources/data_compared.json'

var snoowrap = require('snoowrap');

const APP = {
	NAME: 'InfoViz 2020 University of Amsterdam concept',
	VERSION: '1.0.0',
	AUTHOR: 'Robert Spier, Joshua Onwezen, Cas Obdam, Daan Visser',
	CREATION_DATE: new Date().getFullYear()
};

class App {

	constructor() {
		this.r = new snoowrap({
			userAgent: 'testscript by /u/InfoVis40',
			clientId: 'kh7fIqiKp5aLpg',
			clientSecret: 'eK59n4IC4WcVAYvGAAooxlOlmhQ',
			refreshToken: '25748477-HQ4y6e-wyg_6sIls2v0zCVMAb88'
		});

		this.initGraph();
		this.initSearch();
	}

	initSearch() {
		const search = document.querySelector('#searchfield');
		const button = document.querySelector('#submit');

		let query;

		button.addEventListener('click', e => {
			console.log(search.value);

			if(search.value.length > 0 && search.value.length < 21) {
				query = search.value;
				let user = this.r.getUser(query);
				this.r.getUser(query)
					.getUpvotedContent().fetchMore({amount: 25})
						.then(data => {
							console.log('found userdata')
							search.classList.add('has-result')
							search.classList.remove('has-error');

							let subreddits = [];
							let selection = [];

							for(var i = 0; i < data.length; i++) {
								subreddits.push(data[i].subreddit_name_prefixed.substr(2));
							}


							let unique = subreddits.filter((v, i, a) => {
								if(a.indexOf(v) !== i) {
									selection.push(v)
								}
							})

							if(!selection.length) {
								selection = unique;
							}

							selection = selection.filter((v, i, a) => a.indexOf(v) === i);
							selection = selection.slice(0, 5);

							console.log(selection)

						})
						.catch(weird => {
							console.log('User doest not exist or is not public')
							search.classList.add('has-error')
							search.classList.remove('has-result');
							console.log(weird)
						})
						.error(error => {
							console.log('if we reach this we are doomed')
						})
			}
		})


	}

	initGraph() {

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
			.style("visibility", "hidden");

		//https://github.com/d3/d3-force USE force/distanceMax etc
		var simulation = d3.forceSimulation()
			.force("link", d3.forceLink().id(function(d) { return d.id; }))
			.force("charge", d3.forceManyBody().strength(-250))
			.force("center", d3.forceCenter(width / 2, height / 2))
			.force("x", d3.forceX(function(d){
				if(d.followed === 1){
					return width/10
				} else if (d.followed === 2){
					return width - (width/10)
				} else {
					return 2*(width/3)
				}
			})
			.strength(2))
			.force("y", d3.forceY(function(d){
				if(d.weight > 0 && d.followed == 0){
					return height/d.weight
				}else{
					return height / ((Math.random()*10) / 2 + 2)
				}
			})
			.strength(1))
			.force('collision', d3.forceCollide().radius(function(d) {
				return d.weight * 2 + 10
			  }));


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
			.attr("class", function(d) {
				if (d.followed == 0) {
					return "not_followed"
				} else if (d.followed == 1) {
					return "user1"
				} else {
					return "user2"
				}
			 })
			.call(d3.drag()
				.on("start", dragstarted)
				.on("drag", dragged)
				.on("end", dragended))

		// subreddits not followed by any user
		var unfollowed_subs = d3.selectAll(".not_followed").append("circle")
			.attr("r", function(d) { return d.weight * 2})
			.attr("fill", function(d) { return color(d.group); })
				.on('mouseover.fade', fade(0.1))
				.on("mouseover", function(d){

					node
						.style("cursor", "pointer")

					var weight = d.followed != 0 ? '' : "<br/>"  + 'Linked: ' + d.weight;
					var links = d.followed != 0 ? '' : "<br/>"  + 'Links: ' + d.links;

					tooltip
						.style("opacity", 0)
						.style("visibility", "visible")
						.html('Subreddit: ' + '/r/' + d.id + "<br/>"  + 'Category: ' + d.group + weight + links)
						.transition()
						.duration(130)
						.style("opacity", 1)
					})
				.on("mousemove", function(){return tooltip.style("top", (event.pageY-10)+"px").style("left",(event.pageX+10)+"px");})
				.on('mouseout.fade', fade(1))
				.on("mouseout", function(){
					tooltip
						.transition()
						.duration(130)
						.style("opacity", 0)
						.style("cursor", "pointer")
						;});


		var user1_subs = d3.selectAll(".user1").append("rect")
			.attr("x",function(d) { return -(d.followed ?  26 : d.weight * 2) / 2})
			.attr("y",function(d) { return -(d.followed ?  26 : d.weight * 2) / 2})
			.attr("width", 30)
			.attr("height", 30)
			.attr("stroke","white")
			.attr("stroke-width", 2.5)

			.attr("fill", function(d) { return color(d.group); })
				.on('mouseover.fade', fade(0.1))
				.on("mouseover", function(d){
					node
						.style("cursor", "pointer")

					var weight = d.followed != 0 ? '' : "<br/>"  + 'Linked: ' + d.weight;
					var links = d.followed != 0 ? '' : "<br/>"  + 'Links: ' + d.links;

					tooltip
						.style("opacity", 0)
						.style("visibility", "visible")
						.html('Subreddit: ' + '/r/' + d.id + "<br/>"  + 'Category: ' + d.group + weight + links)
						.transition()
						.duration(130)
						.style("opacity", 1)
					})
				.on("mousemove", function(){return tooltip.style("top", (event.pageY-10)+"px").style("left",(event.pageX+10)+"px");})
				.on('mouseout.fade', fade(1))
				.on("mouseout", function(){
					tooltip
						.transition()
						.duration(130)
						.style("opacity", 0)
						.style("cursor", "pointer")
						;});

		var user2_subs = d3.selectAll(".user2").append("rect")
			.attr("x",function(d) { return -(d.followed ?  26 : d.weight * 2) / 2})
			.attr("y",function(d) { return -(d.followed ?  26 : d.weight * 2) / 2})
			.attr("width", 30)
			.attr("height", 30)
			.attr("stroke","white")
			.attr("stroke-width", 2.5)

			.attr("fill", function(d) { return color(d.group); })
				.on('mouseover.fade', fade(0.1))
				.on("mouseover", function(d){
					node
						.style("cursor", "pointer")

					var weight = d.followed != 0 ? '' : "<br/>"  + 'Linked: ' + d.weight;
					var links = d.followed != 0 ? '' : "<br/>"  + 'Links: ' + d.links;

					tooltip
						.style("opacity", 0)
						.style("visibility", "visible")
						.html('Subreddit: ' + '/r/' + d.id + "<br/>"  + 'Category: ' + d.group + weight + links)
						.transition()
						.duration(130)
						.style("opacity", 1)
					})
				.on("mousemove", function(){return tooltip.style("top", (event.pageY-10)+"px").style("left",(event.pageX+10)+"px");})
				.on('mouseout.fade', fade(1))
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
			.attr('x', function(d){
				return (d.weight * 2)
			})
			.attr('y', function(d){
				return -(d.weight * 2) + 5
			})
			.style('background-color', 'white');

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

		const linkedByIndex = {};
		graph.links.forEach(d => {
			linkedByIndex[`${d.source.index},${d.target.index}`] = 1;
		});

		function isConnected(a, b) {
			return linkedByIndex[`${a.index},${b.index}`] || linkedByIndex[`${b.index},${a.index}`] || a.index === b.index;
		}

		function fade(opacity) {
			return d => {
				node.style('stroke-opacity', function (o) {
					const thisOpacity = isConnected(d, o) ? 1 : opacity;
					this.setAttribute('fill-opacity', thisOpacity);
					return thisOpacity;
				});
				link.style('stroke-opacity', o => (o.source === d || o.target === d ? 1 : opacity));
			};
		}

	}
}
const app = new App();
