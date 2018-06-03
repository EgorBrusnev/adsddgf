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

// app.controller('ctrlDrop',function($scope,$http,$cookies,user){
// 	var dropzone = document.getElementById('drop-zone');
// 	var image = document.querySelector('img');

// 	$scope.previewFile = function(){
// 		console.log('dasda');
// 	  var file    = document.querySelector('input[type=file]').files[0];
// 	  var reader  = new FileReader();
// 	  console.log(file.type);

// 	  reader.onloadend = function () {
// 	  	var type = file.type;
// 	  	image.className = 'card-img'
// 	    image.src = 'data:image/jpeg;base64,' + btoa(reader.result);
// 	    $scope.image = reader.result;
// 	    console.log($scope.image);
// 	    user.addUser({'imageBuf':$scope.image});
// 	  }

// 	  if (file.type.match('image.*')) {
// 	    reader.readAsBinaryString(file);
// 	  } else {
// 	  	$('#img-alert').addClass('show');
// 	  	console.log('not image');
// 	    image.src = "";
// 	  }
// 	}

// 	dropzone.ondrop = function(e){
// 		e.preventDefault();
// 		var fileReader = new FileReader;
// 		var file = e.dataTransfer.items[0].getAsFile();
// 		  if (file.type.match('image.*')) {
// 		    reader.readAsBinaryString(file);
// 		  } else {
// 		  	$('#img-alert').addClass('show');
// 		  	console.log('not image');
// 		    image.src = "";

// 		  }

// 		fileReader.onloadend = function(){
// 			$scope.image = fileReader.result;
// 			image.src = 'data:image/jpeg;base64,'+btoa(fileReader.result);
// 			console.log($scope.image);
// 			user.addUser({'imageBuf': $scope.image});
// 		}
// 		if (file.type.match('image.*')) {
// 			fileReader.readAsBinaryString(file);
// 		} else {
// 			image.src = "";
// 		}
// 	}
// });

app.controller('ctrlDrop',ctrlDrop);

app.controller('ctrlForm', function($scope,$http,$location,$window,user){
	$scope.user = {};
	$scope.getuser = function(){
		console.log(user.getUser().imageBuf);

	}

	$('.close').click(function(){
		console.log('krest');
		$('.alert').removeClass('show');
	});

	$scope.registration = function(){
		console.log($scope.user);
		$scope.user.image = user.getUser().imageBuf;
		if($scope.form.$valid){
			$http.post("/registration", $scope.user).then(function(res, status) {
				console.log(res);
				console.log(res.data);
				if(res.data === true){
					var landingUrl = "http://"+ $window.location.host + "/";
					$window.location.href = landingUrl;
				}
				else{
					// $(".alert").alert('close');
					$('#alert').text(res.data);
					$('.alert').addClass('show');
				}
			})
		}
	}

	$scope.twitter = function(){
		console.log('tiwt');
		$window.location.href = "http://"+$window.location.host + "/auth/twitter"
	}
	$scope.facebook = function(){
		$window.location.href = "http://"+$window.location.host + "/auth/facebook"
	}
	$scope.vkontakte = function(){
		$window.location.href = "http://"+$window.location.host + "/auth/vkontakte"
	}

	$scope.al = function(){
		alert("AAAA");
	}
});



