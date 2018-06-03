var app = angular.module('Account', ['ngCookies']);

app.factory('blog', function () {
	var blog = {};

	return {
		getBlog: function () {
			return blog;
		},
		addBlog: function (obj) {
			Object.assign(blog, obj);
		}
	}
})

app.controller('ctrlName', function ($scope, $cookies, $window) {
	$scope.user = {};
	console.log($cookies.getAll());
	$scope.user.name = $cookies.get('name');
	$scope.user.surname = $cookies.get('surname');
	$scope.user.image = $cookies.get('image');
	console.log($scope.user.image);

	$scope.exit = function () {
		$cookies.put('auth', false);
		$window.location.href = "http://" + $window.location.host + "/";
	}
})

app.controller('ctrlAdd', function ($scope, $http, $window, $cookies, blog) {
	var ID = function () {
		return '_' + Math.random().toString(36).substr(2, 9);
	}
	$scope.blog = {};
	$scope.blog.email = $cookies.get('email');
	blog.addBlog({ 'email': $scope.blog.email });
	$scope.blog.id = ID();
	blog.addBlog({ 'id': $scope.blog.id });
	$scope.add = function () {
		blog.addBlog({ 'name': $scope.blog.name, 'content': $scope.blog.content });
		var blogObj = blog.getBlog();
		$http.post('/blog/add', blogObj).then(function (res, status) {
			document.getElementById('success').style.visibility = "visible";
		})
	}
})

app.controller('ctrlDrop', function ($scope, $http, $cookies, blog) {
	var dropzone = document.getElementById('drop-zone');
	var image = document.querySelector('img');

	$scope.previewFile = function () {
		var file = document.querySelector('input[type=file]').files[0];
		var reader = new FileReader();

		reader.onloadend = function () {
			image.src = 'data:image/jpeg;base64,' + btoa(reader.result);
			$scope.image = reader.result;
			blog.addBlog({ 'imageBuf': $scope.image });
		}

		if (file.type.match('image.*')) {
			reader.readAsBinaryString(file);
		} else {
			image.src = "";
		}
	};

	dropzone.ondrop = function (e) {
		e.preventDefault();
		this.className = 'upload-drop-zone';
		$cookies.put('blogId', blog.getBlog().id, { 'path': '/' });
		var fileReader = new FileReader;
		var file = e.dataTransfer.items[0].getAsFile();

		fileReader.onloadend = function () {
			image.src = 'data:image/jpeg;base64,' + btoa(fileReader.result);
			$scope.image = fileReader.result;
			blog.addBlog({ 'imageBuf': $scope.image })
		}
		fileReader.readAsBinaryString(file);

	}
});

app.controller('ctrlMyblogs', function ($scope, $http, $cookies) {

	$scope.blogs = {};
	var email = $cookies.get('email');
	$http.post('/blog/myblogs', email).then(function (res, status) {
		console.log(res.data);
		$scope.blogs = res.data;
	})
})
app.directive('createBlog', function () {
	return {
		templateUrl: '/templates/create_blog.html'
	}
})

app.directive('navbar', function () {
	return {
		templateUrl: '/templates/navbar.html'
	}
});

app.controller('ctrlForm',ctrlForm);

app.controller('ctrlUser',ctrlUser);	

app.directive("authedUser",authedUser)