var app = angular.module('Auth',['ngCookies']);

app.factory('user',function(){
	var user = {};

	return{
		getUser: function(){
			return user;
		},
		addUser: function(obj){
			Object.assign(user,obj);
		}
	}
});

app.controller('ctrlDrop',ctrlDrop);

app.controller('ctrlForm',function($scope,$cookies,$http,$window,user){
	$scope.user = $cookies.getAll();
	$('#preview').attr('src',$scope.user.image);
	$scope.submit = function(){
		$scope.user.image = user.getUser().imageBuf;
	 	$http.post('/user/update',$scope.user).then(function(res,status){
	 		$window.location.href='http://'+$window.location.host+'/account'
	 	});
	}
});