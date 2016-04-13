'use strict';
/*global localStorage*/

var user={};

module.exports = {
    login:function(){
        $.get("/api/users/")
            .done((data)=>{
                user = data;
                localStorage.token = data._id;
                localStorage.userName = data.displayName;
                console.log(data);
                //this.setState({user: JSON.stringify(data)});
            })
            .fail(function() {
                console.error( "users/ error getting api/votes data" );
                user = {};
            });
        
    },
    logout:function(){
        $.get("/auth/logout")
            .done((data)=>{
                user={};
                delete localStorage.token;
                delete localStorage.userName;
                console.log("logged out");
            })
            .fail(function() {
                console.error( "auth/logout error getting api/votes data" );
            });        
    },
    getCurrentUser:function(){
        return user;
    },
    isLoggedIn:function(){
        return !!localStorage.token;
        /*;
        $.get("/api/users/isLogged")
            .done((data)=>{
                this.setState({status:data});
            })
            .fail(function() {
                console.error( "isLogged error getting api/votes data" );
            });
        
    */
    }
};



/*
localStorage.colorSetting = '#a4509b';
localStorage['colorSetting'] = '#a4509b';
localStorage.setItem('colorSetting', '#a4509b');

localStorage.getItem('bgcolor')

	storage.removeItem(x);
*/