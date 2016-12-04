'use strict';

/* Controllers */

var projet = angular.module('projet');

projet.controller('GameController', ['$scope','GameService', '$mdDialog',
    function GameController( $scope, GameService, $mdDialog ) {

        var vm = this;

        vm.score = 0;
        vm.size = 4; // Default size is 4
        vm.game = [];
        vm.emptyCells = [];
        vm.gameOver = false;

        vm.move = move;
        vm.init = init;
        vm.debug = debug;
        vm.gameStatus = gameStatus;

        var hasMoved = false;

        function debug() {
            console.log('It Works !');
        }

        function init() {
            GameService.getGame().then(function(response){
                vm.size = response.data.size;
                createGrid();
                addTile();
                // Si on veut faire le placement en fonction du json
                // vm.game = response.data.placement;
            });
        }

        function move(event) {
            switch (event.keyCode) {
                case 37:
                    if(gridToLeft()){
                        addTile();
                    }
                    break;
                case 38:
                    if(gridToTop()){
                        addTile();
                    }
                    break;
                case 39:
                    if(gridToRight()){
                        addTile();
                    }
                    break;
                case 40:
                    if(gridToBottom()){
                        addTile();
                    }
                    break;
            }
            if(vm.gameOver)
                gameStatus();
        }

        function createGrid() {
            for (var i = 0; i < vm.size; i++) {
                var gridrow = [];
                for (var j = 0; j < vm.size; j++) {
                    gridrow.push(0);
                }
                vm.game.push(gridrow);
            }
        }

        function incrementScore(value) {
            vm.score += value;
        }

        function addTile() {
            vm.emptyCells = [];
            // search for all empty cells
            for (var i = 0; i < vm.size; i++) {
                for (var j = 0; j < vm.size; j++) {
                    if (vm.game[i][j] === 0) {
                        vm.emptyCells.push([i, j]);
                    }
                }
            }

            if (vm.emptyCells.length === 0)
                vm.gameOver = true;
            else {
                var pos = vm.emptyCells[Math.floor(Math.random() * vm.emptyCells.length)];
                vm.game[pos[0]][pos[1]] = 2;
            }

        }

        function gridToLeft() {
            var hasMoved = false;
            for (var i = 0; i < vm.size; i++) { // for each line
                var minMerge = 0;
                for (var j = 1; j < vm.size; j++) { // for each cell except the first
                    if (vm.game[i][j] > 0) { // if no empty-cell
                        for (var j2 = j; j2 > minMerge; j2--) {
                            if (vm.game[i][j2 - 1] === 0) { // move to left
                                vm.game[i][j2 - 1] = vm.game[i][j2];
                                vm.game[i][j2] = 0;
                                hasMoved = true;
                            }
                            else if (vm.game[i][j2] === vm.game[i][j2 - 1]) { // merge to left
                                vm.game[i][j2 - 1] *= 2;
                                incrementScore(vm.game[i][j2 - 1]);
                                vm.game[i][j2] = 0;
                                minMerge = j2; // left cell cannot be merged again
                                hasMoved = true;
                            }
                        }
                    }
                }
            }
            return hasMoved;
        }

        function gridToRight() {
            var hasMoved = false;
            for (var i = 0; i < vm.size; i++) {
                var minMerge = vm.size - 1;
                for (var j = vm.size - 2; j >= 0; j--) {
                    if (vm.game[i][j] > 0) { // non empty-cell
                        for (var j2 = j; j2 < minMerge; j2++) {
                            if (vm.game[i][j2 + 1] === 0) { // move to right
                                vm.game[i][j2 + 1] = vm.game[i][j2];
                                vm.game[i][j2] = 0;
                                hasMoved = true;
                            }
                            else if (vm.game[i][j2 + 1] === vm.game[i][j2]) { // merge to right
                                vm.game[i][j2 + 1] *= 2;
                                incrementScore(vm.game[i][j2 + 1]);
                                vm.game[i][j2] = 0;
                                minMerge = j2; // right cell cannot be merged again
                                hasMoved = true;
                            }
                        }
                    }
                }
            }
            return hasMoved;
        }

        function gridToTop() {
            var hasMoved = false;
            for (var i = 1; i < vm.size; i++) {
                var minMerge = 0;
                for (var j = 0; j < vm.size; j++) {
                    if (vm.game[i][j] > 0) { // non empty-cell
                        for (var i2 = i; i2 > minMerge; i2--) {
                            if (vm.game[i2 - 1][j] === 0) { // move to top
                                vm.game[i2 - 1][j] = vm.game[i2][j];
                                vm.game[i2][j] = 0;
                                hasMoved = true;
                            }
                            else if (vm.game[i2 - 1][j] === vm.game[i2][j]) {
                                vm.game[i2 - 1][j] *= 2;
                                incrementScore(vm.game[i2 - 1][j]);
                                vm.game[i2][j] = 0;
                                minMerge = i2; // top cell cannot be merged again
                                hasMoved = true;
                            }
                        }
                    }
                }
            }
            return hasMoved;
        }

        function gridToBottom() {
            var hasMoved = false;
            for (var i = vm.size - 2; i >= 0; i--) {
                var minMerge = vm.size - 1;
                for (var j = 0; j < vm.size; j++) {
                    if (vm.game[i][j] > 0) { // non empty-cell
                        for (var i2 = i; i2 < minMerge; i2++) {
                            if (vm.game[i2 + 1][j] === 0) { // move to bottom
                                vm.game[i2 + 1][j] = vm.game[i2][j];
                                vm.game[i2][j] = 0;
                                hasMoved = true;
                            }
                            else if (vm.game[i2 + 1][j] === vm.game[i2][j]) {
                                vm.game[i2 + 1][j] *= 2;
                                incrementScore(vm.game[i2 + 1][j]);
                                vm.game[i2][j] = 0;
                                minMerge = i2; // left cell cannot be merged again
                                hasMoved = true;
                            }
                        }
                    }
                }
            }
            return hasMoved;
        }

        vm.closeDialog = function () {
            $mdDialog.hide();
        };

        function gameStatus(){
            $mdDialog.show({
                hasBackdrop:true,
                template: '<md-dialog aria-label="List dialog">' +
                '  <md-content data-ng-if="ctrl.gameOver"> Game Over !</md-content>' +
                '  <md-content data-ng-if="!ctrl.gameOver"> Bravo vous avez atteint 2048 !</md-content>' +
                '  <div class="md-actions">' +
                '    <md-button ng-click="ctrl.closeDialog()">' +
                '      Continuer' +
                '    </md-button>' +
                '  </div>' +
                '</md-dialog>',
                controller: GameController
            });
        };

}]);
