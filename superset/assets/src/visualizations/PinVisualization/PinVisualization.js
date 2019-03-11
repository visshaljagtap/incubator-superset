import d3 from 'd3';
import './PinVisualization.css';
import Datamap from './Datamap';
import ReactDOM from 'react-dom';
import React from 'react';

var bubble_map;

class PinVisualization extends React.Component {

    constructor(props) {
        super(props);
        this.change = this.change.bind(this);
    }

    componentDidMount() {
        console.log('container', this.props);
        this.setState({data: this.props.payload.data})
    }

    // change1(e) {
    //     bubble_map = new Datamap({
    //         element: document.getElementsByClassName("slice_container pin_visualization"),
    //         scope: 'india',
    //         geographyConfig: {
    //           popupOnHover: true,
    //           highlightOnHover: true,
    //           borderColor: '#444',
    //           borderWidth: 0.5,
    //           dataUrl: 'https://rawgit.com/Anujarya300/bubble_maps/master/data/geography-data/india.topo.json'
    //           //dataJson: topoJsonData
    //         },
    //         fills: {
    //           'MAJOR': '#306596',
    //           'MEDIUM': '#0fa0fa',
    //           'MINOR': '#bada55',
    //           "inactive": 'red',
    //           defaultFill: '#dddddd'
    //         },
    //         setProjection: function (element) {
    //           var projection = d3.geo.mercator()
    //             .center([78.9629, 23.5937]) // always in [East Latitude, North Longitude]
    //             .scale(1000);
    //           var path = d3.geo.path().projection(projection);
    //           return { path: path, projection: projection };
    //         }
    //       });
    // }

    change(e) {
        console.log('event', e)
        let pin0;
        let pin1 = e.target.value;
        let data = this.state.data;
        if (pin1 !== undefined && pin1 !== null) {
            if (pin0 === pin1) return;
            pin0 = pin1;
            data.forEach((d) => {
                for (let i = 0, n = pin1.length; i < n; ++i) {
                    if (d.pincode[i] !== pin1[i]) {
                        // d.fillKey = "MAJOR"
                        d.radius = 5
                        this.setState({ data })
                        return;
                    }
                }
                if (pin1.length !== 0) {
                    // d.fillKey = "MINOR"
                    d.radius = 10
                }
                else {
                    d.radius = 5
                }
                this.setState({ data })
            });
        }
    }

    render() {
        let data = this.state ? this.state.data : []
        bubble_map = <Datamap
            scope='india'
            geographyConfig={{
                popupOnHover: true,
                highlightOnHover: true,
                borderColor: '#444',
                borderWidth: 0.5,
                dataUrl: '/static/assets/src/visualizations/PinVisualization/india.topo.json'
            }}
            fills={{
                'MAJOR': '#306596',
                'MEDIUM': '#0fa0fa',
                'MINOR': '#bada55',
                "inactive": 'red',
                defaultFill: '#dddddd'
            }}
            setProjection={function (element) {
                var projection = d3.geo.mercator()
                    .center([78.9629, 23.5937]) // always in [East Latitude, North Longitude]
                    .scale(1000);
                var path = d3.geo.path().projection(projection);
                return { path: path, projection: projection };
            }}
            bubbles={data}
            bubbleOptions={{
                popupTemplate: (geo, data) => {
                    return data.state_name
                }
            }}
        />

        return (
            <div>
                <input onChange={this.change} id="pin-input"></input>
                {bubble_map}
            </div>
        );
    }
}

PinVisualization.propTypes = {};
PinVisualization.defaultProps = {};



export default PinVisualization;
