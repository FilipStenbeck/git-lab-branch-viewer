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
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .when('/about', {
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
