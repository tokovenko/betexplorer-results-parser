var Parser = require('./parser');

var parser = new Parser('england','premier-league','2014-2015');
parser.loadMatches(function(matches) {
    console.log('matches: ', matches);
    parser.saveToFile(matches);
})
