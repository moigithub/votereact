'use strict';
import React from 'react';
import ReactDOM from 'react-dom';
import d3 from 'd3';

class Slice extends React.Component {
    constructor(props){
        super(props);
    }
/*
    update(selection, props){
        console.log("slice update data",this.props);
        var color = this.props.colors;
        var arc = d3.svg.arc()
            .outerRadius(props.width/2.2)
            .innerRadius(props.width/8);

        selection
            .data([props.data])  /// MUST be datum.. no data.. or data([ dataVariable ])
            ///.call(this.update); // move all below on another function(selection)  ... and use:::: selection.   select("path").etc
            .select("path")
            .transition()
            .duration(500)
            .attrTween('d', function(d) {
                 var i = d3.interpolate(d.startAngle, d.endAngle);
                 return function(t) {
                     d.endAngle = i(t);
                   return arc(d);
                 }
            });
    }

    componentDidMount() {
 //       this.d3Node = d3.select(ReactDOM.findDOMNode(this));
//        this.update(this.d3Node, this.props);
    }
    
    componentDidUpdate() {
        // recibe un pie {startAngle, endAngle padAngle etc}
//        console.log("did update ONE SLICE ", this.d3Node);
//        this.update(this.d3Node, this.props);
            
    }    
*/    

    render() {

        var arc = d3.svg.arc()
            .outerRadius(this.props.width/2.2)
            .innerRadius(this.props.width/8);
            
        var data = this.props.data;
        var center = "translate(" + arc.centroid(data) + ")";
        //console.log("data", data, "\ncentroid ",arc.centroid(data),"\narc",arc(data));
        //var percentCenter = "translate(0,3)";
        var color = this.props.colors;
        
        return (
          <g className="slice">
            <path className="slicePath" fill={color(this.props.ikey)} ></path>
            <text className="sliceText" transform={center} textAnchor="middle" >{data.data.name+" ("+data.data.count+")"}</text>
          </g>
        );
        
        /*
            <path className="slicePath" fill={color(this.props.ikey)} d={arc(data)}></path>
            <text className="sliceText" transform={center} textAnchor="middle" >{data.data.name}</text>
        
        */
    }
}

class Slices extends React.Component {
    constructor(props){
        super(props);
        this.update = this.update.bind(this);
    }
    
    update(){
        var pie = d3.layout.pie().value(d=>d.count);
        var arc = d3.svg.arc()
            .outerRadius(this.props.width/2.2)
            .innerRadius(this.props.width/8);
            
        var color = this.props.colors;
        
 //       console.log("did update slices", this.d3Node, "\n data",this.props.data, "\npie",pie(this.props.data));
        this.d3Node
            //.selectAll(".slice")   // install data on the parent
            .selectAll("path")  // path have "d"
            .data(pie(this.props.data))
            //.data(pie)
            .transition()
            .delay(function(d, i) { return i * 120; })
            .duration(150)

            .attrTween('d', function(d) {
                 var i = d3.interpolate(d.startAngle, d.endAngle);
                 return function(t) {
                     d.endAngle = i(t);
                     //console.log("tween d",d, "arc(d)",arc(d));
                   return arc(d);
                 }
            })
            .attr("fill",(d,i)=>{return color(i)});

            //.attr("transform", (d)=>{console.log("slice transform",d); return 'translate('+d.x+','+d.y+')'});
        
    }
    
    componentDidMount() {
      this.d3Node = d3.select(ReactDOM.findDOMNode(this));
      this.update();
    }
    
    componentDidUpdate() {
        this.update();
    }
    
    render() {
        var color = this.props.colors;
        var data = this.props.data;
        var width = this.props.width;
        var height = this.props.height;
        var pie = d3.layout.pie().value(d=>d.count);
        var position = "translate(" + (width)/2 + "," + (height)/2 + ")";
        var bars = (pie(data)).map(function(point, i) { /// pie(result)
          return (
            <Slice data={point} key={i} ikey={i}  colors={color} width={width} height={height}/>
          )
        });
    
        return (
            <g transform={position}>{bars}</g>
        );
    }
}

class PieChart extends React.Component {
    constructor(props){
        super(props);
    }
    
    static get defaultProps() {
        return {
          width: 300,
          height: 350,
//          title: '',
//          Legend: true,
        }
    }
    

    render() {
        var colors = d3.scale.category20();
        return (
            <svg width={this.props.width} height={this.props.height}>        
                <Slices data={this.props.data} colors={colors} width=
                    {this.props.width} height={this.props.height}/>
            </svg>
        );
    }
}


export default PieChart;