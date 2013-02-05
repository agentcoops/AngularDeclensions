angular.module('latinweb', ['mongolab']).
  config(function($routeProvider) {
    $routeProvider.
      when('/', {controller:ListCtrl, templateUrl:'list.html'}).
      when('/edit/:nounId', {controller:EditCtrl, templateUrl:'detail.html'}).
      when('/new', {controller:CreateCtrl, templateUrl:'detail.html'}).
      otherwise({redirectTo:'/'});
  });
 

function ListCtrl($scope, Noun) {
  $scope.nouns = Noun.query();
}
 
 
function CreateCtrl($scope, $location, $http, Noun) {
  $http.get('js/declensions.json').success(function(data) {
    $scope.declensions = data;
  }); 

  $scope.save = function() {
    Noun.save($scope.noun, function(noun) {
      $location.path('/edit/' + noun._id.$oid);
    });
  }

  $scope.declense = function() {    
    var declension = $scope.nounEdit.declension;
    var nounsDeclension = $scope.declensions[declension];
    $scope.nounEdit.nominativeSingular = $scope.name + nounsDeclension["nominative"]["singular"];
  }
}
 
 
function EditCtrl($scope, $location, $routeParams, Noun) {
  var self = this;
 
  Noun.get({id: $routeParams.nounId}, function(noun) {
    self.original = noun;
    $scope.noun = new Noun(self.original);
  });
 
  $scope.isClean = function() {
    return angular.equals(self.original, $scope.noun);
  }
 
  $scope.destroy = function() {
    self.original.destroy(function() {
      $location.path('/list');
    });
  };
 
  $scope.save = function() {
    $scope.noun.update(function() {
      $location.path('/');
    });
  };
}
