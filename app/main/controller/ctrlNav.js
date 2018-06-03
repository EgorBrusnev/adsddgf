

var ctrlForm = function($scope,$http,$cookies){
	$('.close').click(function(){
		$('.alert').removeClass('show');
	});
	$scope.users = {};
	$scope.submit = function(){
		console.log($scope);
		if($scope.form.$valid){
			console.log("user: "+$scope.user.email)
			$http.post("/auth", $scope.user).then(function(res, status) {
				if(res.data == true){
     				location.reload();
	     		}
	     		else{
	     			$('#alert').text(res.data);
					$('.alert').addClass('show');
	     		}
			})
		}
	}
}

var ctrlUser = function($scope,$http,$cookies,$window){
	$scope.user = {};
	$scope.user.name = $cookies.get('name');
	$scope.user.surname = $cookies.get('surname');
	$scope.user.image = $cookies.get('image');
	console.log($scope.user);

	$scope.exit = function(){
		$cookies.remove('auth',{'path':'/'});
		$cookies.remove('name',{'path':'/'});
		$cookies.remove('email',{'path':'/'});
		$cookies.remove('surname',{'path':'/'});
		$cookies.remove('image',{'path':'/'});
		$window.location.href='http://'+$window.location.host+'/';
	}
}

var navbar = function(){
	return{
		templateUrl: '/templates/navbar.html'
	}
}
var authedUser = function($cookies){
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
}

