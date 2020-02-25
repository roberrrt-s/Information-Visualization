var fs = require('fs')
var nodeArr = []
var linkArr = []
var nodeValues = []
var nodesUsed = []

fs.readFile('../src/resources/datalinks.json', function read (err, data) {
  if (err) {
    throw err
  }
  var data = JSON.parse(data)
  for (var i = 0; i < data.links.length; i++) {
    if (
      !nodeValues[data.links[i].source]
    ) {
      nodeValues[data.links[i].source] = 1
    } else {
      nodeValues[data.links[i].source] = nodeValues[data.links[i].source] + 1
      if (nodeValues[data.links[i].source] == 25) {
        var node = {
          id: data.links[i].source,
          name: data.links[i].source
        }
        nodeArr.push(node)
        nodesUsed.push(data.links[i].source)
      }
    }
  }

  for (var i = 0; i < data.links.length; i++) {
    if (
      nodesUsed.includes(data.links[i].source) &&
      nodesUsed.includes(data.links[i].target)
    ) {
      var link = {
        source: data.links[i].source,
        target: data.links[i].target
      }
      linkArr.push(link)
    }
  }

  var output = {
    nodes: nodeArr,
    links: linkArr
  }
  fs.writeFileSync('datalinks-v2.json', JSON.stringify(output))
})
