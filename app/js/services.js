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

    // Experimenting with best practices for model specification, ensuring second dict exists.
    Noun.prototype.declensions = 
                  {"nominative": {"singular": "", "plural": ""},
                   "genitive": {"singular": "", "plural": ""},
                   "dative": {"singular": "", "plural": ""},
                   "accusitive": {"singular": "", "plural": ""},
                   "ablative": {"singular": "", "plural": ""},
                   "vocative": {"singular": "", "plural": ""}};
    
    // F must be a function that accepts current position in
    // declension matrix. 
    Noun.foreachDeclension = function(f) {
      for (nounCase in Noun.prototype.declensions) {
        f(nounCase, "singular");
        f(nounCase, "plural");          
      }
    };

    return Noun;
  });
