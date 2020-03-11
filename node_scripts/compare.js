var fs = require('fs')
var csv = require('csv-parser')

var nodeArr = []
var nodesUsed = []
var linkArr = []
var linkUsed = []
var linksTargetted = []
var combinedLinksTargetted = []
var subreddits = [
  [
    'programmerhumor',
    'leagueoflegends',
    'askscience',
    'explainlikeimfive',
    'moviedetails',
    'dataisbeautiful',
    'outoftheloop',
  ],
  [
    'trippinthroughtime',
    'twoxchromosomes',
    'whatsthisplant',
    'writingprompts',
    'plants',
    'niceguys',
    'fellowkids',
    'crappydesign',
  ]
]

var categories

fs.readFile('../src/resources/subreddit_topics.json', function read (
  err,
  data
) {
  if (err) {
    throw err
  }
  categories = JSON.parse(data)
})

fs.readFile('../src/resources/datalinks.json', function read (err, data) {
  if (err) {
    throw err
  }
  var data = JSON.parse(data)
  for (var i = 0; i < subreddits[0].length; i++) {
    var node = {
      id: subreddits[0][i],
      name: subreddits[0][i],
      group: 'user1'
    }
    nodeArr.push(node)
    nodesUsed.push(subreddits[0][i])
  }

  for (var i = 0; i < subreddits[1].length; i++) {
    var node = {
      id: subreddits[0][i],
      name: subreddits[0][i],
      group: 'user2'
    }
    nodeArr.push(node)
    nodesUsed.push(subreddits[1][i])
  }

  filterSubreddits(data, subreddits[0], 0)
  filterSubreddits(data, subreddits[1], 1)

  for (var i = 0; i < linkArr.length; i++) {
    if (
      !subreddits[0].includes(linkArr[i].target) &&
      !subreddits[1].includes(linkArr[i].target) &&
      linksTargetted[linkArr[i].target] != undefined &&
      linksTargetted[linkArr[i].target][0] != undefined &&
      linksTargetted[linkArr[i].target][0].length > 0 &&
      linksTargetted[linkArr[i].target][1] != undefined &&
      linksTargetted[linkArr[i].target][1].length > 0
    ) {
      linkUsed.push({
        source: linkArr[i].source,
        target: linkArr[i].target
      })
    } else if (
      !subreddits[0].includes(linkArr[i].source) &&
      !subreddits[1].includes(linkArr[i].source) &&
      linksTargetted[linkArr[i].source] != undefined &&
      linksTargetted[linkArr[i].source][0] != undefined &&
      linksTargetted[linkArr[i].source][0].length > 0 &&
      linksTargetted[linkArr[i].source][1] != undefined &&
      linksTargetted[linkArr[i].source][1].length > 0
    ) {
      linkUsed.push({
        source: linkArr[i].source,
        target: linkArr[i].target
      })
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
      for (var y = 0; y < categories.length; y++) {
        if (
          linkUsed[i].target.toLowerCase() ==
          categories[y].SUBREDDIT.toString().toLowerCase()
        ) {
          node.group = categories[y].CATEGORY
        }
      }
      node.followed = subreddits[0].includes(linkUsed[i].target)
        ? 1
        : subreddits[1].includes(linkUsed[i].target)
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
      for (var y = 0; y < categories.length; y++) {
        if (
          linkUsed[i].source.toLowerCase() ==
          categories[y].SUBREDDIT.toString().toLowerCase()
        ) {
          node.group = categories[y].CATEGORY
        }
      }
      node.followed = subreddits[0].includes(linkUsed[i].source)
        ? 1
        : subreddits[1].includes(linkUsed[i].source)
        ? 2
        : 0

      nodes.push(node)
      nodesUsed.push(linkUsed[i].source)
    }
  }

  var rec_subs = nodes
    .sort(function (a, b) {
      return b['weight'] - a['weight']
    })
    .slice(0, 15)

  var output = {
    nodes: nodes,
    links: linkUsed
  }
  fs.writeFileSync('data_compared.json', JSON.stringify(output))

  var recommended_subs = {
    rec_subs: rec_subs
  }
  fs.writeFileSync('rec_subs_compared.json', JSON.stringify(recommended_subs))
})

function filterSubreddits (data, sr, index) {
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

          for (var y = 0; y < categories.length; y++) {
            if (
              data.links[i].target.toLowerCase() ==
              categories[y].SUBREDDIT.toString().toLowerCase()
            ) {
              node.group = categories[y].CATEGORY
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
          for (var y = 0; y < categories.length; y++) {
            if (
              data.links[i].source.toLowerCase() ==
              categories[y].SUBREDDIT.toString().toLowerCase()
            ) {
              node.group = categories[y].CATEGORY
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
