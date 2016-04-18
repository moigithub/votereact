/*global import export */ 
/*global twttr*/
'use strict';
import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/component.js';
import PieChart from './components/piechart.js';

import { Router, Route, Link, browserHistory, IndexRoute, Redirect} from 'react-router'
import auth from './auth';

require("./style.css");


class SuccessLogin extends React.Component {
    constructor(props){
        super(props);
        
    }
    
    componentDidMount(){
            // request user data
            auth.login(function(){
                // redirect to /
                setTimeout( ()=>{browserHistory.push('/')} ,1500);
            });
    }
    
    render(){
        return (
            <div>
                <h1>You are logged in!</h1>
                <p>...redirecting to homepage</p>
            </div>
            );
    }
    
}

class SuccessLogout extends React.Component {
    constructor(props){
        super(props);
        
    }
    
    componentDidMount(){
            // request user data
            auth.logout(function(){
                // redirect to /
                setTimeout( ()=>{browserHistory.push('/')} ,1500);
            });
    }
    
    render(){
        return (
            <div>
                <h1>Thanks for playing with us!</h1>
                <p>...redirecting to homepage</p>
            </div>
            );
    }
    
}

class Twitter extends React.Component {
    constructor(props){
        super(props);
        
    }
/*   

            
            <a  target="_blank"
                className="btn btn-default twittericon" 
                href={"https://twitter.com/intent/tweet?url="+encodeURIComponent(this.props.url)+"&"+
                    "text="+encodeURIComponent(this.props.text)}
                >
                <i className="fa fa-twitter twittericon" aria-hidden="true"></i>
                Tweet
            </a>
*/
/*
    componentDidMount(){
        
        twttr.widgets.createShareButton(
          '',
          ReactDOM.findDOMNode(this),
          {
            text: this.props.text
          }
        );
        
    }
    */
    
    render(){
        var bigStr="https://twitter.com/intent/tweet?"+
            "text="+
            encodeURIComponent(this.props.text)+
            "\n"+
            encodeURIComponent(this.props.url)+
            "&tw_p=tweetbutton";
            
        return (
            <a href={bigStr} className="btn btn-info form-control">
             <i className="fa fa-twitter twittericon" aria-hidden="true"></i> Tweet
            </a>
            );
    }
    
}

class NewPoll extends React.Component {
    constructor(props){
        super(props);
        this.postForm = this.postForm.bind(this);
        
        if(!auth.isLoggedIn()){
            alert("Login first to create new polls");
            browserHistory.push('/auth/twitter');
            
        }
    }
    
    postForm(event){
        ////{createdBy: "me", pollName:'cuatro',pollOptions:['banana','apple','orange'], usersVote:[{uid: 1, pollOption:'aple'}]},
        event.preventDefault();
        
        //console.log("newPoll postform", this.props);
        
        var userId = this.props.user.displayName;
        //console.log("new poll user", this.props.user);
        
        var name= ReactDOM.findDOMNode(this.refs.name).value;
        var options= ReactDOM.findDOMNode(this.refs.options).value;
        options = options.split("\n");
        
        
        ///TODO
        // poll should have a name
        if(name.trim().length===0){
            alert("should have a title.")
            return;
        }
        //options should have at least 1 option
        if(options.length<=1){
            alert("should have 1 option at least");
            return;
        }
        // options should be unique
        var noDupes = options.filter(function(item, index, arr){
            return arr.indexOf(item) == arr.lastIndexOf(item);
        });
        
        console.log("nodupes",noDupes);
        if (noDupes.length !== options.length){
            alert("found some duplicated options names... Cleaned!.");
            options = noDupes;
        }
        
        //console.log(name,options);
        
        var newData = {"createdBy":userId, "pollName":name, "pollOptions":options, "usersVote":[]};
        //console.log("newdata",newData);

        $.post( "/api/votes", newData ,null, "json")
          .done(function( data ) {
            // if success saved.. server send back the data posted
            // so we add it to the state options
            
            browserHistory.push('/');
          })
         .fail(function() {
                console.error( "error getting api/votes data" );
                alert("Must loggin first.");
            });

/*
        $.ajax({
            url:  "/api/votes",
            type: "POST",
            data: JSON.stringify(newData),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            cache : false,
            processData: false  
        });
  */       
        
    }
    
    render(){

        return (
            <div className="container">
            	<div id="newPollForm">
            		
            		<h2>New Poll</h2>
            		<form name="poll" method="POST" className="form-horizontal" role="form" onSubmit={this.postForm}>
                		<div className="form-group">
                			<label htmlFor="name" className="control-label">Name your poll</label>
                			<input type="text" ref="name" className="form-control" id="name" placeholder="What's your favorite brand?" required />
                        </div>
                        <div className="form-group">
                			<label htmlFor="opts" className="control-label">Options</label>
                			<div>(enter 1 option per line)</div>
                			<textarea id="opts" ref="options" className="form-control" rows="6" name="options" required/>
                        </div>

            			<button type="submit" className="btn btn-success">Submit</button>
            		</form>
            		
            	</div>
            </div>
            );
    }
}

class PollList extends React.Component {
    constructor(props){
        super(props);
        
        this.props.getAllData();
    }
    

    render(){
        var allData =this.props.allData;
        //console.log(allData);
        var pollList = allData.map(function(poll){
            return <li className = "list-group-item" key={poll._id}><Link to={{pathname:'/Poll/'+encodeURIComponent(poll.pollName), state: poll}}>{poll.pollName}</Link></li>;
        });
        return (
            <div className="container-fluid">
                <h1 className="text-center">Vote Poll</h1>
                <h2 className="text-center">Pick a poll and Vote!! or <Link to="/Poll/New">create a new one</Link></h2>
                <div className="pollList list-group">
                    <ul>{pollList}</ul>
                </div>
            
                {this.props.children && React.cloneElement(this.props.children, { getAllData: this.props.getAllData, allData: this.props.allData, selectedPool: this.props.selectedPool, user:this.props.user })}
            </div>
        );
    }
}

class MyPollList extends React.Component {
    //TODO. add delete My pool option
    
    //{createdBy: "me", pollName:'cuatro',pollOptions:['banana','apple','orange'], usersVote:{uid: 1, pollOption:'aple'}},
    constructor(props){
        super(props);
        
        this.deletePoll = this.deletePoll.bind(this);
        
        this.props.getAllData();
    }
    
    deletePoll(poll){
        //console.log("delete",poll);

        $.ajax({
            url: "/api/votes/"+poll._id,
            type: 'DELETE',
//            success: callback,
//            data: data,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            cache : false,
            processData: false  
          })
          .done(()=>{
              // redirect to refresh/remove deleted elements 
                this.props.getAllData();
                browserHistory.push('/Poll/Me');
            })
            .fail(function() {
                console.error( "error getting api/votes data" );
                alert("Must loggin first.");
            });
        
    }
    
    render(){
        //console.log("props mypolllist", this.props);
        var userId = this.props.user.displayName;
        var allData =this.props.allData.filter((data)=>{;return data.createdBy === userId;});
        //console.log("mypool data",allData, userId);
        
        var pollList = allData.map(function(poll){
            return ( 
                <li className = "list-group-item" key={poll._id}>
                    <Link to={{pathname:'/Poll/Me/'+encodeURIComponent(poll.pollName), state: poll}}>{poll.pollName} 
                    {   auth.isLoggedIn() && 
                         <button className="btn btn-danger btn-xs pull-right" onClick={this.deletePoll.bind(null,poll)}>
                             <span className="fa fa-times"></span> Delete
                         </button>
                        
                    }
                    </Link>
                </li>
            );
            
        }.bind(this));
        
        return (
            <div className="container-fluid">
                <h1 className="text-center">Vote Poll</h1>
                <h2 className="text-center">Pick a poll and Vote!! or <Link to="/Poll/New">create a new one</Link></h2>
                <div className="pollList list-group table">
                    <ul>{pollList}</ul>
                </div>
            
                {this.props.children && React.cloneElement(this.props.children, { getAllData: this.props.getAllData, allData: this.props.allData, selectedPool: this.props.selectedPool, user:this.props.user })}
            </div>
        );
    }
}


/////////**********/////////************

//////////**********////////////////

class Poll extends React.Component {
    
    constructor(props){
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.getDataByName = this.getDataByName.bind(this);
        this.checkOption = this.checkOption.bind(this);
        
        //console.log("poll constructor", this.props);
        
  /*      if(this.props.location.state){
            this.state = {
                pollData : this.props.location.state
            };
        } else {
*/            
            this.state = {
                pollData : { pollName:"",
                            createdBy:"",
                            pollOptions:[],
                }, 
                customOption: false,
                selectValue:""
            };

        //}

        //this.props.getAllData();
    }
    
    optionMsg() {return "Click here to select an Option";}

    /// [{op1:count},{"a":3},{"b":12}]
    calcVotes(data){
      
      return data.pollOptions.map(function(option){
          var votes= data.usersVote.filter(function(vote){ 
          //  console.log(vote.pollName," : ",option, vote);
            return vote.pollOption===option;
          }).length;
          
          return {name: option, count:votes};
        })
        // remove pollOptions with 0 votes
        .filter(poll=>poll.count>0)
    }
    
    // getInitialState(){} no funciona con ES6 syntax

    componentDidMount(){
        //console.log("poll did mount");
        this.setState({selectValue:this.optionMsg()});   // make the "select an option" msg appear
        
        this.getDataByName(this.props.params.pollName, function(data){
            this.setState({pollData : data});
        }.bind(this));

    }


    componentWillReceiveProps(nextProps) {
        //console.log("poll WillRecP curr ",this.props);
        //console.log("poll WillRecP next",nextProps.params.pollName, nextProps.location.state);
        
        this.setState({selectValue:this.optionMsg()});  // make the "select an option" msg appear
        
        if(nextProps.location.state) {
            this.setState({pollData: nextProps.location.state});
        } else {
            this.getDataByName(nextProps.params.pollName, function(data){
                this.setState({pollData : data});
            }.bind(this));
        }

    }
 
   
    getDataByName(name, cb){
        // SEND http request to server API
       // console.log("gettin data by name",name, "databy name loca.state",this.props.location.state);
        if(this.props.location.state){   // if have data stored on <Link>
            return cb(this.props.location.state);
        } else {        // no Link used, direct linking
            var URL = "/api/votes/pollname/"+name;
            $.get(URL)
                .done((data)=>{
                   // console.log("poll data",data[0]);
                    cb(data[0]);
                })
                .fail(function() {
                    console.error( "error getting api/votes data" );
                });
        }
            
    }
    
    handleSubmit(){
        var selectControl= this.refs.option;
        //console.log("optoin selected", selectControl,selectControl.value, "pollData", this.props.location.state);
        
        if(selectControl.value === this.optionMsg()){
            alert("Must select a valid option.");
            return;
        }
        
        var poll = this.state.pollData;
        
        var userId=this.props.user.userId;
        
        //console.log("vote poll user",this.props.user);
        
        var option = selectControl.value;
        if(selectControl.value=="Custom option"){
            option = this.refs.customOption.value;
            
            alert(option);
            
            //push option to pollOptions array
            //check to prevent duplicates
            if(poll.pollOptions.indexOf(option)===-1){
               // console.log("added new option", option);
                poll.pollOptions.push(option);
            } else {
                alert(option+" is already on the options list.");
                
            }
        }
        
        // remove user voted. and add again.. to prevent user vote more than once
        poll.usersVote=poll.usersVote.filter((vote)=>{return vote.uid!==userId});
        
        poll.usersVote.push({uid: userId, pollOption:option});
        
//console.log("polll",pool);




// save data on server
        var URL = "/api/votes/"+poll._id;
        $.ajax({
                url:URL,
                //method:"PUT",
                type:"PUT",
                data: JSON.stringify(poll),
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                cache : false,
                processData: false  
            
            })
            .done((data)=>{
                //console.log("urP",data);
                //alert("data: "+JSON.stringify(data));
                this.props.getAllData();
            })
            .fail(function() {
                console.error( "error getting api/votes data" );
                alert("Must loggin first.");
            });

        
    }
    
    
    
    checkOption(event){
        var option = event.target.value;
        
        this.setState({selectValue: option});
        
        
        //console.log("option selected",option);
        if(option ==="Custom option"){
            /// show the component
            //console.log(this.refs.customOption);
            if(!this.state.customOption)
                this.setState({customOption:true});
        } else {
            if(this.state.customOption)
                this.setState({customOption:false});
        }
    }
    
    render(){
        
        let pollData = this.state.pollData;
        // style={{marginRight: spacing + 'em'}}
        //console.log("poll render");
       // console.log("poll render",this.props.params, "\nrender polldata",pollData);
        var options = pollData.pollOptions.map((opt,i)=>{return <option value={opt} key={"opt"+i} >{opt}</option>});
        
        options.push(<option value={this.optionMsg()} key={"optz"} disabled="true" style={{display:"none"}}>{this.optionMsg()}</option>);
        
        //User Story: As an authenticated user, if I don't like the options on a poll, I can create a new option.
        if(auth.isLoggedIn()){
            //alert("adding custom");
            options.push(<option value='Custom option' key='custom1'>Custom option</option>);
        }
        
        
        var data = this.calcVotes(pollData);

        //+  window.location.hostname+"/Poll/"+pollData.pollName
         //   console.log("poll",pollData);
        return (
                    <div className="row">
                        <div className="col-md-5">
                            <h1 className="text-center">{pollData.pollName}</h1>
                            <div className="text-center"><span>By </span> {pollData.createdBy}</div>
                            <p>Pick an option:</p>
                            
                            <select className="pollOptions form-control" ref="option" value={this.state.selectValue} onChange={this.checkOption} required>
                                {options}
                            </select>
                            {  this.state.customOption &&
                                   <input type="text" className="custom form-control" placeholder="enter your custom option here" ref="customOption"/>
                            }
                            
                            <button  className="btn btn-primary btn-block" onClick={this.handleSubmit}>Submit</button>
                            <Twitter text={"FCC Vote poll | "+pollData.pollName+"\nWhats your favorite option?\n"+pollData.pollOptions.join(", ")+"\n" } 
                                url={window.location.origin+"/Poll/"+encodeURIComponent(pollData.pollName)} />
                        </div>
                        <div className="col-md-7">
                            <PieChart width={300} height={300} data={data}/>
                        </div>
                    </div>
        );
    }
}
////<Chart width="400" height="400" data={ this.calcVotes(pollData)}/>

//http://nicolashery.com/integrating-d3js-visualizations-in-a-react-app/

class Main extends React.Component {
    constructor(props){
        super(props);
        
        this.getAllData = this.getAllData.bind(this);

        this.state = {
            allData:[],
            selectedPool:{},
            user: { },
            logged:false
        };
        
    }
    
    componentDidMount() {
        this.setState({
            user: auth.getCurrentUser(),
            logged : auth.isLoggedIn()
        });
    }
    
    componentWillReceiveProps(nextProps) {
        this.setState({
            user: auth.getCurrentUser(),
            logged : auth.isLoggedIn()
        });
    }
    
// make state here.. and pass update state function to new/me/all poll
// allData state
// selectedPool state
    
    getAllData(){
        // SEND http request to server API
        //console.log("gettin all data");
        var URL = "/api/votes";
        $.get(URL)
            .done((data)=>{
                //console.log("allP",data);
                this.setState({allData:data});
            })
            .fail(function() {
                console.error( "error getting api/votes data" );
            });
            
    }

    render(){
        return (
                <div>    
                    <nav className="menu navbar navbar-default">
                        
                        <div className="navbar-header">
                          <button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#topmenu" aria-expanded="false">
                            <span className="sr-only">Toggle navigation</span>
                            <span className="icon-bar"></span>
                            <span className="icon-bar"></span>
                            <span className="icon-bar"></span>
                          </button>
                          <Link to="/" className="navbar-brand" >Home</Link>
                        </div>
                        
                        
                    { this.state.logged ? 
                        <div className="collapse navbar-collapse" id="topmenu">
                            <ul className="nav navbar-nav">
                                <li><Link to="/Poll/Me">My Poll</Link></li>
                                <li><Link to="/Poll/New">New Poll</Link></li>
                            </ul>
                            <ul className="nav navbar-nav navbar-right">
                                <li className="navbar-text">Welcome <span>{this.state.user.displayName}</span></li>
                                <li><a href="/auth/logout" className="btn"><span className="fa fa-times"></span> Logout</a></li>
                            </ul>
                        </div>
                    :
                        <div className="collapse navbar-collapse" id="topmenu">
                            <ul className="nav navbar-nav navbar-right">
                                <li className="navbar-text">Login with</li>
                                <li><a href="/auth/twitter" className="btn"><span className="fa fa-twitter"></span> Twitter</a></li>
                            </ul>
                        </div>
                    }
                    </nav>
                    
                    <div>
                        {this.props.children && React.cloneElement(this.props.children, { getAllData: this.getAllData, allData: this.state.allData, selectedPool: this.state.selectedPool, user:this.state.user })}
                    </div>
                </div>
            );
    }
}
//




////////////////////////////////////////////
function requireAuth(nextState, replace) {
    //console.log(nextState.location);
  if (!auth.isLoggedIn()) {
      /*
    replace({
      pathname: '/auth/twitter' // only work if auth/twiter if part of <Route> list
    })
    */
    window.location = "/auth/twitter";
    
    
    //router.replace({ pathname, query, state }) // new "location descriptor"
     
  }
}



//ReactDOM.render(<Main/>, document.getElementById("app"));

ReactDOM.render((
  <Router history={browserHistory}>
    <Route path="/" component={Main}>
    
        <IndexRoute component={PollList} />

        <Route path="Poll/New" component={NewPoll}  onEnter={requireAuth} />
        <Route path="Poll/Me" component={MyPollList} >
            <Route path=":pollName" component={Poll} />
        </Route>
        <Route path="Poll" component={PollList} >
            <Route path=":pollName" component={Poll} />
        </Route>

        <Route path="successLogin" component={SuccessLogin} />
        <Route path="successLogout" component={SuccessLogout} />
        
        
        <Redirect from="*" to="/" />
    </Route>
  </Router>
), document.getElementById("app"));


//      <Route path="about" component={About}/> // subroute??

//https://github.com/reactjs/react-router-tutorial/tree/master/lessons/02-rendering-a-route
/// https://medium.com/@sxywu/on-d3-react-and-a-little-bit-of-flux-88a226f328f3#.7afmsdtoh
//http://matt-harrison.com/building-a-complex-web-component-with-facebooks-react-library/