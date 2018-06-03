var app = angular.module('Main',['ngCookies','ngRoute']);

app.config(function($locationProvider){
	$locationProvider.html5Mode({
		enabled: true,
		requireBase: false
	})
})

// app.factory('pager',function($window){
// 	var currentPage = 1;
// 	var blogsPerPage = 3;
// 	return{
// 		getPageBlogs: function(page){
// 			if(page == undefined) page = 0;
// 			currentPage = page;
// 			var first = currentPage*blogsPerPage;
// 			var last = first+blogsPerPage;
// 		}


// 	}

// })

app.controller('ctrlSearch',ctrlSearch);

app.controller('ctrlBlog',function($scope,$http,$location,$window){
	$scope.blogs = {};
	$scope.totalPages = [];
	$scope.blogsPerPage = 3;
	$scope.getPages = function(total){
		$scope.pagesCount = total;
		console.log($scope.pagesCount);
		for (var i = 0; i < $scope.pagesCount ; i++) {
			$scope.totalPages.push(i+1);
		}
	console.log($scope.totalPages);
	}

	var page = $location.search().page;
	if(page == undefined){
		$scope.currentPage = 0;
	}
	else
	{
		$scope.currentPage = page-1;
	}
});

app.directive('navbar',function(){
	return{
		templateUrl: '/templates/navbar.html'
	}
});

app.controller('ctrlForm',ctrlForm);

app.controller('ctrlUser',ctrlUser);


app.directive('authedUser',authedUser);