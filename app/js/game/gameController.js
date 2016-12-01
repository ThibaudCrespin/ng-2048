'use strict';

/* Controllers */

var projet = angular.module('projet');

projet.controller('GameController', ['$scope','GameService', function ( $scope, GameService ) {

    GameService.getGame().then(function(response){
        $scope.size = response.data.size;
        $scope.game = response.data.placement;
    });



}]);
