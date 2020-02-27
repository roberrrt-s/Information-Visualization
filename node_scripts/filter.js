var fs = require('fs')
var csv = require('csv-parser')

var nodeArr = []
var linkArr = []
var linkUsed = []
var nodesUsed = []
var nodesTargetted = []
var nodeValues = []
var subreddits = [
  'programmerhumor',
  'leagueoflegends',
  'wow',
  'MovieDetails',
  'smashbros'
]

fs.readFile('../src/resources/datalinks.json', function read (err, data) {
  if (err) {
    throw err
  }
  var data = JSON.parse(data)
  for (var i = 0; i < subreddits.length; i++) {
    var node = {
      id: subreddits[i],
      name: subreddits[i]
    }
    nodeArr.push(node)
    nodesUsed.push(subreddits[i])

  }

  for (var i = 0; i < data.links.length; i++) {
    for (var y = 0; y < subreddits.length; y++) {
      if (subreddits.includes(data.links[i].source)) {
        var node = {
          id: data.links[i].target,
          name: data.links[i].target
        }
        if (!nodesUsed.includes(data.links[i].target)) {
          nodeArr.push(node)
          nodesUsed.push(data.links[i].target)
        }
        var link = {
          source: data.links[i].source,
          target: data.links[i].target
        }
        if(!linkUsed.includes(data.links[i].target)){
          linkArr.push(link)
        }
        linkUsed.push(data.links[i].target);
      } else if (subreddits.includes(data.links[i].target)) {
        var node = {
          id: data.links[i].source,
          name: data.links[i].source
        }
        if (!nodesUsed.includes(data.links[i].source)) {
          nodeArr.push(node)
          nodesUsed.push(data.links[i].source)
        }
        var link = {
          source: data.links[i].source,
          target: data.links[i].target
        }
        if(!linkUsed.includes(data.links[i].source)){
          linkArr.push(link)
        }
        linkUsed.push(data.links[i].source);
      }
    }
  }

  console.log(nodesUsed)

  var output = {
    nodes: nodeArr,
    links: linkArr
  }
  fs.writeFileSync('datalinks-v4.json', JSON.stringify(output))
})
