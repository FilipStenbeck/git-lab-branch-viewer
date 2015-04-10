'use strict';

/**
 * @ngdoc service
 * @name branchWatcherApp.configService
 * @description
 * # configService
 * Service in the branchWatcherApp.
 */
angular.module('branchWatcherApp')
  .service('configService', function () {
    return {
      dangerAfterDay: 10,
      urls: {
        jira: 'https://besedo.atlassian.net/browse/',
        gitLab: 'https://gitlab.besedo.com/'
      }
    };
  });
