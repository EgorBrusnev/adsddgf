var app = angular.module('Edit',['ngCookies']);

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

app.controller('ctrlEdit',function($scope,$window,$cookies,$http,user){
	$scope.blog = {};
	$scope.getId = function(id,name,tag){
		console.log(id);
		$scope.blog.post_id = id;
		$scope.blog.name = name;
		$scope.blog.tag = tag;
	}
	$scope.blog.email = $cookies.get('email');
	$scope.update = function(){
		console.log($scope.blog.post_id);
		$scope.blog.content = $('#mytextarea').val();
		$scope.blog.image = user.getUser().imageBuf;
		$http.post('/blog/update',$scope.blog).then(function(res,status){
			if(res.data === true){
				$window.location.href='http://'+$window.location.host+'/blog/myblogs';
			}
		})
	}
})
app.directive('navbar',function(){
	return{
		templateUrl: '/templates/navbar.html'
	}
});

app.controller('ctrlDrop',ctrlDrop);

app.controller('ctrlForm',ctrlForm);

app.controller('ctrlUser',ctrlUser);


app.directive('authedUser',authedUser);