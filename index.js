const express = require("express")
const httpMsgs = require("http-msgs");
const jwtLogin = require("jwt-login");
const bodyparser = require("body-parser");
const roles = require("user-groups-roles");
const app = express();
const model = require("./model");

app.listen(9000);

app.use(bodyparser.urlencoded({extended : false}));

/*
    Roles declaratations
*/ 
// roles
roles.createNewRole("admin");
roles.createNewRole("editor");
roles.createNewRole("author");
roles.createNewRole("subscriber");

// privileges
roles.createNewPrivileges(["/article", "GET"], "get article", true);
roles.createNewPrivileges(["/article", "POST"], "inserts article", false);
roles.createNewPrivileges(["/article", "PUT"], "edits article", false);
roles.createNewPrivileges(["/article", "DELETE"], "deletes article", false);

// admin all add, edit delete select
roles.addPrivilegeToRole("admin",["/article", "POST"],true);
roles.addPrivilegeToRole("admin",["/article", "PUT"],true);
roles.addPrivilegeToRole("admin",["/article", "DELETE"],true);


// editor insert, edit select
roles.addPrivilegeToRole("editor",["/article", "POST"],true);
roles.addPrivilegeToRole("editor",["/article", "PUT"],true);

// author insert
roles.addPrivilegeToRole("author",["/article", "POST"],true);

// subscriber can only select




//login html file
app.get("/login", function(req, res){
    res.sendFile(__dirname + "/html/login.html");
});

app.get("/post", function(req, res){
    res.sendFile(__dirname + "/html/post.html");
});
app.get("/put", function(req, res){
    res.sendFile(__dirname + "/html/put.html");
});

app.get("/delete", function(req, res){
    res.sendFile(__dirname + "/html/delete.html");
});

//login
app.post("/login",  function(req, res){
    var user = req.body.user
    var password = req.body.password
    if (user == password){
        jwtLogin.sign(req, res, user,"topsecret", 1, false);  
    }else{
        httpMsgs.send500(req, res, "invalid user");
    }
    
});
// logout
app.get("/logout", function(req, res){
    jwtLogin.signout(req, res, false);
});

var valid_login = function(req, res, next){
    try {
        req.jwt = jwtLogin.validate_login(req, res);
        next();
    } catch (error) {
        httpMsgs.send500(req, res, error);
        
    }

}


/*
===============================
    routes 
==============================

*/ 

app.get("/article", valid_login, function(req, res){
    var user = req.jwt.user//this the user 
    var role = model.getroles(user);
  
    var value = roles.getRoleRoutePrivilegeValue(role, "/article", "GET");
    if(value){
        httpMsgs.sendJSON(req, res,{
            from    : "get"
        });
    }else{
        httpMsgs.send500(req, res, "not allowed");
    }

});

app.post("/article", valid_login, function(req, res){
    var user = req.jwt.user//this the user 
    var role = model.getroles(user);
  
    var value = roles.getRoleRoutePrivilegeValue(role, "/article", "POST");
    if(value){
        httpMsgs.sendJSON(req, res,{
            from    : "post"
        });
    }else{
        httpMsgs.send500(req, res, "not allowed");
    }
});

app.put("/article", valid_login, function(req, res){
    var user = req.jwt.user//this the user 
    var role = model.getroles(user);
  
    var value = roles.getRoleRoutePrivilegeValue(role, "/article", "PUT");
    if(value){
        httpMsgs.sendJSON(req, res,{
            from    : "put"
        });
    }else{
        httpMsgs.send500(req, res, "not allowed");
    }
});
 
app.delete("/article", valid_login,function(req, res){
    var user = req.jwt.user//this the user 
    var role = model.getroles(user);
  
    var value = roles.getRoleRoutePrivilegeValue(role, "/article", "DELETE");
    if(value){
        httpMsgs.sendJSON(req, res,{
            from    : "DELETE"
        });
    }else{
        httpMsgs.send500(req, res, "not allowed");
    }
});
