var app = angular.module('Delete',['ngCookies']);

app.directive('navbar',function(){
	return{
		templateUrl: '/templates/navbar.html'
	}
});

app.controller('ctrlDelete',function($scope,$http,$window){
	$scope.deleteBlogs = [];
	$('.blog').click(function(){
		if($(this).hasClass('active')){
			$(this).removeClass('active');
			$scope.deleteBlogs.pop($(this).attr('blogId'));
		}
		else{
			$(this).addClass('active');
			$scope.deleteBlogs.push($(this).attr('blogId'));
		}
	})
	$scope.delete = function(){
		console.log('delete');
		$http.post('/blog/delete',$scope.deleteBlogs).then(function(res,status){
			$window.location.href = 'http://'+$window.location.host+'/blog/myblogs';
		})
	}
})

app.controller('ctrlForm',ctrlForm);

app.controller('ctrlUser',ctrlUser);


app.directive('authedUser',authedUser);