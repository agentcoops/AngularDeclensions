'use strict';

describe("CreateCtrl", function(){
  var inject = angular.mock.inject;
  var scope, ctrl, $httpBackend;

  beforeEach(inject(function(_$httpBackend_, $rootScope, $controller) {
    $httpBackend = _$httpBackend_;
    $httpBackend.expectGET('js/declensions.js')
      .respond([{1: {nominative: {singular: "a", plural: "ae"},
                     genitive: {singular: "ae", plural: "/arum"},
                     dative: {singular: "ae", plural: "/is"},
                     accusitive: {singular: "am", plural: "/as"},
                     ablative: {singular: "/a", plural: "/is"},
                     vocative: {singular: "a", plural: "ae"}}}])

    scope = $rootScope.$new();
    ctrl = $controller('CreateCtrl', {$scope: scope});
  }))
  
  it('should load the declensions from json', inject(function($controller){
    expect(scope.declensions).toBeUndefined();
    $httpBackend.flush();
    
    expect(scope.declensions).toEqual([{1: {nominative: {singular: "a", plural: "ae"},
                                             genitive: {singular: "ae", plural: "/arum"},
                                             dative: {singular: "ae", plural: "/is"},
                                             accusitive: {singular: "am", plural: "/as"},
                                             ablative: {singular: "/a", plural: "/is"},
                                             vocative: {singular: "a", plural: "ae"}}}]);
  }))
})
