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
            // If already logged in then exists in localStorage
            currentUser: JSON.parse(localStorage.getItem('k121data') || "{\"User\":{}}").User,
            newMember: {
                name: '',
                email: '',
                password: 'not_admin',
                role: 2,
                domains: JSON.parse(localStorage.getItem('k121data') || "{\"User\":{}}").User.domains
            },
            creating: false,
            updating: false,
            removing: false
        };
    }

    componentDidMount(){
        // Must check currentUser and fetch all users for his domain 
        if (!this.state.currentUser && !this.state.currentUser.domains[0]) {
            alert("!")
            return;
        }

        this.fetchUsers();
    }

    componentDidUpdate(prevProps: any, prevState: any){
        if (this.state.creating !== prevState.creating) {
            this.fetchUsers();
        }
    }

    fetchUsers(){
        // Fetches all users for current domain
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
        if (this.state.newMember.email.indexOf(".com") < 0 || this.state.newMember.email.indexOf("@") < 0) {
            alert("E-mail inválido!!!");
        } else {
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
                window.location.reload();
            }).catch( (error: any) => {
                alert('NOT CREATED: ' + JSON.stringify(error))
            });
        }
        
    }

    postAddGame(){
        // Creates the game
        if (this.state.members && this.state.members.length % 2 !== 0) {
            alert("Participantes nâo formam pares!");
        } else {
            axios({
                method: 'POST',
                url: `http://localhost:3003/games/create`,
                data: {
                    subscribers: this.state.members.map( (sub: any) => sub.email),
                    pairs: [],
                    domain: this.state.currentUser.domains[0]
                },
                headers: {
                    "Authorization": (JSON.parse(localStorage.getItem("k121data") || "") || {token: ''}).token
                }
            }).then( (response: any) => {
                // Now plays the game
                axios({
                    method: 'PUT',
                    url: `http://localhost:3003/games/play`,
                    data: {
                        subscribers: this.state.members.map( (sub: any) => sub._id),
                        pairs: [],
                        domain: this.state.currentUser.domains[0]
                    },
                    headers: {
                        "Authorization": (JSON.parse(localStorage.getItem("k121data") || "") || {token: ''}).token
                    }
                }).then( (response: any) => {
                    alert("CRIADO! Verifique teu e-mail!");
                    // window.location.reload();
                }).catch( (error: any) => {
                    alert('NOT PLAYED: ' + JSON.stringify(error));
                });
            }).catch( (error: any) => {
                alert('NOT CREATED: ' + JSON.stringify(error));
            });
        }
        
    }

    putUser(){
        axios({
            method: 'PUT',
            url: `http://localhost:3003/users/update`,
            data: {
                _id: this.state.newMember._id,
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

            window.location.reload();
        }).catch( (error: any) => {
            alert('NOT CREATED: ' + JSON.stringify(error))
        });
    }

    removeUser(_id: string){
        if (_id) {
            axios({
                method: 'DELETE',
                url: `http://localhost:3003/users/remove/${_id}`,
                headers: {
                    "Authorization": (JSON.parse(localStorage.getItem("k121data") || "") || {token: ''}).token
                }
            }).then( (response: any) => {
                window.location.reload();
            }).catch( (error: any) => {
                alert(JSON.stringify(error));
            });
        } else {
            alert("Nâo selecionado!");
        }
    }

    render(){
        return(
            <div className="row-center">
                <Paper>
                    <Typography variant="h5" >{ this.state.creating ? "Novo usuário" : "Lista de usuários" }</Typography>
                    {
                        this.state.creating || this.state.updating ?
                            <AddForm state={this.state} updating={this.state.updating} creating={this.state.creating} handleChange={(e: any) => this.handleChange(e)} postAddUser={() => this.postAddUser()} putUser={() => this.putUser()} />
                        :

                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell align="right">#</TableCell>
                                    <TableCell align="right">Inscritos</TableCell>
                                    <TableCell align="right">Grupo</TableCell>
                                    <TableCell align="right">Alterar</TableCell>
                                    <TableCell align="right">Remover</TableCell>
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
                                        <TableCell align="right"><Button onClick={(e: any) => this.setState({ updating: true, creating: false, newMember: {...this.state.members[index], password: ''} })} variant="contained" color="primary">Alterar Usuário</Button></TableCell>
                                        <TableCell align="right"><Button onClick={(e: any) => {
                                            this.setState({ removing: true, creating: false, updating: false });
                                            this.removeUser(row._id);
                                        }} variant="contained" color="primary">Remover Usuário</Button></TableCell>
                                    </TableRow>
                                ))
                                :
                                <CircularProgress color="secondary"></CircularProgress>
                            }
                            <TableRow>
                                <TableCell>
                                    <Button onClick={(e: any) => this.setState({ creating: true })} variant="contained" color="primary">Adicionar Usuário</Button>
                                </TableCell>
                                <TableCell>
                                    <Button onClick={(e: any) => this.postAddGame()} variant="contained" color="primary">Criar Amigo Secreto</Button>
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