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
    var master;
    var production;
    var id;
    var branches =[];

    /*********************
    Declaring functions
    **********************/

    function getJiraLink(branchName) {
      var jiraInfo = branchName.match(/[A-Z]+-[0-9]+/);
      if (jiraInfo) {
        return configService.urls.jira  + jiraInfo[0];
      }
      return '';
    }

    function addBrancheInfo (branch) {
      var brakeOffDate = new Date();
      var lastCommit = new Date(branch.commit.committed_date);
      var masterDate = new Date(master.commit.committed_date);

      brakeOffDate.setDate(brakeOffDate.getDate() - configService.dangerAfterDay);

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
      if (branch && branch.commit) {
        branch.commit.committed_date = moment(branch.commit.committed_date).format('YYYY-MM-DD HH:MM');
      }
      console.log(branch);
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

    /**********************
    Setup and init
    ***********************/

    //Set project id
    if ($routeParams && $routeParams.id) {
      id = $routeParams.id;
    } else {
      //Default to Eva-GUI branch
      id = '54';
    }

    //Get all projects and show the last updated
    gitLabService.getAllProjects().then(function (result) {
      $scope.allProjects = result.slice(0, 25);
    });

    //Set project info
    gitLabService.getProjectInfo(id).then(function (result) {
      $scope.project = result;
    });

    gitLabService.getBranchesByProject(id).then(function(data){

      //Pick out only master
      master = formatTime(_.head(_.filter(data, function(branch) {
        return branch.name === 'master';
      })));

      //pick out only production
      production = formatTime(_.head(_.filter(data, function(branch) {
        return branch.name === 'production';
      })));

      //rest of the branches
      branches  = _.map(_.filter(data, filterOffical), formatTime);

      //sort branches by date
      branches = branches.sort(sortByCommitDate);

      //Update status and set scope
      $scope.branches  = _.map(branches, addBrancheInfo);
      $scope.master = master;
      $scope.production = production;

    });
  });
