import * as React from 'react';
import axios from 'axios';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';

class Login extends React.Component <any, any>{
    constructor(props: any) {
        super(props);

        this.state = {
            email: '',
            password: '',
            failed: false
        };
    }

    login(e: any){
        // Makes login request
        axios({
            method: 'POST',
            url: 'http://localhost:3003/users/login',
            headers: {
                "Content-Type": "application/json"
            },
            data: {
                email: this.state.email,
                password: this.state.password
            }
        }).then( (response: any) => {
            localStorage.setItem('k121auth', response.data.token);
            this.props.setStep(1);
        }).catch( (error: any) => {
            alert(JSON.stringify(error));

            this.setState({
                failed: true
            });
        });
    }

    handleChange(e: any){
        // Fills state with inputed data
        const name = e.target.name;
        let value = e.target.value;

        this.setState({
            [name]: value
        });        
    }

    render(){
        return(
            <div className="row-center m-1">
                <form className="col-start" onSubmit={(e: any) => e.preventDefault()}>
                    <div className="row-center m-1">
                        <TextField
                            name="email"
                            label="login"
                            value={this.state.email}
                            onChange={(e: any) => this.handleChange(e)}
                            margin="normal"
                        />
                    </div>
                    <div className="row-center m-1">
                        <TextField
                            name="password"
                            label="senha"
                            value={this.state.password}
                            onChange={(e: any) => this.handleChange(e)}
                            margin="normal"
                            type="password"
                        />
                    </div>
                    <div className="row-center">
                        <Button onClick={(e: any) => this.login(e)} variant="contained" color="primary">
                            Login
                        </Button>
                    </div>
                    {this.state.failed ?
                        <div className="row-center">
                            <p style={{ color: 'red' }} >Falhou!</p>
                        </div>
                    :
                        null
                    }
                </form>
            </div>
        );
    }
}

export default Login;