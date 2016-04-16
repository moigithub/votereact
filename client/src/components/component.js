/*
'use strict';

import React from 'react';

class App extends React.Component {
    constructor(){
        super();
        
        this.state = {
            messages: ["hello", "world","boo"]
        };
    }
    
    render(){
        //debugger;
        var MessagesNodes = this.state.messages.map((msg)=>{
            return (
                <div>{msg}</div>
                );
        });
        return (
            <div>
                {MessagesNodes}
            </div>
            );
    }
}

//
export default App;
*/