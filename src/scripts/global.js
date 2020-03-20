// import graph from '../resources/data_compared.json'

import subreddit_topics from '../resources/subreddit_topics.json'
import datalinks from '../resources/datalinks.json'

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

		this.subreddits = [

		]

		this.initSearch();

		this.graph = {}
	}

	initData() {

		var nodeArr = []
		var nodesUsed = []
		var linkArr = []
		var linkUsed = []
		var linksTargetted = []
		var combinedLinksTargetted = []

		for (var i = 0; i < 5; i++) {
			var node = {
				id: this.subreddits[0][i],
				name: this.subreddits[0][i],
				group: 'user1'
			}
			nodeArr.push(node)
			nodesUsed.push(this.subreddits[0][i])
		}

		if (this.subreddits.length > 1) {
			for (var i = 0; i < 5; i++) {
				var node = {
					id: this.subreddits[1][i],
					name: this.subreddits[1][i],
					group: 'user2'
				}
				if (!nodesUsed.includes(this.subreddits[1][i])) {
					nodeArr.push(node)
					nodesUsed.push(this.subreddits[1][i])
				} else {
					this.subreddits[1].splice(i, 1);
				}
			}
		}

		compareSubreddits(datalinks, this.subreddits[0], 0)
		if (this.subreddits.length > 1) {
			compareSubreddits(datalinks, this.subreddits[1], 1)
		}

		for (var i = 0; i < linkArr.length; i++) {
			if (this.subreddits.length > 1) {
				if (
					!this.subreddits[0].includes(linkArr[i].target) &&
					!this.subreddits[1].includes(linkArr[i].target) &&
					linksTargetted[linkArr[i].target] != undefined &&
					linksTargetted[linkArr[i].target][0] != undefined &&
					linksTargetted[linkArr[i].target][0].length > 0 &&
					linksTargetted[linkArr[i].target][1] != undefined &&
					linksTargetted[linkArr[i].target][1].length > 0
				) {
					if (linkArr[i].target == 'suomi') {

						console.log(linksTargetted[linkArr[i].target][1], linksTargetted[linkArr[i].target][0])
					}
					linkUsed.push({
						source: linkArr[i].source,
						target: linkArr[i].target
					})
				} else if (
					!this.subreddits[0].includes(linkArr[i].source) &&
					!this.subreddits[1].includes(linkArr[i].source) &&
					linksTargetted[linkArr[i].source] != undefined &&
					linksTargetted[linkArr[i].source][0] != undefined &&
					linksTargetted[linkArr[i].source][0].length > 0 &&
					linksTargetted[linkArr[i].source][1] != undefined &&
					linksTargetted[linkArr[i].source][1].length > 0
				) {
					if (linkArr[i].source == 'suomi') {
						console.log(linksTargetted[linkArr[i].source][1], linksTargetted[linkArr[i].source][0])
					}

					linkUsed.push({
						source: linkArr[i].source,
						target: linkArr[i].target
					})
				}
			} else {
				if (
					!this.subreddits.includes(linkArr[i].target) &&
					linksTargetted[linkArr[i].target] != undefined &&
					linksTargetted[linkArr[i].target].length > 0 &&
					linksTargetted[linkArr[i].target][0].length > 2
				) {
					linkUsed.push({
						source: linkArr[i].source,
						target: linkArr[i].target
					})
				} else if (
					!this.subreddits.includes(linkArr[i].source) &&
					linksTargetted[linkArr[i].source] != undefined &&
					linksTargetted[linkArr[i].source].length > 0 &&
					linksTargetted[linkArr[i].source][0].length > 2
				) {
					linkUsed.push({
						source: linkArr[i].source,
						target: linkArr[i].target
					})
				}

			}
		}

		var nodes = []
		nodesUsed = []
		for (var i = 0; i < linkUsed.length; i++) {
			if (!nodesUsed.includes(linkUsed[i].target)) {
				if (combinedLinksTargetted[linkUsed[i].target]) {
					var weight = combinedLinksTargetted[linkUsed[i].target].length
					var links = combinedLinksTargetted[linkUsed[i].target]
				} else {
					var weight = 0
					var links = []
				}
				var node = {
					id: linkUsed[i].target,
					name: linkUsed[i].target,
					group: 'Other',
					weight: weight,
					links: links
				}
				for (var y = 0; y < subreddit_topics.length; y++) {
					if (
						linkUsed[i].target.toLowerCase() ==
						subreddit_topics[y].SUBREDDIT.toString().toLowerCase()
					) {
						node.group = subreddit_topics[y].CATEGORY
					}
				}
				node.followed = this.subreddits[0].includes(linkUsed[i].target)
					? 1
					: this.subreddits.length > 1 && this.subreddits[1].includes(linkUsed[i].target)
						? 2
						: 0

				nodes.push(node)
				nodesUsed.push(linkUsed[i].target)
			}
			if (!nodesUsed.includes(linkUsed[i].source)) {
				if (combinedLinksTargetted[linkUsed[i].source]) {
					var weight = combinedLinksTargetted[linkUsed[i].source].length
					var links = combinedLinksTargetted[linkUsed[i].source]
				} else {
					var weight = 0
					var links = []
				}
				var node = {
					id: linkUsed[i].source,
					name: linkUsed[i].source,
					group: 'Other',
					weight: weight,
					links: links
				}
				for (var y = 0; y < subreddit_topics.length; y++) {
					if (
						linkUsed[i].source.toLowerCase() ==
						subreddit_topics[y].SUBREDDIT.toString().toLowerCase()
					) {
						node.group = subreddit_topics[y].CATEGORY
					}
				}
				node.followed = this.subreddits[0].includes(linkUsed[i].source)
					? 1
					: this.subreddits.length > 1 && this.subreddits[1].includes(linkUsed[i].source)
						? 2
						: 0

				nodes.push(node)
				nodesUsed.push(linkUsed[i].source)
			}
		}


		return {
			nodes: nodes,
			links: linkUsed
		}

		function compareSubreddits(data, sr, index) {
			for (var i = 0; i < data.links.length; i++) {
				for (var y = 0; y < sr.length; y++) {
					if (sr[y] == data.links[i].source) {
						//SUBREDDIT USED AS SOURCE
						if (!nodesUsed.includes(data.links[i].target)) {
							//NOT INCLUDED YET? -> ADD TO NODEUSED
							var node = {
								id: data.links[i].target,
								name: data.links[i].target,
								group: 'Other'
							}

							for (var y = 0; y < subreddit_topics.length; y++) {
								if (
									data.links[i].target.toLowerCase() ==
									subreddit_topics[y].SUBREDDIT.toString().toLowerCase()
								) {
									node.group = subreddit_topics[y].CATEGORY
								}
							}
							nodesUsed.push(data.links[i].target)
							nodeArr.push(node)
						}

						var link = {
							source: data.links[i].source,
							target: data.links[i].target
						}

						linkArr.push(link)

						if (
							linksTargetted[data.links[i].target] &&
							linksTargetted[data.links[i].target][index] &&
							Array.isArray(linksTargetted[data.links[i].target][index])
						) {
							if (!linksTargetted[data.links[i].target][index].includes(sr[y])) {
								linksTargetted[data.links[i].target][index].push(sr[y])
							}
						} else if (sr[y] != undefined) {
							linksTargetted[data.links[i].target] = [[], []]
							linksTargetted[data.links[i].target][index] = [sr[y]]
						}

						if (
							combinedLinksTargetted[data.links[i].target] &&
							Array.isArray(combinedLinksTargetted[data.links[i].target])
						) {
							if (!combinedLinksTargetted[data.links[i].target].includes(sr[y])) {
								combinedLinksTargetted[data.links[i].target].push(sr[y])
							}
						} else if (sr[y] != undefined) {
							combinedLinksTargetted[data.links[i].target] = [sr[y]]
						}
					} else if (sr[y] == data.links[i].target) {
						//SUBREDDIT USED AS TARGET
						if (!nodesUsed.includes(data.links[i].source)) {
							//NOT INCLUDED YET? -> ADD TO NODEUSED
							var node = {
								id: data.links[i].source,
								name: data.links[i].source,
								group: 'Other'
							}
							for (var y = 0; y < subreddit_topics.length; y++) {
								if (
									data.links[i].source.toLowerCase() ==
									subreddit_topics[y].SUBREDDIT.toString().toLowerCase()
								) {
									node.group = subreddit_topics[y].CATEGORY
								}
							}
							nodesUsed.push(data.links[i].source)
							nodeArr.push(node)
						}

						var link = {
							source: data.links[i].source,
							target: data.links[i].target
						}

						linkArr.push(link)

						if (
							linksTargetted[data.links[i].source] &&
							linksTargetted[data.links[i].source][index] &&
							Array.isArray(linksTargetted[data.links[i].source][index])
						) {
							if (!linksTargetted[data.links[i].source][index].includes(sr[y])) {
								linksTargetted[data.links[i].source][index].push(sr[y])
							}
						} else if (sr[y] != undefined) {
							linksTargetted[data.links[i].source] = [[], []]
							linksTargetted[data.links[i].source][index] = [sr[y]]
						}

						if (
							combinedLinksTargetted[data.links[i].source] &&
							Array.isArray(combinedLinksTargetted[data.links[i].source])
						) {
							if (!combinedLinksTargetted[data.links[i].source].includes(sr[y])) {
								combinedLinksTargetted[data.links[i].source].push(sr[y])
							}
						} else if (sr[y] != undefined) {
							combinedLinksTargetted[data.links[i].source] = [sr[y]]
						}
					}
				}
			}
		}


	}

	initSearch() {
		const button = document.querySelectorAll('#submit');
		let query;

		let inputs = document.querySelectorAll('input[type=text]')

		for(var i = 0; i < inputs.length; i++) {
			inputs[i].addEventListener('keydown', e => {
				if(e.which === 13) {
					e.target.parentNode.querySelector('button').click();
				}
			})
		}

		for (var i = 0; i < button.length; i++) {
			button[i].addEventListener('click', e => {
				var search = e.target.parentNode.querySelector('input');
				console.log(search.value);
				document.body.classList.remove('single')
				var user = e.target.getAttribute('data-user');

				if (search.value.length > 0 && search.value.length < 21) {
					query = search.value;
					this.r.getUser(query)
						.getOverview().fetchMore({ amount: 50 })
						.then(data => {
							console.log('found userdata')
							search.classList.add('has-result')
							search.classList.remove('has-error');

							let subreddits = [];
							let selection = [];

							for (var i = 0; i < data.length; i++) {
								subreddits.push(data[i].subreddit_name_prefixed.substr(2));
							}


							let unique = subreddits.filter((v, i, a) => {
								if (a.indexOf(v) !== i) {
									selection.push(v)
								}
							})

							if (!selection.length) {
								selection = unique;
							}

							selection = selection.filter((v, i, a) => a.indexOf(v) === i);
							selection = selection.slice(0, 15);


							this.subreddits[user] = selection;

							console.log(this.subreddits)

							this.graph = this.initData();

							this.initGraph();
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
	}

	initGraph() {
		d3.selectAll("svg > *").remove();
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
			.force("link", d3.forceLink().id(function (d) { return d.id; }))
			.force("charge", d3.forceManyBody().strength(-250))
			.force("center", d3.forceCenter(width / 2, height / 2))
			.force("x", d3.forceX(function (d) {
				if (d.followed === 1) {
					return width / 10
				} else if (d.followed === 2) {
					return width - (width / 10)
				} else {
					return 2 * (width / 3)
				}
			})
				.strength(2))
			.force("y", d3.forceY(function (d) {
				if (d.weight > 0 && d.followed == 0) {
					return height / d.weight
				} else {
					return height / ((Math.random() * 10) / 2 + 2)
				}
			})
				.strength(1))
			.force('collision', d3.forceCollide().radius(function (d) {
				return d.weight * 2 + 10
			}));


		var link = svg.append("g")
			.attr("class", "links")
			.selectAll("line")
			.data(this.graph.links)
			.enter().append("line")
			.attr("stroke-width", function (d) { return Math.sqrt(d.value); });

		var node = svg.append("g")
			.attr("class", "nodes")
			.selectAll("g")
			.data(this.graph.nodes)
			.enter().append("g")
			.attr("class", function (d) {
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

		// this.subreddits not followed by any user
		var unfollowed_subs = d3.selectAll(".not_followed").append("circle")
			.attr("r", function (d) { return d.weight * 2 })
			.attr("fill", function (d) { return color(d.group); })
			.on('mouseover.fade', fade(0.1))
			.on("mouseover", function (d) {

				node
					.style("cursor", "pointer")

				//var weight = d.followed != 0 ? '' : "<br/>"  + 'Linked: ' + d.weight;
				//var links = d.followed != 0 ? '' : "<br/>"  + 'Links: ' + d.links;
				var weight = '';
				var links = '';

				tooltip
					.style("opacity", 0)
					.style("visibility", "visible")
					.html('Subreddit: ' + '/r/' + d.id + "<br/>" + 'Category: ' + d.group + weight + links)
					.transition()
					.duration(130)
					.style("opacity", 1)
			})
			.on("mousemove", function () { return tooltip.style("top", (event.pageY - 70) + "px").style("left", (event.pageX + 10) + "px"); })
			.on('mouseout.fade', fade(1))
			.on("mouseout", function () {
				tooltip
					.transition()
					.duration(130)
					.style("opacity", 0)
					.style("cursor", "pointer")
					;
			});


		var user1_subs = d3.selectAll(".user1").append("rect")
			.attr("x", function (d) { return -(d.followed ? 26 : d.weight * 2) / 2 })
			.attr("y", function (d) { return -(d.followed ? 26 : d.weight * 2) / 2 })
			.attr("width", 30)
			.attr("height", 30)
			.attr("stroke", "white")
			.attr("stroke-width", 2.5)

			.attr("fill", function (d) { return color(d.group); })
			.on('mouseover.fade', fade(0.1))
			.on("mouseover", function (d) {
				node
					.style("cursor", "pointer")

				//var weight = d.followed != 0 ? '' : "<br/>"  + 'Linked: ' + d.weight;
				//var links = d.followed != 0 ? '' : "<br/>"  + 'Links: ' + d.links;
				var weight = '';
				var links = '';

				tooltip
					.style("opacity", 0)
					.style("visibility", "visible")
					.html('Subreddit: ' + '/r/' + d.id + "<br/>" + 'Category: ' + d.group + weight + links)
					.transition()
					.duration(130)
					.style("opacity", 1)
			})
			.on("mousemove", function () { return tooltip.style("top", (event.pageY - 70) + "px").style("left", (event.pageX + 10) + "px"); })
			.on('mouseout.fade', fade(1))
			.on("mouseout", function () {
				tooltip
					.transition()
					.duration(130)
					.style("opacity", 0)
					.style("cursor", "pointer")
					;
			});

		var user2_subs = d3.selectAll(".user2").append("rect")
			.attr("x", function (d) { return -(d.followed ? 26 : d.weight * 2) / 2 })
			.attr("y", function (d) { return -(d.followed ? 26 : d.weight * 2) / 2 })
			.attr("width", 30)
			.attr("height", 30)
			.attr("stroke", "white")
			.attr("stroke-width", 2.5)

			.attr("fill", function (d) { return color(d.group); })
			.on('mouseover.fade', fade(0.1))
			.on("mouseover", function (d) {
				node
					.style("cursor", "pointer")

				//var weight = d.followed != 0 ? '' : "<br/>"  + 'Linked: ' + d.weight;
				//var links = d.followed != 0 ? '' : "<br/>"  + 'Links: ' + d.links;
				var weight = '';
				var links = '';

				tooltip
					.style("opacity", 0)
					.style("visibility", "visible")
					.html('Subreddit: ' + '/r/' + d.id + "<br/>" + 'Category: ' + d.group + weight + links)
					.transition()
					.duration(130)
					.style("opacity", 1)
			})
			.on("mousemove", function () { return tooltip.style("top", (event.pageY - 70) + "px").style("left", (event.pageX + 10) + "px"); })
			.on('mouseout.fade', fade(1))
			.on("mouseout", function () {
				tooltip
					.transition()
					.duration(130)
					.style("opacity", 0)
					.style("cursor", "pointer")
					;
			});


		var lables = node.append("text")
			.text(function (d) {
				return d.id;
			})
			.attr('x', function (d) {
				return (d.weight * 2)
			})
			.attr('y', function (d) {
				return -(d.weight * 2) + 5
			})
			.style('background-color', 'white');

		node.append("title")
			.text(function (d) { return d.id; });

		simulation
			.nodes(this.graph.nodes)
			.on("tick", ticked);

		simulation.force("link")
			.links(this.graph.links);

		function ticked() {
			link
				.attr("x1", function (d) { return d.source.x; })
				.attr("y1", function (d) { return d.source.y; })
				.attr("x2", function (d) { return d.target.x; })
				.attr("y2", function (d) { return d.target.y; });

			node
				.attr("transform", function (d) {
					return "translate(" + d.x + "," + d.y + ")";
				})
				.attr("cx", function (d) { return d.x = Math.max(radius, Math.min(width - radius, d.x)); })
				.attr("cy", function (d) { return d.y = Math.max(radius, Math.min(height - radius, d.y)); });
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
		this.graph.links.forEach(d => {
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
