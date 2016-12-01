'use strict';

angular.module('ng-2048', ['ngMaterial', 'projet', 'ui.router'])
    .config(function ($stateProvider, $urlRouterProvider) {

        $stateProvider.state({
			name:'index',
			url : '/',
			templateUrl: 'js/game/2048.html',
			controller: 'GameController'});

		$urlRouterProvider.when('', '/');

    });

angular.module('projet',[]);

