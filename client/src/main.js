/*global import export */ 
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
            auth.login();
            // redirect to /
            setTimeout( ()=>{browserHistory.push('/')} ,1500);
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

class NewPoll extends React.Component {
    constructor(props){
        super(props);
        this.postForm = this.postForm.bind(this);
    }
    
    postForm(event){
        ////{createdBy: "me", pollName:'cuatro',pollOptions:['banana','apple','orange'], usersVote:[{uid: 1, pollOption:'aple'}]},
        event.preventDefault();
        
        var userId = this.props.user.userId;
        
        var name= ReactDOM.findDOMNode(this.refs.name).value;
        var options= ReactDOM.findDOMNode(this.refs.options).value;
        options = options.split("\n");
        //console.log(name,options);
        
        var newData = {"createdBy":userId, "pollName":name, "pollOptions":options, "usersVote":[]};
        console.log("newdata",newData);

        $.post( "/api/votes", newData ,null, "json")
          .done(function( data ) {
            // if success saved.. server send back the data posted
            // so we add it to the state options
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
        browserHistory.push('/');
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
                			<textarea id="opts" ref="options" className="form-control" name="options" required/>
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
            return <li className = "list-group-item" key={poll._id}><Link to={{pathname:'/Poll/'+poll.pollName, state: poll}}>{poll.pollName}</Link></li>;
        });
        return (
            <div className="container-fluid">
                <h1 className="text-center">Vote Poll</h1>
                <h2 className="text-center">Pick a poll and Vote!! or <Link to="/Poll/New">create a new one</Link></h2>
                <div className="pollList list-group">
                    <ul>{pollList}</ul>
                </div>
            
                {this.props.children && React.cloneElement(this.props.children, { getAllData: this.props.getAllData, allData: this.props.allData, selectedPool: this.props.selectedPool, userId:this.props.user })}
            </div>
        );
    }
}

class MyPollList extends React.Component {
    //{createdBy: "me", pollName:'cuatro',pollOptions:['banana','apple','orange'], usersVote:{uid: 1, pollOption:'aple'}},
    constructor(props){
        super(props);
        
        this.props.getAllData();
    }
    
    render(){
        var userId = this.props.user.userId;
        var allData =this.props.allData.filter((data)=>{console.log(data,userId);return data.createdBy === userId;});
        //console.log("mypool data",allData, userId);
        
        var pollList = allData.map(function(poll){
            return <li className = "list-group-item" key={poll._id}><Link to={{pathname:'/Poll/Me/'+poll.pollName, state: poll}}>{poll.pollName}</Link></li>;
            
        });
        
        return (
            <div className="container-fluid">
                <h1 className="text-center">Vote Poll</h1>
                <h2 className="text-center">Pick a poll and Vote!! or <Link to="/Poll/New">create a new one</Link></h2>
                <div className="pollList list-group table">
                    <ul>{pollList}</ul>
                </div>
            
                {this.props.children && React.cloneElement(this.props.children, { getAllData: this.props.getAllData, allData: this.props.allData, selectedPool: this.props.selectedPool, userId:this.props.user })}
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
    }
    
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
    
    handleSubmit(){
        var selectControl= this.refs.option;
        //console.log("optoin selected", selectControl,selectControl.value, "pollData", this.props.location.state);
        
        var pool = this.props.location.state;
        
        var userId=this.props.user.userId;
        
        //console.log("uid",userId);
        
        // remove user voted. and add again.. to prevent user vote more than once
        pool.usersVote=pool.usersVote.filter((vote)=>{return vote.uid!==userId});
        
        pool.usersVote.push({uid: userId, pollOption:selectControl.value});
        
console.log("polll",pool);




// save data on server
        var URL = "/api/votes/"+pool._id;
        $.ajax({
                url:URL,
                //method:"PUT",
                type:"PUT",
                data: JSON.stringify(pool),
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
            });

        
    }
    
    render(){
        
        let pollData = this.props.location.state;
        
        
        //console.log("poll render",this.props.params);
        var options = pollData.pollOptions.map((opt,i)=>{return <option value={opt} key={"opt"+i}>{opt}</option>});
        var data = this.calcVotes(pollData);

        
         //   console.log("poll",pollData);
        return (
            
                    <div className="row">
                        <div className="col-md-5">
                            <h1 className="text-center">{pollData.pollName}</h1>
                            <div className="text-center"><span>By </span> {pollData.createdBy}</div>
                            <p>Pick an option:</p>
                            
                            <select className="pollOptions form-control" ref="option">
                                {options}
                            </select>
                            <button  className="btn btn-primary btn-block" onClick={this.handleSubmit}>Submit</button>
                            
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
            user: {
                userId:"1"
            },
            logged:false
        };
        
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
                                <li>Welcome <span>{this.state.user.twitter.displayName}</span></li>
                                <li><a href="/auth/logout" class="btn btn-info"><span class="fa fa-times"></span> Logout</a></li>
                            </ul>
                        </div>
                    :
                        <div className="collapse navbar-collapse" id="topmenu">
                            <ul className="nav navbar-nav navbar-right">
                                <li><a href="/auth/twitter" class="btn btn-info"><span class="fa fa-twitter"></span> Twitter</a></li>
                            </ul>
                        </div>
                    }
                    </nav>
                    
                    <div>
                        {this.props.children && React.cloneElement(this.props.children, { getAllData: this.getAllData, allData: this.state.allData, selectedPool: this.state.selectedPool, userId:this.state.user })}
                    </div>
                </div>
            );
    }
}
//

//ReactDOM.render(<Main/>, document.getElementById("app"));

ReactDOM.render((
  <Router history={browserHistory}>
    <Route path="/" component={Main}>
    
        <IndexRoute component={PollList} />

        <Route path="Poll/New" component={NewPoll} />
        <Route path="Poll/Me" component={MyPollList} >
            <Route path=":pollName" component={Poll} />
        </Route>
        <Route path="Poll" component={PollList} >
            <Route path=":pollName" component={Poll} />
        </Route>

        <Route path="successLogin" component={SuccessLogin} />
        
        
        <Redirect from="*" to="/" />
    </Route>
  </Router>
), document.getElementById("app"));


//      <Route path="about" component={About}/> // subroute??

//https://github.com/reactjs/react-router-tutorial/tree/master/lessons/02-rendering-a-route
/// https://medium.com/@sxywu/on-d3-react-and-a-little-bit-of-flux-88a226f328f3#.7afmsdtoh