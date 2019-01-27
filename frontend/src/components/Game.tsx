import * as React from 'react';
import axios from 'axios';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

class Game extends React.Component <any, any>{
    constructor(props: any) {
        super(props);

        this.state = {
            email: '',
            password: ''
        };
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
            <div className="row-center">
                <Paper>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>#</TableCell>
                            <TableCell>Inscritos</TableCell>
                            <TableCell align="right">Grupo</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                    {[{ name: "Outro Fulano", domain: 1, _id: 1 }].map((row, index) => (
                        <TableRow key={index}>
                            <TableCell component="th" scope="row">
                                {row._id}
                            </TableCell>
                            <TableCell align="right">{row.name}</TableCell>
                            <TableCell align="right">{row.domain}</TableCell>
                        </TableRow>
                    ))}
                    </TableBody>
                </Table>
                </Paper>
            </div>
        );
    }
}

export default Game;