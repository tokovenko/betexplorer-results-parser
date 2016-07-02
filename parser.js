var request = require('request'),
  cheerio = require('cheerio'),
  _ = require('lodash'),
  fs = require('fs');




var parser = (function() {

    function Parser(country, league, years) {
        this.country = country;
        this.league = league;
        this.years = years;
    }

    Parser.prototype.loadMatches = function(cb) {
        return this.request(cb);
    }

    Parser.prototype.request = function(cb) {
        var url = 'http://www.betexplorer.com/soccer/' + this.country + '/' + this.league + '-' + this.years + '/results/';
        var self = this;
        request(url, function(err, res, html) {
            if (err) {
                throw err;
            }
            cb(self.parseHtml(html));
        });
    }

    Parser.prototype.parseHtml = function(html) {
        var $ = cheerio.load(html);
        var matchesData = $('#leagueresults_div table tr');
        var matches = [];
        matchesData.map(function(i, match) {
          if(!match.attribs.class.match(/rtitle/) && match.children) {

            var teams = match.children[0].children[0].children[0].data.split(' - ');
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

        return matches;
    }

    Parser.prototype.saveToFile = function(matches) {
        var file = __dirname + '/matches/' + this.country + '-' + this.league + '-' + this.years + '.json';
        var self = this;
        fs.writeFile(file, JSON.stringify(matches), function(err) {
          if (err) {
              throw err;
          }
          console.log('Matches: ' + self.country + '/' + self.league + '/' + self.years + ' saved!');
        });
    }

    return Parser;

}());


module.exports = parser;
