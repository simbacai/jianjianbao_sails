app

.controller("HomeCtrl", 
  function ($scope, lodash, $q, JianJianBaoAPISrv)  {
    console.log("HomeCtrl: BEGIN................");
    $scope.poster = {};
    $scope.proposals = [];

    //Load the Poster
    JianJianBaoAPISrv
    .getPoster($scope.posterId, $scope.userId)
    .then(function (poster) {
      $scope.poster = poster;
      return null;
    })
    //Load the proposals
    .then(function () {
      var dfd = $q.defer();
      dfd.resolve();
      promise = dfd.promise;
   
      lodash.each($scope.poster.proposals.reverse(), function(proposalId) {
          promise = promise.then(function() {
              return JianJianBaoAPISrv.getProposal(proposalId);
          }).then(function(proposal) {
              // ...
              $scope.proposals.push(proposal);
          });
      });   
    });

    //Get the proposalsummary push message
    io.socket.on('poster', function (proposalSummary) { 
      JianJianBaoAPISrv.getProposal(proposalSummary.data.proposal)
      .then(function(proposal){
        //Todo: $scope update does not update view
        $scope.proposals.unshift(proposal);
        //$scope.$apply();
      });
    });
    io.socket.get("/poster/" + $scope.posterId);
})

.controller("HomeProposalCtrl", 
  function ($scope, $location, JianJianBaoAPISrv,$controller)  {
    $controller('HomeCtrl', {$scope : $scope}); //Make HomeProposalCtrl as child of HomeCtrl
    $scope.solution = "";
    $scope.propose = function() {        
        JianJianBaoAPISrv.postProposal($scope.solution, $scope.posterId, $scope.nodeId)
        .then(function(response) {
            $location.path("/tab/home");
        });   
    } ;
})

.controller("HomeShareCtrl", 
  function($scope, $q, JianJianBaoAPISrv)  {
})

.controller("HomeProposalLinkPathCtrl", 
  function($scope, $q, $location, JianJianBaoAPISrv, $stateParams)  {
    var proposalId = $stateParams.id;
    JianJianBaoAPISrv
    .getPoster($scope.posterId, $scope.userId)
    .then(function (poster) {
      $scope.poster = poster;
      return null;
    })
    .then(function () {
      return JianJianBaoAPISrv.tipsCalc(proposalId);
    })
    .then(function (tips) {
      $scope.tips = tips;
    });
})

.controller("HomeProposalAdoptCtrl", 
  function($scope, $q, $location, JianJianBaoAPISrv, $stateParams, $controller)  {
    $controller('HomeCtrl', {$scope : $scope});
    var proposalId = $stateParams.id;
    JianJianBaoAPISrv.tipsCalc(proposalId)
    .then(function (tips) {
      $scope.tips = tips;
    });

    $scope.commit = function() {
        JianJianBaoAPISrv.commitProposal($stateParams.id)
        .then(function(tips) {
          //Todo: commit satus does not refresh view
          $scope.poster.commited = true;
          $location.path("/tab/home");
        });
    }
})

.controller("HomeCheckTipsCtrl", 
  function($scope, JianJianBaoAPISrv)  {
    JianJianBaoAPISrv.viewTips($scope.poster)
    .then(function(tips) {
        $scope.tips = tips;
    });
})

