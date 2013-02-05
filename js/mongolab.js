// This is a module for cloud persistance in mongolab - https://mongolab.com
angular.module('mongolab', ['ngResource']).
  factory('Noun', function($resource) {
    var Noun = $resource('https://api.mongolab.com/api/1/databases' +
                         '/latin/collections/Nouns/:id',
                         { apiKey: '510dd24be4b0847da6a06d6a' }, {
                           update: { method: 'PUT' }
                         }
                        );
    
    Noun.prototype.update = function(cb) {
      return Noun.update({id: this._id.$oid},
                         angular.extend({}, this, {_id:undefined}), cb);
    };
    
    Noun.prototype.destroy = function(cb) {
      return Noun.remove({id: this._id.$oid}, cb);
    };
    
    return Noun;
  });
/*
angular.module('mongolab', ['ngResource']).
  factory('Verb', function($resource) {
    var Verb = $resource('https://api.mongolab.com/api/1/databases' +
                         '/latin/collections/Verbs/:id',
                         { apiKey: '510dd24be4b0847da6a06d6a' }, {
                           update: { method: 'PUT' }
                         }
                        );
    
    Verb.prototype.update = function(cb) {
      return Verb.update({id: this._id.$oid},
                         angular.extend({}, this, {_id:undefined}), cb);
    };
    
    Verb.prototype.destroy = function(cb) {
      return Verb.remove({id: this._id.$oid}, cb);
    };
    
    return Verb;
  }); */
