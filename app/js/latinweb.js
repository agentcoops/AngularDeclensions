angular.module('latinweb', ['mongolab']).
  config(function($routeProvider) {
    $routeProvider.
      when('/list', {controller:ListCtrl, templateUrl:'partials/list.html'}).
      when('/edit/:nounId', {controller:EditCtrl, templateUrl:'partials/detail.html'}).
      when('/new', {controller:CreateCtrl, templateUrl:'partials/detail.html'}).
      when('/quiz', {controller:QuizCtrl, templateUrl:'partials/quiz.html'}).
      when('/stats', {controller:StatsCtrl, templateUrl:'partials/stats.html'}).
      otherwise({redirectTo:'/'});
  });
