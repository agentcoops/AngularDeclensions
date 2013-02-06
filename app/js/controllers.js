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
  }

  $scope.loadDeclension = function() {
    $scope.nounEdit.nominativeSingular = "Woo";
  }

  $scope.declense = function() {
    var declension = $scope.declensions[parseInt($scope.noun.declension) - 1];

    if (!("declensions" in $scope.noun)) {
      $scope.noun["declensions"] = {};            
    }    

    for (var nounCase in declension) {
      if (!(nounCase in $scope.noun)) {
        $scope.noun.declensions[nounCase] = {};
      }      

      $scope.noun.declensions[nounCase]["singular"] = $scope.noun.name + declension[nounCase]["singular"];
      $scope.noun.declensions[nounCase]["plural"] = $scope.noun.name + declension[nounCase]["plural"];
    }
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
      $location.path('/list');
    });
  };
}

function QuizCtrl($scope, $location, Noun) { 
  $scope.questionNoun;

  var loading = true;
  var nextActionTitle = "Next";
  $scope.pos = 0;
  $scope.correct = 0;

  $scope.questions = Noun.query(function() {
    $scope.total = $scope.questions.length;    
    $scope.questions.sort(function(noun1, noun2) {
      return noun1.overallCorrect < noun2.overallCorrect
    });
    
    $scope.nextAction();
    loading = false;
  });

  $scope.currentNoun = function() {loading ? "" : $scope.questionNoun.name}
  $scope.isDone = function() {$scope.pos == $scope.total ? true : false}

  $scope.getNextActionTitle = function() {
    return nextActionTitle;
  }

  $scope.statusMessage = function() {
    if (loading)
      return "Loading..."
    else if ($scope.isDone())
      return "Quiz over. You got "+ ($scope.correct / $scope.total * 100) +"% correct."
    else
      return "On question "+ $scope.pos +" out of "+ $scope.total +". "+ $scope.correct +" correct this run."
  }

  $scope.nextAction = function() {
    if ($scope.nextActionTitle == "Score") {
      evaluateScore();
      nextAction = "Next";
    } else {
      nextQuestion();
      nextAction = "Score";
    }
  }

  function resetFields() {
    Noun.foreachDeclension(function(nounCase, plural) {
      alert("THIS IS A FUNCTION.");
      if (!(nounCase in $scope.noun.declensions)) $scope.noun.declensions[nounCase] = {};       
      $scope.noun.declensions[nounCase][plural] = "";
    })
  }

  function evaluateScore() {
    var anyWrong = false;

    Noun.foreachDeclension(function(nounCase, plural) {
      if ($scope.questionNoun.declensions[nounCase][plural] != $scope.noun.declensions[nounCase][plural]) {
          $scope.noun.declensions[nounCase][plural] = "WRONG";
          anyWrong = true;
        }
    });

    if (anyWrong) {
      $scope.questionNoun.runCount = 0;
    } else {
      $scope.correct++;
      $scope.questionNoun.overallCorrect++ 
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
