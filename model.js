var usersRoles = {
    adminRavi   : "admin",
    editorRavi  : "editor",
    authorRavi  : "author",
    subravi     : "subscriber"
}

module.exports.getroles = function(user){
    return usersRoles[user];
}


