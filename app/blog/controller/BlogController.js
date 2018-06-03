var app = angular.module("Blog",['ngCookies'],function($locationProvider){
    $locationProvider.html5Mode({
	  enabled: true,
	  requireBase: false
	});
});

app.factory('socket',['$rootScope',function($rootScope){
	var socket = io.connect();
	return{
		on: function(eventName, callback){
			socket.on(eventName,function(){
				var args = arguments;
				$rootScope.$apply(function(){
					callback.apply(socket, args);
				});
			});
		},
		emit: function(eventName, data, callback){
			socket.emit(eventName, data, function(){
				var args = arguments;
				$rootScope.$apply(function(){
					if(callback){
						callback.apply(socket,args);
					}
				});
			});
		},
	}
}]);

app.service('rate',function($http,$location,$cookies){
	var send_rating = function(value){
		console.log(value);
		var expireDate = new Date();
	  	expireDate.setDate(expireDate.getDate() + 365);
	  	blogid = $location.search().id;
	  	user = $cookies.get('email');
		console.log($location.search().id);
		$cookies.put(blogid,value,{
			'expires': expireDate
		});	
		$http.post('/blog/rating',{'user':user,'blogid':blogid,'value':value}).then(function(res,status){
			console.log(res.data);
			$("#input-id").rating('update',res.data);
		});
	}


	$("#input-id").on('rating.change',function(event,value,caption,target){
		send_rating(value);
	});
	return{
		// loadStars: function(){
		// 	$("#input-id").rating({
		// 		theme: 'krajee-fa'
		// 	});
		// }
	}
});


app.controller('ctrlName',function($scope,$cookies,$window){
	$scope.user = {};
	console.log($cookies.getAll());
	$scope.user.name = $cookies.get('name');
	$scope.user.surname = $cookies.get('surname');
});

app.controller('ctrlForm',ctrlForm);

app.controller('ctrlBlog',function($scope,$cookies,$window,rate){
	$scope.getRating = function(rate){
		console.log(rate);
		$("#input-id").rating('update',rate);
		// $("#input-id").rating('refresh',{
		// 	theme: 'krajee-fa',
		// 	readonly: rate
		// });
	}
	$scope.disabled = '';
	if($cookies.get('auth') == undefined){
		console.log('not authed');
		angular.element('textarea').attr('disabled',$scope.disabled);

		$("#input-id").rating('refresh',{
			theme: 'krajee-fa',
			readonly: true
		});
		$scope.disabled = 'disabled';
	}

	console.log($cookies.get('auth'));
	$scope.exit = function(){
		$scope.disabled = 'disabled';
		angular.element('textarea').attr('disabled','disabled');
		$cookies.remove('auth');
		$cookies.remove('name');
		$cookies.remove('email');
		$cookies.remove('surname');
		$cookies.remove('image');
		$window.location.reload();
	}
});

var ctrlUser = function($scope,$http,$cookies){
	$scope.user = {};
	$scope.user.name = $cookies.get('name');
	$scope.user.surname = $cookies.get('surname');
	$scope.user.image = $cookies.get('image');
}

app.controller('ctrlUser',ctrlUser);



app.controller('ctrlComments',function($scope,$cookies,$compile,socket){
	var comm = {};

	socket.on('userName',function(userName){
		console.log(userName);
	});
	socket.on('send_comment',function(email, name, msg){
		console.log('sendcomment');
		// console.log(email+" "+name+" "+msg);
	});
	$scope.send_comment = function(){
		if($scope.comment == undefined || $scope.comment == '') return;
		console.log($scope.comment);
		angular.element('.comments').prepend($compile('<single-comment getcomment="getComment()" />')($scope));
		socket.emit('send',$scope.comment);
	}
	$scope.getComment = function(){
		comm.content = $scope.comment;
		comm.name = $cookies.get('name');
		comm.date = new Date();
		return comm;
	}
});


app.directive('singleComment',function(){
	return{
		scope: {
			getComment: '&getcomment'
		},
		link: function(scope,el,attr){
			var temp = scope.getComment();
			scope.name = temp.name;
			scope.content = temp.content;
			scope.date = temp.date.toLocaleString();
		},
		templateUrl: '/templates/single_comment.html'
	}
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
