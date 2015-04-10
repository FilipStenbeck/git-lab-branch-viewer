'use strict';

/**
 * @ngdoc function
 * @name branchWatcherApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the branchWatcherApp
 */
angular.module('branchWatcherApp')
  .controller('MainCtrl', function ($scope, gitLabService) {
    var brakeOffDate = new Date();
    var master;
    var production;
    var branches =[];

    brakeOffDate.setDate(brakeOffDate.getDate() - 10);


    function getJiraLink(branchName) {
      //var jiraInfo = branchName.substr(0, branchName.indexOf(0,'-'));
      //var jiraInfo = branchName.match(/[A-Z][A-Z][A-Z]-[0-9][0-9][0-9]/)[1];
      return branchName;
    }

    function setStatus (branch) {
      var lastCommit = new Date(branch.commit.committed_date);
      var masterDate = new Date(master.commit.committed_date);

      if (lastCommit < brakeOffDate) {
        branch.css = 'danger';
      } else if (lastCommit < masterDate) {
        branch.css = 'warning';
      } else {
         branch.css = 'ok';
      }
      console.log(getJiraLink(branch.name));
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

    gitLabService.getBranchesByProject('54').then(function(data){
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
      $scope.branches  = _.map(branches, setStatus);


    });
  });
