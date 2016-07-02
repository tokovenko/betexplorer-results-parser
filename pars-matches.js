var request = require('request'),
  cheerio = require('cheerio'),
  _ = require('lodash'),
  fs = require('fs');


// for (var i = 4; i <= 14; i++) {

//   var year1 = '20' + (i>9 ? i : '0'+i);
//   var year2 = '20' + (i>8 ? (i+1) : '0'+ (i+1));

//   parse(year1 + '-' + year2);
// }
request('http://www.forbes.com/ajax/list/data?year=2015&uri=billionaires&type=person', function(err, res, body) {
    if (err) throw err; 
var peaples = JSON.parse(body);
      var contacts = "First Name;Last Name;E-mail Address\n";
console.log(peaples)
peaples.map(function(peaple) {
	var data = peaple.name.split(' ');
	contacts += data[0] + ";" + data[1] + (data[2] ? (' ' + data[2]) : '') + (data[3] ? (' ' + data[3]) : '') + ";" + peaple.uri + "@gmail.com\n";
})
//       var $ = cheerio.load(body);
//       var peaplesData = $('td.name a');
//       var peaples = [];

//       peaplesData.map(function(i, peapleData) {
//           var peaple = peapleData.data;
//           peaples.push(peaple);
//       });
// console.log(peaples)
      fs.writeFile('contacts.csv', contacts, function(err) {
        if (err) throw err;
        console.log('contacts created!');
      });


  });



function parse(years) {
    request('http://www.betexplorer.com/soccer/germany/bundesliga-' + years + '/results/', function(err, res, body) {
    if (err) throw err; 

      var $ = cheerio.load(body);
      var matchesData = $('#leagueresults_div table tr');
      var matches = [];
      var bank = 1000;
      var teamName = 'Arsenal';

      matchesData.map(function(i, match) {
        if(!match.attribs.class.match(/rtitle/) && match.children) {
          var teams = match.children[0].children[0].children[0].data.split(' - '),
            score = match.children[1].children[0].children[0].data.split(':'),
            koef = {
              w1: parseFloat(match.children[2].attribs['data-odd']),
              w2: parseFloat(match.children[3].attribs['data-odd']),
              x: parseFloat(match.children[4].attribs['data-odd'])
            },
            date = match.children[5].children[0].data;

          score[0] = parseInt(score[0]);
          score[1] = parseInt(score[1]);

          matches.push({
            teams: teams,
            score: score,
            koef: koef,
            date: date
          });

        }

      });

      fs.writeFile('matches/germany/' + years + '.json', JSON.stringify(matches), function(err) {
        if (err) throw err;
        console.log('Matches ' + years + ' saved!');
      });


  });
}