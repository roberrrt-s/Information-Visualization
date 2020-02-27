var fs = require('fs')
var csv = require('csv-parser')

var nodeArr = []
var nodesUsed = []
var linkArr = []
var linkUsed = []
var linksTargetted = []
var subreddits = [
  'programmerhumor',
  'leagueoflegends',
  'videos',
  'askreddit',
  'smashbros',
  'askscience',
  'nintendo',
  'explainlikeimfive',
  'wow'
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
      if (subreddits[y] == data.links[i].source) {
        //SUBREDDIT USED AS SOURCE
        if (!nodesUsed.includes(data.links[i].target)) {
          //NOT INCLUDED YET? -> ADD TO NODEUSED
          var node = {
            id: data.links[i].target,
            name: data.links[i].target
          }
          nodesUsed.push(data.links[i].target)
          nodeArr.push(node)
        }

        var link = {
          source: data.links[i].source,
          target: data.links[i].target
        }

        linkArr.push(link)

        if (linksTargetted[data.links[i].target] && Array.isArray(linksTargetted[data.links[i].target])) {
          if(!linksTargetted[data.links[i].target].includes(subreddits[y])){
            linksTargetted[data.links[i].target].push(subreddits[y])
          }
        } else {
          linksTargetted[data.links[i].target] = [subreddits[y]]
        }
      } else if (subreddits[y] == data.links[i].target) {
        //SUBREDDIT USED AS TARGET
        if (!nodesUsed.includes(data.links[i].source)) {
          //NOT INCLUDED YET? -> ADD TO NODEUSED
          var node = {
            id: data.links[i].source,
            name: data.links[i].source
          }
          nodesUsed.push(data.links[i].source)
          nodeArr.push(node)
        }

        var link = {
          source: data.links[i].source,
          target: data.links[i].target
        }

        linkArr.push(link)

        if (linksTargetted[data.links[i].source] && Array.isArray(linksTargetted[data.links[i].source])) {
          if(!linksTargetted[data.links[i].source].includes(subreddits[y])){
            linksTargetted[data.links[i].source].push(subreddits[y])
          }
        } else {
          linksTargetted[data.links[i].source] = [subreddits[y]]
        }
      }
    }
  }

  console.log(linksTargetted);
  for (var i = 0; i < linkArr.length; i++) {

    if (
      !subreddits.includes(linkArr[i].target) &&
      linksTargetted[linkArr[i].target] != undefined &&
      linksTargetted[linkArr[i].target].length > 1
    ) {
      linkUsed.push({
        source: linkArr[i].source,
        target: linkArr[i].target
        // weight: linksTargetted[linkArr[i].target]
      })
    } else if (
      !subreddits.includes(linkArr[i].source) &&
      linksTargetted[linkArr[i].source] != undefined &&
      linksTargetted[linkArr[i].source].length > 1
    ) {
      linkUsed.push({
        source: linkArr[i].source,
        target: linkArr[i].target
        // weight: linksTargetted[linkArr[i].target]
      })
    }
  }

  var nodes = [];
  nodesUsed = [];
  for(var i = 0; i < linkUsed.length; i++){
    if(!nodesUsed.includes(linkUsed[i].target)){
      var node = {
        id: linkUsed[i].target,
        name: linkUsed[i].target
      }
      nodes.push(node);
      nodesUsed.push(linkUsed[i].target);
    }
    if(!nodesUsed.includes(linkUsed[i].source)){
      var node = {
        id: linkUsed[i].source,
        name: linkUsed[i].source
      }
      nodes.push(node);
      nodesUsed.push(linkUsed[i].source);

    }
  }



  var output = {
    nodes: nodes,
    links: linkUsed
  }
  fs.writeFileSync('datalinks-v4.json', JSON.stringify(output))
})
