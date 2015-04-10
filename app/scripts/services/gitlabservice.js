'use strict';

/**
 * @ngdoc service
 * @name branchWatcherApp.gitLabService
 * @description
 * # gitLabService
 * Service in the branchWatcherApp.
 */
angular.module('branchWatcherApp')
  .service('gitLabService', function ($http, $q, configService) {
    var privateToken = '616bMnMswMMGAzEGMtUx';

    function getBranchUrl (id) {
      return configService.urls.gitLab + 'api/v3/projects/' + id + '/repository/branches?private_token=' + privateToken + '&per_page=100';
    }

    function getBranchesByProject (id) {
      var deferred = $q.defer();
      var promise = deferred.promise;
      $http.get(getBranchUrl(id)).then(function(response) {
        deferred.resolve(response.data);
      });
      return promise;
    }


    return {
      getBranchesByProject: getBranchesByProject
    };
  });
