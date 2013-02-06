angular.module('mongolab', ['ngResource']).
  factory('Noun', function($resource) {
    var Noun = $resource('https://api.mongolab.com/api/1/databases' +
                         '/latin/collections/Nouns/:id',
                         { apiKey: '510dd24be4b0847da6a06d6a' }, {
                           update: { method: 'PUT' }
                         });
    
    Noun.prototype.update = function(cb) {
      return Noun.update({id: this._id.$oid},
                         angular.extend({}, this, {_id:undefined}), cb);
    };
    
    Noun.prototype.destroy = function(cb) {
      return Noun.remove({id: this._id.$oid}, cb);
    };
    
    // F must be a function that accepts current position. 
    Noun.foreachDeclension = function(noun, f) {
      for (var nounCase in ["nominative","genitive","dative","accusitive","ablative","vocative"]) {
        f(nounCase, "singular");
        f(nounCase, "plural");
      }      
    }

    return Noun;
  });
