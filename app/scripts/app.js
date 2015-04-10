'use strict';

/**
 * @ngdoc overview
 * @name branchWatcherApp
 * @description
 * # branchWatcherApp
 *
 * Main module of the application.
 */
angular
  .module('branchWatcherApp', [
    'ngResource',
    'ngRoute',
    'ngSanitize'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/:id', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
