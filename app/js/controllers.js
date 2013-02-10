function ListCtrl($scope, Noun) {
  $scope.nouns = Noun.query();
}
  
function CreateCtrl($scope, $location, $http, Noun) {
  $http.get('data/declensions/declensions.json').then(function(res) {
    $scope.declensions = res.data;
  }); 

  $scope.save = function() {
    $scope.noun.overallCorrect = 0;
    $scope.noun.runCount = 0;

    Noun.save($scope.noun, function(noun) {
      $location.path('/edit/' + noun._id.$oid);
    });
  };

  $scope.loadDeclension = function() {
    $scope.nounEdit.nominativeSingular = "Woo";
  };

  $scope.declense = function() {
    var declension = $scope.declensions[parseInt($scope.noun.declension) - 1];
      
    Noun.foreachDeclension(function(nounCase, plurality) {
      scope.noun.declensions[nounCase][plurality] = $scope.noun.name + declension[nounCase][plurality];
    });
  };
}

function EditCtrl($scope, $location, $routeParams, Noun) {
  var self = this;
 
  Noun.get({id: $routeParams.nounId}, function(noun) {
    self.original = noun;
    $scope.noun = new Noun(self.original);
  });
 
  $scope.isClean = function() {
    return angular.equals(self.original, $scope.noun);
  };
 
  $scope.destroy = function() {
    self.original.destroy(function() {
      $location.path('/list');
    });
  };
 
  $scope.save = function() {
    $scope.noun.update(function() {
      $location.path('/list');
    });
  };
}

function QuizCtrl($scope, $location, Noun) { 
  //$scope.questionNoun;

  var loading = true;
  var nextActionTitle = "Next";
  $scope.pos = 0;
  $scope.correct = 0;

  $scope.questions = Noun.query(function() {
    $scope.total = $scope.questions.length;    
    $scope.questions.sort(function(noun1, noun2) {
      return noun1.overallCorrect < noun2.overallCorrect;
    });
    
    $scope.nextAction();
    loading = false;
  });

  $scope.currentNoun = function() {return loading ? "" : $scope.questionNoun.name;};
  $scope.isDone = function() {return $scope.pos > $scope.total ? true : false;};

  $scope.getNextActionTitle = function() {
    return nextActionTitle;
  };

  $scope.statusMessage = function() {
    if (loading)
      return "Loading...";
    else if ($scope.isDone())
      return "Quiz over. You got "+ ($scope.correct / $scope.total * 100) +"% correct.";
    else
      return "On question "+ $scope.pos +" out of "+ $scope.total +". "+ $scope.correct +" correct this run.";
  };

  $scope.nextAction = function() {
    if (nextActionTitle == "Score") {
      nextActionTitle = "Next";
      evaluateScore();
    } else {
      nextActionTitle = "Score";
      nextQuestion();
    }
  };

  function resetFields() {
    $scope.f = function(nounCase, plural) {
      if ("noun" in $scope) {
        $scope.noun.declensions[nounCase][plural] = "";
      }
    };

    Noun.foreachDeclension($scope.f);
  }

  function evaluateScore() {
    var anyWrong = false;
    $scope.f = function(nounCase, plural) {
      if ($scope.questionNoun.declensions[nounCase][plural] != $scope.noun.declensions[nounCase][plural]) {
        $scope.noun.declensions[nounCase][plural] = "WRONG";
        anyWrong = true;
      }     
    };
    
    Noun.foreachDeclension($scope.f);

    if (anyWrong) {
      $scope.questionNoun.runCount = 0;
    } else {
      $scope.correct++;
      $scope.questionNoun.overallCorrect++;
    }
    
    Noun.save($scope.questionNoun);
  }

  function nextQuestion() {
    $scope.pos++;
    resetFields();
    $scope.questionNoun = $scope.questions.pop();
  }
}

function StatsCtrl($scope, $location) {
  // TODO
}
