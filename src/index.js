import React from 'react';
import ReactDOM from 'react-dom';
import { Typography, IconButton, Paper } from '@material-ui/core';
import  ExpandLessIcon  from '@material-ui/icons/ExpandLess';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import PauseIcon from '@material-ui/icons/Pause';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import RotateLeftIcon from '@material-ui/icons/RotateLeft';

import "./index.css";

class App extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            breakLength: 5,
            sessionLength: 25,
            breakTime:300000,
            sessionTime:1500000,
            timerPlaying: false,
            currentTimer: "session",
        }

        this.handleControl = this.handleControl.bind(this);
        this.handleTimerControl = this.handleTimerControl.bind(this);
        this.sessionTimerFunction = this.sessionTimerFunction.bind(this);
        this.breakTimerFunction = this.breakTimerFunction.bind(this);

        this.sessionTimer = null;
        this.breakTimer = null;
    }
    
    msToTime(s) {
        let ms = s % 1000;
        s = (s - ms) / 1000;
        let secs = s % 60;
        s = (s - secs) / 60;
        let mins = s % 60;

        let result = mins + ':' + secs;
        
        let x = result.indexOf(":");
        if(result.slice(x).length === 2) {
            let y = result.slice(0,x);
            y += ":0" + result[result.length-1];
           return  y;
        }
        return result;
    }

    sessionTimerFunction() {
        console.log("session tik");
        if(this.state.sessionTime < 1000) {
            console.log(this.sessionTimer);
            const id = this.sessionTimer;
            clearInterval(id);
            this.setState((state) => ({
                breakTime: state.breakLength * 60 + "000",
                currentTimer: "break",
            }));
            this.breakTimer = setInterval(this.breakTimerFunction, 1000);
            console.log("s bye");
        } else {
            this.setState((state) => ({
                sessionTime: state.sessionTime - 1000,
            }));
        }
    }

    breakTimerFunction() {
        console.log("break tik");
        if (this.state.breakTime < 1000) {
            const id = this.breakTimer;
            clearInterval(id);
            this.setState((state) => ({
                sessionTime: state.sessionLength * 60 + "000",
                currentTimer: "session",
            }));
            this.sessionTimer = setInterval(this.sessionTimerFunction, 1000);
            console.log("b bye");   
        } else {
            this.setState((state) => ({
                breakTime: state.breakTime - 1000,
            }));
        }
    }

    handleControl(button) {
        switch (button) {
            case "bc-up":
                if (!this.state.timerPlaying) {
                    this.setState((state) => ({
                        breakLength: state.breakLength + 1,
                        breakTime: (state.breakLength + 1) * 60 + "000",
                        currentTimer: "session"
                    }));
                }
                break;
            case "bc-down":
                if (!this.state.timerPlaying) {
                    this.setState((state) => ({
                        breakLength: state.breakLength === 1 ? state.breakLength : state.breakLength - 1,
                        breakTime: state.breakTime === "60000" ? state.breakTime : (state.breakLength - 1) * 60 + "000",
                        currentTimer: "session"
                    }));
                }
                break;
            case "sc-up":
                if (!this.state.timerPlaying) {
                    this.setState((state) => ({
                        sessionLength: state.sessionLength + 1,
                        sessionTime: (state.sessionLength + 1) * 60 + "000",
                        currentTimer: "session"
                    }));
                }
                break;
            case "sc-down":
                if (!this.state.timerPlaying) {
                    this.setState((state) => ({
                        sessionLength: state.sessionLength === 1 ? state.sessionLength : state.sessionLength - 1,
                        sessionTime: state.sessionTime === "60000" ? state.sessionTime : (state.sessionLength - 1) * 60 + "000",
                        currentTimer: "session",
                    }));
                }
                break;
            case "play":
                if (!this.state.timerPlaying) {
                    if (this.state.currentTimer === "break") {
                        this.breakTimer = setInterval(this.breakTimerFunction, 1000);
                    } else if (this.state.currentTimer === "session") {
                        this.sessionTimer = setInterval(this.sessionTimerFunction, 1000);
                    }
                   
                    this.setState({
                        timerPlaying:true,
                    });
                } else {
                    if (this.state.currentTimer === "break") {
                        clearInterval(this.breakTimer);
                    } else if (this.state.currentTimer === "session") {
                        clearInterval(this.sessionTimer);
                    }
                    this.setState({timerPlaying:false});
                }
                console.log(this.sessionTimer);
                break;
            case "pause":
                if (this.state.currentTimer === "break") {
                    clearInterval(this.breakTimer);
                } else if (this.state.currentTimer === "session") {
                    clearInterval(this.sessionTimer);
                }
                this.setState({timerPlaying:false});
                break;
            case "reset":
                if (this.state.currentTimer === "break") {
                    clearInterval(this.breakTimer);
                } else if (this.state.currentTimer === "session") {
                    clearInterval(this.sessionTimer);
                }
                this.setState({
                    breakLength: 5,
                    sessionLength: 25,
                    breakTime:300000,
                    sessionTime:1500000,
                    timerPlaying: false,
                    currentTimer: "session",
                });
                break;
            default:
                break;
        }
        console.log(button);

    }
    
    handleTimerControl(event) {
        this.handleControl(event.currentTarget.id);
    }

    render() {
        let display = "";
        if (this.state.currentTimer === "session") {
            display = this.msToTime(this.state.sessionTime);
        } else if (this.state.currentTimer === "break") {
            display = this.msToTime(this.state.breakTime);
        }

        console.log(this.state);
        return (
            <div id="container">
                <div id="app">
                    <Typography align="center" variant="h2" id="title" >25 + 5 Clock</Typography>
                    <div id="controlContainer">
                        <LengthControl label="Break Length" value={this.state.breakLength} id="bc" handleControl={this.handleControl}>
                        </LengthControl>
                        <LengthControl label="Session Length" value={this.state.sessionLength} id="sc" handleControl={this.handleControl}>
                        </LengthControl>
                    </div>
                    <Paper id="sessionContainer">
                        <Typography variant="h4" align="center" style={{marginBottom:"20px"}}>{this.state.currentTimer[0].toUpperCase() + this.state.currentTimer.slice(1)}</Typography>
                        <Typography variant="h2" align="center">{display}</Typography>
                    </Paper>
                    <div id="timerControl">
                        <IconButton id="play" onClick={this.handleTimerControl}>
                            {this.state.timerPlaying ? <PauseIcon /> : <PlayArrowIcon />}
                        </IconButton>
                        <IconButton id="reset" onClick={this.handleTimerControl}>
                            <RotateLeftIcon></RotateLeftIcon>
                        </IconButton>
                    </div>
                    <Typography id="credit" align="center">
                        Design and Codded by Siddharth Roy
                    </Typography>
                </div>
            </div>
        );
    }
}

function LengthControl(props) {

    function handleClick(event) {
        props.handleControl(event.currentTarget.id);
    }

    //let labelId = (props.id === "bc") ? "break-label" : "";
    //let buttonUpId;
    //let buttonDownId;

    return (
        <div className="lengthControl">
            <Typography className="label">{props.label}</Typography>
            <div className="control">
            <IconButton onClick={handleClick} id={props.id+"-up"}>
                <ExpandLessIcon />
            </IconButton>
    <p className="value">{props.value}</p>
            <IconButton onClick={handleClick} id={props.id+"-down"}>
                <ExpandMoreIcon></ExpandMoreIcon>
            </IconButton>
            </div>
        </div>
    );
}

ReactDOM.render(<App></App>, document.getElementById("root"));