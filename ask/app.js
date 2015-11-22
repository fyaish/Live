var app = angular.module('aftBasic', ['firebaseResource', 'ngAnimate', 'myFirebase']);



app.factory('Question', function(firebaseResource) {

  var Question = firebaseResource(
    {
      path: 'questions',
      hasMany: ['Vote']
    }
  );

  Question.prototype.init = function() {
    this.votes().query();
    if (localStorage.getItem(this.id)) {
      this.voted = true;
    }
  }

  Question.prototype.vote = function(direction) {
    var self = this;
    var previousVote = JSON.parse(localStorage.getItem(this.id));
    if (!previousVote) {
      localStorage.setItem(this.id, direction);
      this.votes().new({direction: direction}).save()
      this.voted = true;
    }
  }

  Object.defineProperty(Question.prototype, 'voteTotal', {
    get: function() {
      var total = 1;
      angular.forEach(this.votes().all(), function(vote) {
        total += vote.direction;
      });
      return total;
    }
  })

  return Question;

});

app.factory('Vote', function(firebaseResource) {

  var Vote = firebaseResource(
      {
        path: 'votes',
        belongsTo: true
      }
    );

    return Vote;

});



app.controller('MainCtrl', function($scope, Question) {

    Question.query() // query() sets up the proper Firebase listeners for the model. Does not return the actual objects.
    $scope.questions = Question.all(); // all() returns the actual objects pulled down from Firebase for this model

    $scope.question = new Question();
    var questions = $scope.questions
    $scope.ask = function() {
      if ($scope.question.text) {
        $scope.question.save();
        $scope.question = new Question();
      }
    }



});