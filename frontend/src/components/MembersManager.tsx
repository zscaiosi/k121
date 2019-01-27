import * as React from 'react';
import axios from 'axios';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import AddForm from './AddForm';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';

class MembersManager extends React.Component <any, any>{
    constructor(props: any) {
        super(props);

        this.state = {
            members: [],
            currentUser: JSON.parse(localStorage.getItem('k121data') || "{\"User\":{}}").User,
            newMember: {
                name: '',
                email: '',
                password: 'not_admin',
                role: 2,
                domains: JSON.parse(localStorage.getItem('k121data') || "{\"User\":{}}").User.domains
            },
            creating: false
        };
    }

    componentDidMount(){
        // Must check currentUser and fetch all users for his domain 
        if (!this.state.currentUser && !this.state.currentUser.domains[0]) {
            alert("!")
            return;
        }
        axios({
            method: 'GET',
            url: `http://localhost:3003/users/findByDomain/${this.state.currentUser.domains[0]}`,
            headers: {
                "Authorization": (JSON.parse(localStorage.getItem("k121data") || "") || {token: ''}).token
            }
        }).then( (response: any) => {
            this.setState({
                members: response.data.result
            });
        }).catch( (error: any) => {
            alert('FETCH ERROR: \n' + JSON.stringify(error));
        });
    }

    handleChange(e: any){
        // Fills state with inputed data
        const name = e.target.name;
        let value = e.target.value;

        this.setState({
            newMember: {
                ...this.state.newMember,
                [name]: value
            }
        });
    }

    postAddUser(){

        axios({
            method: 'POST',
            url: `http://localhost:3003/users/register`,
            data: {
                name: this.state.newMember.name,
                email: this.state.newMember.email,
                password: this.state.newMember.password,
                role: this.state.newMember.role,
                domains: this.state.newMember.domains
            },
            headers: {
                "Authorization": (JSON.parse(localStorage.getItem("k121data") || "") || {token: ''}).token
            }
        }).then( (response: any) => {
            this.setState({
                creating: false
            });
        }).catch( (error: any) => {
            alert('NOT CREATED: ' + JSON.stringify(error))
        });
        
    }

    render(){
        return(
            <div className="row-center">
                <Paper>
                    <Typography variant="h5" >{ this.state.creating ? "Novo usuário" : "Lista de usuários" }</Typography>
                    {
                        this.state.creating ?
                            <AddForm state={this.state} handleChange={(e: any) => this.handleChange(e)} postAddUser={() => this.postAddUser()} />
                        :

                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>#</TableCell>
                                    <TableCell>Inscritos</TableCell>
                                    <TableCell align="right">Grupo</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                            {
                                this.state.members.length > 0 ?
                                this.state.members.map((row: any, index: number) => (
                                    <TableRow key={index}>
                                        <TableCell component="th" scope="row">
                                            {row._id}
                                        </TableCell>
                                        <TableCell align="right">{row.name}</TableCell>
                                        <TableCell align="right">{row.domains[0]}</TableCell>
                                    </TableRow>
                                ))
                                :
                                <CircularProgress color="secondary"></CircularProgress>
                            }
                            <TableRow>
                                <TableCell>
                                    <Button onClick={(e: any) => this.setState({ creating: true })} variant="contained" color="primary">+</Button>
                                </TableCell>
                            </TableRow>
                            </TableBody>
                        </Table>
                    }
                </Paper>
            </div>
        );
    }
}

export default MembersManager;