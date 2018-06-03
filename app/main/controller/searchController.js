var ctrlSearch = function($scope,$window){
	$scope.search = function(){
		console.log($scope.request);
		$window.location.href='http://'+$window.location.host+'/search?q='+$scope.request;
	}
}