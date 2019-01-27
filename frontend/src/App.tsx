import React, { Component } from 'react';
import './App.css';
import Login from './components/Login';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Game from './components/Game';
import MembersManager from './components/MembersManager';

class App extends Component<any, any> {
    constructor(props: any) {
        super(props);

        this.state = {
            step: localStorage.getItem('k121data') ? 1 : 0
        };
    }

    handleStep(step: number){
        // Shows components depending on current step
        switch (step) {
            case 0:
                return (
                    <Paper elevation={1}>
                        <Typography variant="h5" >Faça Login</Typography>
                        <Login setStep={(step: number) => this.setState({ step })} />
                    </Paper>
                );
            case 1:
                return <MembersManager />;
            case 2:
                return <Game/>;
            default:
                return <div> <h1>UNDEFINED!</h1> </div>
        }
    }

    render() {
        return (
            <div className="App">
                <header className="App-header">
                
                </header>

                <div className="row-center m-10">
                    {
                        this.handleStep(this.state.step)
                    }
                </div>
            </div>
        );
    }
}

export default App;
