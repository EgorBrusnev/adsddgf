var Dropbox = require('dropbox');
var dbx = new Dropbox({ accessToken: 'XvEnlTYcjLAAAAAAAAAACMRgd1tqkSh8Gfh3y_z6hicLnJNrXQeD9nMN9SjRByES' });
var mysql = require('mysql');

var pool = mysql.createPool({
	host: "localhost",
	user: "root",
	password: "",
	database: "database"
});

exports.isLogined = function (req) {
	if (req.cookies.auth == 'true') {
		return true;
	}
	else {
		return false;
	}
}

exports.deleteBlog = function (req, res, text) {
	deleteBlogDatabase(text);
	deleteImage(req, text);
	res.redirect('/blog/myblogs');
}

var deleteBlogDatabase = function (blog) {
	console.log(blog);
	blog = JSON.parse(blog);
	var q = '';
	blog.forEach(function (item, i, arr) {
		q += ", '" + item + "'";
	});
	console.log("DELETE FROM `test` WHERE post_id IN(''" + q + ")");
	pool.getConnection(function (error, connection) {
		connection.query("DELETE FROM `test` WHERE post_id IN(''" + q + ")", function (err, result) {
			if (err) throw err;
		});
	})
}

var deleteImage = function (req, blog) {
	var path = [];
	blog = JSON.parse(blog);
	var email = req.cookies.email;
	blog.forEach(function (item, i, arr) {
		path.push({ 'path': '/' + email + '/' + item });
	});
	console.log(path[0]);
	console.log(email);
	dbx.filesDeleteBatch({ 'entries': path })
		.then(function (response) {
			console.log(response);
		})
		.catch(function (err) {
			console.log(err);
		})
}

exports.addBlog = function (req, res) {
	var text = '';
	req.on('data', function (data) {
		text += data;
	});
	req.on('end', function (resd) {
		text = JSON.parse(text);
		uploadImage(res, text.id, text.email, text.name, text.tag, text.content, text.imageBuf);
	});
};

exports.deleteUser = function (req, res) {
	var text = '';
	req.on('data', function (data) {
		text += data;
	});
	req.on('end', function (resd) {
		pool.getConnection(function (error, connection) {
			connection.query("DELETE FROM `users` email = '" + text + "'", function (err, result) {
				if (err) throw err;
				res.send(true);
			})
		})
	})
};

exports.blockUser = function (req, res) {
	var text = '';
	req.on('data', function (data) {
		text += data;
	});
	req.on('end', function (resd) {
		console.log(text);
		text = JSON.parse(text);
		console.log(text.status);
		console.log(!text.status)
		// pool.getConnection(function(error,connection){
		// 	connection.query("UPDATE",function(err,result){
		// 		if(err) throw err;
		// 		res.send(true);
		// 	})
		// })
	})
}

exports.table = function (req, res) {
	if (req.cookies.role == 'admin') {
		pool.getConnection(function (error, connection) {
			connection.query("SELECT * FROM users", function (err, result) {
				if (err) throw err;
				res.render('user/table/index', { 'users': result });
			})
		})
	}
	else {
		res.redirect('/');
	}
}

exports.getAllContent = function (res, path) {
	pool.getConnection(function (error, connection) {
		connection.query("SELECT * FROM `test` WHERE 1", function (err, result) {
			res.render('user/account/' + path + '/index', { 'blogs': result });
		})
	})
}

exports.getContent = function (res, username, path) {
	pool.getConnection(function (error, connection) {
		connection.query("SELECT * FROM `test` WHERE user_name='" + username + "'", function (err, result) {
			res.render('user/account/' + path + '/index', { 'blogs': result });
		})
	})
}


exports.addUser = function (res, text) {
	if (text.image == undefined) {
		buffer = '';
	}
	else {
		buffer = new Buffer(text.image, 'binary');
	}
	pool.getConnection(function (error, connection) {
		connection.query("SELECT * FROM users WHERE email = '" + text.email + "'", function (error, result) {
			if (error) throw error
			if (result.length) {
				res.send('User with this email is already exists');
			}
			else {
				var user_folder = '/' + text.email;
				dbx.filesCreateFolder({ path: user_folder });
				if (buffer != '') {
					dbx.filesUpload({
						contents: buffer,
						path: '/' + text.email + '/userImage.jpg',
						autorename: false,
						mute: true
					})
						.then(function (response) {
							dbx.sharingCreateSharedLink({ path: response.path_display })
								.then(function (resp) {
									var url = resp.url.slice(0, -4) + 'raw=1';
									addUserToDatabase(connection, res, text, url);
								})
								.catch(function (err) {
									console.log(err);
								});
						})
						.catch(function (err) {
							console.log(err);
						})
				}
				else {
					addUserToDatabase(connection, res, text, '');
				}
			}
		});
	});
}

exports.updateBlog = function (res, text) {
	if (text.image == undefined) {
		updateBlogDatabase(res, text, '');
	}
	else {
		buffer = new Buffer(text.image, 'binary');
		dbx.filesUpload({
			contents: buffer,
			path: '/' + text.email + '/' + text.post_id + '/blogImage.jpg',
			mode: { '.tag': 'overwrite' },
			autorename: false,
			mute: true
		})
			.then(function (response) {
				dbx.sharingCreateSharedLink({ path: response.path_display })
					.then(function (resp) {
						var url = resp.url.slice(0, -4) + 'raw=1';
						updateBlogDatabase(res, text, url);
					})
					.catch(function (err) {
						console.log(err);
					});
			})
			.catch(function (err) {
				console.log(err);
			})
	}
}

var updateBlogDatabase = function (res, text, url) {
	var imgQ;
	if (url == '') {
		imgQ = "";
	}
	else {
		imgQ = ", `image`='" + url + "'";
	}
	pool.getConnection(function (error, connection) {
		connection.query("UPDATE `test` SET `name`='" + text.name + "',`tag`='" + text.tag + "',`content`='" + text.content + "',date=CURRENT_TIMESTAMP() " + imgQ + " WHERE post_id='" + text.post_id + "'", function (err, result) {
			if (err) throw err;
			res.send(true);
		})
	})
}

exports.updateUser = function (res, text) {

	if (text.image == undefined) {
		updateUserDatabase(res, text, '');
	}
	else {
		buffer = new Buffer(text.image, 'binary');
		dbx.filesUpload({
			contents: buffer,
			path: '/' + text.email + '/userImage.jpg',
			mode: { '.tag': 'overwrite' },
			autorename: false,
			mute: true
		})
			.then(function (response) {
				dbx.sharingCreateSharedLink({ path: response.path_display })
					.then(function (resp) {
						var url = resp.url.slice(0, -4) + 'raw=1';
						updateUserDatabase(res, text, url);
					})
					.catch(function (err) {
						console.log(err);
					});
			})
			.catch(function (err) {
				console.log(err);
			})
	}
}

var updateUserDatabase = function (res, text, url) {
	pool.getConnection(function (error, connection) {
		connection.query("UPDATE `users` SET `email`='" + text.email + "',`password`='" + text.password + "',`name`='" + text.name + "',`surname`='" + text.surname + "',`isBlocked`= 'false',`image`= '" + url + "' WHERE email='" + text.email + "'", function (err, result) {
			if (err) throw err;
			console.log('succ query');
			res.cookie('email', text.email);
			res.cookie('name', text.name);
			res.cookie('surname', text.surname);
			res.cookie('image', url);
			res.send(true);
		})
	})
}

var uploadImage = function (res, id, email, name, tag, content, imageBuf) {
	var buffer;
	if (imageBuf == undefined) {
		addBlogToDatabase(res, id, email, name, tag, content, '');
	}
	else {
		buffer = new Buffer(imageBuf, 'binary');
		dbx.filesUpload({
			contents: buffer,
			path: '/' + email + '/' + id + '/blogImage.jpg',
			autorename: false,
			mute: true
		})
			.then(function (response) {
				dbx.sharingCreateSharedLink({ path: response.path_display })
					.then(function (resp) {
						var url = resp.url.slice(0, -4) + 'raw=1';
						console.log(resp.url.slice(0, -4) + 'raw=1');
						addBlogToDatabase(res, id, email, name, tag, content, url);
					})
					.catch(function (err) {
						console.log(err);
					});
			})
			.catch(function (err) {
				console.log(err);
			})
	}
}

var addBlogToDatabase = function (res, id, email, name, tag, content, image) {
	pool.getConnection(function (error, connection) {
		connection.query("INSERT INTO `test` (`post_id`, `user_name`, `name`, `tag`, `content`,`image`,`date`) VALUES ('" + id + "', '" + email + "', '" + name + "', '" + tag + "', '" + content + "', '" + image + "', CURRENT_DATE());", function (error, result) {
			if (error) {
				throw error;
			}
			res.send(true);
		})
	})
}


var addUserToDatabase = function (connection, res, text, url) {
	connection.query("INSERT INTO `users` (`email`, `password`, `id`, `name`, `surname`, `isBlocked`,`image`) VALUES ('"
		+ text.email + "', '" + text.password + "', NULL, '" + text.first_name + "', '" + text.surname + "', 'false','" + url + "');",
		function (error, result) {
			if (error) throw error;
			res.cookie('auth', 'true');
			res.cookie('name', text.first_name);
			res.cookie('surname', text.surname);
			res.cookie('email', text.email);
			res.cookie("image", url);
			res.send(true);
		});
}

