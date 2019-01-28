import * as React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';

const AddForm = (props: any) => {
    return(
        <form onSubmit={(e: any) => e.preventDefault()}>
            <div className="row-center m-1">
                <TextField
                    name="name"
                    label="Nome"
                    value={props.state.newMember.name}
                    onChange={(e: any) => props.handleChange(e)}
                    margin="normal"
                />
            </div>
            <div className="row-center m-1">
                <TextField
                    name="email"
                    label="E-mail"
                    value={props.state.newMember.email}
                    onChange={(e: any) => props.handleChange(e)}
                    margin="normal"
                />
            </div>
            {
                props.updating ?
                    <div className="row-center m-1">
                        <TextField
                            name="password"
                            label="Senha"
                            value={props.state.newMember.password}
                            onChange={(e: any) => props.handleChange(e)}
                            margin="normal"
                            type="password"
                        />
                    </div>
                :
                    null
            }
            <div className="row-center">
                {
                    props.updating ?
                        <Button onClick={(e: any) => props.putUser()} variant="contained" color="primary">
                            ATUALIZAR
                        </Button>
                    :
                        <Button onClick={(e: any) => props.postAddUser()} variant="contained" color="primary">
                            CRIAR
                        </Button>
                }
            </div>
            {props.state.failed ?
                <div className="row-center">
                    <p style={{ color: 'red' }} >Falhou!</p>
                </div>
            :
                null
            }
        </form>
    );
}

export default AddForm;