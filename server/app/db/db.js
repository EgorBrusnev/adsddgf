
const isExist = function(user,all_users){
	user = JSON.parse(user);
	user.flag = false;
	all_users.forEach(function(item,i,all_users){
		console.log(item.email+" : "+user.email);
		console.log(item.password+" : "+user.password);
		if(item.email == user.email){
			if(item.password == user.password){
				user.flag = true;
				user.name = item.name;
				user.surname = item.surname;
			}
		}
	});
	return user;
}


const addUser = function(user,all_users){
	flag = true;
	console.log(user.email);
	console.log(all_users[1].email);
	all_users.forEach(function(item,i,all_users){
		console.log(item.email+" "+user.email);
		if(user.email == item.email){
			flag = false;
			return;
		}
	});
	console.log("db flag="+flag);
	return flag;

}

exports.isExist = isExist;
exports.addUser = addUser;