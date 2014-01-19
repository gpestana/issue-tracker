require('colors');
var read           = require('read');
var error          = require('../modules/error.js');
var config         = require('../modules/config.js');
var Issue       = require('model').getModelByName('Issue');
 
exports = module.exports = fullupdate;
 
exports.usage =
function usage(name, args) {
  args.
    usage('trckr pipeline <issuenumber> [<state>] [<next>]');
};
 
function fullupdate(args) {
  console.log('→ Pipeline'.green);

  var pipeline = config.getConfig().pipeline;
  var issue    = {};

  whichIssue(function (number) {
    whichState(function (state) {
      if (state === 'next') {
        // TODO
        console.log('TODO'.yellow);
      } else {
        issue.trckrState = state;
        issue.trckrLastReview = new Date();
        issue.save(function (err, data) {
          if (err) {
            return console.log(err);
          }
          console.log(data);
          console.log('updated issue: '.green + number + ' to :' + state);
        });
        
      }
    });
  });



  function whichIssue(cb) {
    var what = args._[0];
    if (what) {
      return cb(what);
    }

    read({
      prompt: 'which issue? (type the number): '
    }, function(err, what) {
      validIssue(what);
      cb(what);
    });

    function validIssue(number) {
      Issue.first({number: number}, gotIssue);

      function gotIssue(err, _issue) {
        if (err) {
          error(err.detail);
        }
        if (_issue) {
          issue = _issue;
        } else {
          error('Issue does not exist');
        }
      }
    }
  }
 
  function whichState(cb) {
    var what = args._[0];
    if (what) {
      return cb(what);
    }

    read({
      prompt: 'which state?(available: ' + pipeline.toString() + '):'
    }, function(err, what) {
      validState(what);
      cb(what);
    });

    function validState(state) {
      for (var i=0;i<pipeline.length;i++) {
        if (pipeline[i] === state){
          return;
        }
      }
      error('not a valid state');
    }
  }

}