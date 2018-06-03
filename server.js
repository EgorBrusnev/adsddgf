var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var mysql = require('mysql');
var formidable = require('formidable');
var Dropbox = require('dropbox');
var fs = require('fs');
var cookieParser = require('cookie-parser')
var multiparty = require('multiparty');
var passport = require('passport');
var config = require('./oauth.js');
var init = require('./init.js');
var session = require('express-session');
var index = require("./server/app/routes/index");


var dbx = new Dropbox({ accessToken: 'XvEnlTYcjLAAAAAAAAAACMRgd1tqkSh8Gfh3y_z6hicLnJNrXQeD9nMN9SjRByES' });

var pool = mysql.createPool({
	host: "localhost",
	user: "root",
	password: "",
	database: "database"
});

var passportTwitter = require('./twitter.js');
var passportFacebook = require('./facebook.js');
var passportVK = require('./vk.js');

app.use(session({
	secret: 'keyboard cat',
	resave: true,
	saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());


app.use(cookieParser());

app.set('views', './views');

app.set('view engine', 'jade');

app.use('/node_modules', express.static('node_modules'));
app.use('/views', express.static('views'));
app.use('/templates', express.static('templates'));
app.use('/controllers', express.static('controllers'));

app.get('/auth/vkontakte', passport.authenticate('vkontakte'));

app.get('/auth/vkontakte/callback', passport.authenticate('vkontakte', { failureRedirect: '/' }), function (req, res) {
	console.log(req.user);
	pool.getConnection(function (error, connection) {
		connection.query("SELECT * FROM users WHERE email ='" + req.user.id + "'", function (err, result) {
			if (err) throw err;
			if (!result.length) {
				connection.query("INSERT INTO `users` (`email`, `password`, `id`, `name`, `surname`, `isBlocked`,`image`) VALUES ('" + req.user.id + "', '" + '********' + "', NULL, '" + req.user.name.givenName + "', '" + req.user.name.familyName + "', 'false','" + req.user.photos[0].value + "')",
					function (er, rest) {
						if (er) throw error;
					});
			}
			res.cookie('auth', 'true');
			res.cookie('name', req.user.name.givenName);
			res.cookie('surname', req.user.name.familyName);
			res.cookie('email', req.user.id);
			res.cookie('image', req.user.photos[0].value);
			res.redirect('/');
		})
	})
});

app.get('/auth/twitter', passportTwitter.authenticate('twitter'));

app.get('/auth/twitter/callback',
	passportTwitter.authenticate('twitter', { failureRedirect: '/' }),
	function (req, res) {
		var user = req.user[0];
		console.log(req.user[0]);
		console.log("auth/twit::: " + req.user[0] + " status: " + req.user[0].name);
		pool.getConnection(function (error, connection) {
			connection.query("SELECT * FROM users WHERE email ='" + user.email + "'", function (err, result) {
				if (err) throw err;
				if (!result.length) {
					connection.query("INSERT INTO `users` (`email`, `password`, `id`, `name`, `surname`, `isBlocked`,`image`) VALUES ('" + user.email + "', '" + user.password + "', NULL, '" + user.name + "', '" + user.surname + "', 'false','" + user.photo + "')",
						function (er, rest) {
							if (er) throw error;
						});
				}
				res.cookie('auth', 'true');
				res.cookie('name', user.name);
				res.cookie('surname', user.surname);
				res.cookie('email', user.email);
				res.cookie('image', user.photo);
				res.redirect('/');
			})
		})
	});

app.get('/auth/facebook',
	passportFacebook.authenticate('facebook'));

app.get('/auth/facebook/callback',
	passportFacebook.authenticate('facebook', { failureRedirect: '/' }),
	function (req, res) {
		var user = req.user[0];
		console.log(req.user[0]);
		console.log("auth/twit::: " + req.user[0] + " status: " + req.user[0].name);
		pool.getConnection(function (error, connection) {
			connection.query("SELECT * FROM users WHERE email ='" + user.email + "'", function (err, result) {
				if (err) throw err;
				if (!result.length) {
					connection.query("INSERT INTO `users` (`email`, `password`, `id`, `name`, `surname`, `isBlocked`,`image`) VALUES ('" + user.email + "', '" + user.password + "', NULL, '" + user.name + "', '" + user.surname + "', 'false','" + user.photo + "')",
						function (er, rest) {
							if (er) throw error;
						});
				}
				res.cookie('auth', 'true');
				res.cookie('name', user.name);
				res.cookie('surname', user.surname);
				res.cookie('email', user.email);
				res.cookie('image', user.photo);
				res.redirect('/');
			})
		})
	});


app.get('/', function (req, res) {
	var currentPage = '';
	var allBlogs = [];
	console.log(req.query.page);
	if (req.query.page == undefined) {
		currentPage = 0;
	}
	else {
		currentPage = req.query.page - 1;
	}
	var blogPerPage = 3;
	var first = currentPage * blogPerPage;
	console.log('currentPage=' + currentPage);
	var totalPageCount;
	var totalPages = [];
	pool.getConnection(function (error, connection) {
		connection.query("SELECT COUNT(*) FROM test", function (error, result) {
			if (error) {
				throw error;
			}
			totalPageCount = Math.ceil(result[0]['COUNT(*)'] / blogPerPage);
			console.log('totalPageCount=' + totalPageCount);
			for (var i = 0; i < totalPageCount; i++) {
				totalPages.push(i + 1);
			}
			connection.query("SELECT * FROM test ORDER BY date DESC LIMIT " + first + ", " + blogPerPage, function (err, result) {
				res.render('main/index', { 'blogs': result, 'title': 'Latest blogs', 'totalPages': totalPageCount });
			});

		});

	});
});

app.get('/user/update', function (req, res) {
	res.sendFile('views/user/update/index.html', { root: __dirname });
})
app.post('/user/update', function (req, res) {
	var text = '';
	req.on('data', function (data) {
		text += data;
	});
	req.on('end', function (resd) {
		text = JSON.parse(text);
		index.updateUser(res, text);
	})
})

app.get('/registration', function (req, res) {
	res.sendFile('views/registration/index.html', { root: __dirname });
});
app.get('/account', function (req, res) {
	if (req.cookies.role == 'admin') {
		res.sendFile('views/user/account/admin.html', { root: __dirname });
	}
	else {
		res.sendFile('views/user/account/index.html', { root: __dirname });
	}

});
app.get('/blog', function (req, res) {
	var blogId = req.query.id;
	var user_email = req.cookies.email;
	var user_name = req.cookies.name;

	io.once('connection', function (socket) {
		socket.join('/blog/' + blogId);
		socket.broadcast.emit('new_User', socket.id);
		socket.emit('userName', socket.id);
		socket.on('send', function (msg) {
			pool.getConnection(function (error, connection) {
				connection.query("INSERT INTO `comments` (`user_email`, `name`, `post_id`, `content`) VALUES ('" + user_email + "','" + user_name + "','" + blogId + "','" + msg + "')",
					function (err, result) {
						if (err) throw err;
						io.sockets.in('/blog/' + req.query.id).emit('send_comment', user_email, user_name, msg);
					});
			});
		});
	});

	var blog = {};
	console.log('/blog');
	console.log(req.query.id);
	pool.getConnection(function (error, connection) {
		connection.query("SELECT * FROM `test` WHERE `post_id` = '" + req.query.id + "'", function (err, resul) {
			if (err) throw err;
			blog = resul;
			connection.query("SELECT * FROM `comments` WHERE `post_id` = '" + req.query.id + "' ORDER BY date DESC", function (er, result) {
				if (er) throw er;
				res.render('blog/index', { 'blog': blog[0], 'comments': result });
			});
		});
	});
});

app.get('/blog/delete', function (req, res) {
	if (!index.isLogined(req)) {
		res.redirect('/');
	}
	else if (req.cookies.role == 'admin') {
		index.getAllContent(res, 'delete');
	}
	else {
		index.getContent(res, req.cookies.email, 'delete');
	}
});
app.get('/table', index.table);

app.post('/table/delete', index.deleteUser);
app.post('/table/block', index.blockUser);

app.post('/blog/delete', function (req, res) {
	var text = '';
	req.on('data', function (data) {
		text += data;
	});
	req.on('end', function (resd) {
		if (text !== '') {
			index.deleteBlog(req, res, text);
		}
		else {
			res.redirect('/blog/myblogs');
		}
	})
})

app.get('/blog/update', function (req, res) {
	if (!index.isLogined(req)) {
		res.redirect('/');
	}
	else {
		if (req.query.id == undefined) {
			index.getContent(res, req.cookies.email, 'edit');
		}
		else {
			pool.getConnection(function (error, connection) {
				connection.query("SELECT * FROM test WHERE post_id='" + req.query.id + "'", function (err, result) {
					if (req.cookies.email != result[0].user_name) {
						res.redirect('/');
					}
					else {
						res.render('user/account/edit/edit', { 'blog': result[0] });
					}
				})
			});
		}
	}

});
app.get('/blog/update', function (req, res) {
	if (!index.isLogined(req)) {
		res.redirect('/');
	}
	else {
		if (req.query.id == undefined) {
			index.getContent(res, req.cookies.email, 'edit');
		}
		else {
			pool.getConnection(function (error, connection) {
				connection.query("SELECT * FROM test WHERE 1", function (err, result) {
					res.render('user/account/edit/edit', { 'blog': result[0] });
				})
			});
		}
	}

});
app.post('/blog/update', function (req, res) {
	var text = '';
	req.on('data', function (data) {
		text += data;
	});
	req.on('end', function (resd) {
		text = JSON.parse(text);
		console.log(text);
		index.updateBlog(res, text);
	});
});


app.get('/search', function (req, res) {
	var blogPerPage = 3;
	pool.getConnection(function (error, connection) {
		connection.query("SELECT * FROM `test` WHERE MATCH(name, content, tag) AGAINST('*" + req.query['q'] + "*' IN BOOLEAN MODE)", function (err, result) {
			if (err) throw err;
			totalPages = Math.ceil(result.length / blogPerPage);
			res.render('main/index', { 'blogs': result, 'title': 'Search Results', 'totalPages': totalPages });
		})
	})
})



app.post('/blog/rating', function (req, res) {
	var text = '';
	req.on('data', function (data) {
		text += data;
	});
	req.on('end', function (resd) {
		text = JSON.parse(text);
		pool.getConnection(function (error, connection) {
			connection.query("INSERT INTO `rate`( `post_id`, `user_id`, `rate`) VALUES ('" + text.blogid + "','" + text.user + "','" + text.value + "') ON DUPLICATE KEY UPDATE rate = VALUES(rate)", function (err, resu) {
				if (err) throw e;
				connection.query("SELECT AVG(rate) AS rate FROM `rate` WHERE post_id='" + text.blogid + "'", function (er, res_t) {
					if (er) throw er;
					connection.query("UPDATE `test` SET rate = " + res_t[0].rate + " WHERE post_id = '" + text.blogid + "'", function (e, rest) {
						if (e) throw e;
						res.send('' + res_t[0].rate);
					});
				});
			});
		});
	})
})

app.post('/registration', function (req, res) {
	var text = '';
	var user = {};
	req.on('data', function (data) {
		text += data;
	});
	req.on('end', function (resd) {
		var buffer;
		text = JSON.parse(text);
		var flag = false;
		index.addUser(res, text);
	})
});
app.get('/blog/add', function (req, res) {
	if (!index.isLogined(req)) {
		res.redirect('/');
	}
	else {
		res.sendFile('/views/user/account/add/index.html', { root: __dirname });
	}
});
app.get('/blog/myblogs', function (req, res) {
	if (!index.isLogined(req)) {
		res.redirect('/');
	}
	else if (req.cookies.role == 'admin') {
		index.getAllContent(res, 'read');
	}
	else {
		var username = req.cookies.email;
		index.getContent(res, username, 'read');
	}
});




app.post('/blog/add', index.addBlog);

app.post('/blog/myblogs', function (req, res) {
	var text = '';
	req.on('data', function (data) {
		text += data;
	});
	req.on('end', function (resd) {
		pool.getConnection(function (error, connection) {
			connection.query("SELECT * FROM `test` WHERE `user_name` = '" + text + "' ", function (error, result) {
				if (error) {
					console.log(error);
				}
				else {
					res.send(result);
				}
			})
		})
	})
})


app.post('/auth', function (req, res) {
	var text = '';
	var flag = false;
	req.on('data', function (data) {
		text += data;
	});
	req.on('end', function (resd) {
		console.log(text);
		text = JSON.parse(text);
		pool.getConnection(function (error, connection) {
			connection.query("SELECT * FROM users WHERE email = '" + text.email + "'", function (error, result) {
				if (error) throw error;
				if (!result.length) {
					res.send("No such user");
				}
				else {
					if (text.password == result[0].password) {
						console.log("/auth result");
						console.log(result[0]);
						res.cookie('auth', 'true');
						res.cookie('name', result[0].name);
						res.cookie('surname', result[0].surname);
						res.cookie('email', result[0].email);
						res.cookie('image', result[0].image);
						res.cookie('role', result[0].role);
						res.send(true);
					}
					else {
						res.send('Wrong email or password');
					}
				}
			});
		});
	});
});

server.listen(8080);
console.log('Server starts on 8080');