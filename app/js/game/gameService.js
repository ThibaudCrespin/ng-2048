
'use strict';

/* Services */

var projet = angular.module('projet');

projet.factory('GameService', ['$http', function ($http) {

    return {
        getGame: function () {
            return $http.get("data/save.json");
        }
    };
}]);