'use strict';

/**
 * @ngdoc function
 * @name branchWatcherApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the branchWatcherApp
 */
angular.module('branchWatcherApp')
  .controller('MainCtrl', function ($scope, $routeParams, gitLabService, configService) {
    var brakeOffDate = new Date();
    var master;
    var production;
    var id;
    var branches =[];


    brakeOffDate.setDate(brakeOffDate.getDate() - 10);


    //Set project id
    if ($routeParams && $routeParams.id) {
      id = $routeParams.id;
    } else {
      //Default to Eva-GUI branch
      id = '54';
    }

    //Set project info
    gitLabService.getProjectInfo(id).then(function (result) {
      console.dir(result);
      $scope.project = result;
    });

    function getJiraLink(branchName) {
      //var jiraInfo = branchName.substr(0, branchName.indexOf(0,'-'));
      var jiraInfo = branchName.match(/[A-Z]+-[0-9]+/);
      if (jiraInfo) {
        return configService.urls.jira  + jiraInfo[0];
      }
      return '';
    }

    function addBrancheInfo (branch) {
      var lastCommit = new Date(branch.commit.committed_date);
      var masterDate = new Date(master.commit.committed_date);

      if (lastCommit < brakeOffDate) {
        branch.css = 'danger';
      } else if (lastCommit < masterDate) {
        branch.css = 'warning';
      } else {
         branch.css = 'ok';
      }
      branch.jiraUrl = getJiraLink(branch.name);
      return branch;
    }


    function formatTime (branch) {
      branch.commit.committed_date = moment(branch.commit.committed_date).format('YYYY-MM-DD HH:MM');
      return branch;
    }

    function filterOffical (branch) {
      return branch.name !== 'master' && branch.name !== 'production';
    }

    function sortByCommitDate(a, b) {
        var lastCommitA = new Date(a.commit.committed_date);
        var lastCommitB = new Date(b.commit.committed_date);

        if (lastCommitA > lastCommitB) {
          return -1;
        }
        if (lastCommitA < lastCommitB) {
          return 1;
        }
        return 0;
      }

    gitLabService.getBranchesByProject(id).then(function(data){
      //Pick out only master
      master = _.head(_.filter(data, function(branch) {
        return branch.name === 'master';
      }));

      //pick out only production
      production = _.head(_.filter(data, function(branch) {
        return branch.name === 'production';
      }));

      //rest of the branches
      branches  = _.map(_.filter(data, filterOffical), formatTime);

      //sort branches by date
      branches = branches.sort(sortByCommitDate);

      //Update status and set scope
      $scope.branches  = _.map(branches, addBrancheInfo);


    });
  });
