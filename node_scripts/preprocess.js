var fs = require('fs');
var arr = [];
const neatCsv = require('neat-csv');

// fs.readFile('../resources/subreddits.json', function read(err, data) {
//     if (err) {
//         throw err;
//     }
//     var json = JSON.parse(data);
//     for (var i = 0; i < json.length; i++) {
//         var index = i + 1;
//         var item = {
//             "id": json[i].SUBREDDIT,
//             "name": json[i].SUBREDDIT
//         }
//         if(!arr.includes(json[i].subreddit)){
//             var item = JSON.stringify(item);
//             arr.push(item);
//         }
//     }
//     console.log(arr);
//     var output = JSON.stringify(arr);
//     fs.writeFileSync('nodes.json', arr);

// });

fs.readFile('./subreddits.csv', async function(err, data) {
    if (err) {
        throw err;
    }
    var json = await neatCsv(data);
    console.log(json);
    for(subreddit in json){
        console.log(json[subreddit].key);
    }

});