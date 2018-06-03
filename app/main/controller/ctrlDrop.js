var ctrlDrop = function($scope,$http,$cookies,user){
    var dropzone = document.getElementById('drop-zone');
    var image = document.querySelector('img');

    $scope.previewFile = function(){
        console.log('dasda');
      var file    = document.querySelector('input[type=file]').files[0];
      var reader  = new FileReader();
      console.log(file.type);

      reader.onloadend = function () {
        var type = file.type;
        image.className = 'card-img';
        image.src = 'data:image/jpeg;base64,' + btoa(reader.result);
        $scope.image = reader.result;
        console.log($scope.image);
        user.addUser({'imageBuf':$scope.image});
      }

      if (file.type.match('image.*')) {
        reader.readAsBinaryString(file);
      } else {
        $('#img-alert').addClass('show');
        console.log('not image');
        image.src = "";
      }
    }

    dropzone.ondrop = function(e){
        e.preventDefault();
        var fileReader = new FileReader;
        var file = e.dataTransfer.items[0].getAsFile();
          if (file.type.match('image.*')) {
            fileReader.readAsBinaryString(file);
          } else {
            $('#img-alert').addClass('show');
            console.log('not image');
            image.src = "";

          }

        fileReader.onloadend = function(){
            $scope.image = fileReader.result;
            image.src = 'data:image/jpeg;base64,'+btoa(fileReader.result);
            console.log($scope.image);
            user.addUser({'imageBuf': $scope.image});
        }
        if (file.type.match('image.*')) {
            fileReader.readAsBinaryString(file);
        } else {
            image.src = "";
        }
    }
}