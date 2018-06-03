var app = angular.module('Account',['ngCookies']);

app.factory('user',function(){
	var user = {};

	return{
		getUser :function(){
			return user;
		},
		addUser: function(obj){
			Object.assign(user,obj);
		}
	}
});


app.controller('ctrlName',function($scope,$cookies,$window){
	$scope.user = {};
	console.log($cookies.getAll());
	$scope.user.name = $cookies.get('name');
	$scope.user.surname = $cookies.get('surname');

	$scope.exit = function(){
		$cookies.put('auth',false);
		$window.location.href = "http://"+$window.location.host+"/";
	}
})

app.controller('ctrlAdd',function($scope,$http,$window,$cookies,user){

	var ID = function(){
		return '_'+Math.random().toString(36).substr(2,9);
	}
	$scope.blog = {};
	$scope.blog.email = $cookies.get('email');
	user.addUser({'email': $scope.blog.email});
	$scope.blog.id = ID();
	user.addUser({'id': $scope.blog.id});
	$scope.add = function(){
		$scope.blog.content = $('#mytextarea').val();
		console.log($scope.blog.content);
		user.addUser({'name': $scope.blog.name,'tag': $scope.blog.tag,'content': $scope.blog.content});
		console.log($scope.blog);
		var blogObj = user.getUser();
		$http.post('/blog/add',blogObj).then(function(res,status){
				document.getElementById('success').style.visibility = "visible";
		})
	}
})

app.controller('ctrlDrop',ctrlDrop);
app.controller('ctrlUser',ctrlUser);


app.controller('ctrlMyblogs',function($scope,$http,$cookies){

	$scope.blogs = {};
	var email = $cookies.get('email');
	$http.post('/blog/myblogs',email).then(function(res,status){
		console.log(res.data);
		$scope.blogs = res.data;
	})
})



app.directive('navbar',function(){
	return{
		templateUrl: '/templates/navbar.html'
	}
});
app.directive('authedUser',function($cookies){
	return{
		templateUrl: function(scope,elem,attr){ 
			var cok = $cookies.get('auth');
			if(cok == 'true'){
				return '/templates/authed.html';
			}
			else{
				return '/templates/not_authed.html'
			}
		}
	}
});