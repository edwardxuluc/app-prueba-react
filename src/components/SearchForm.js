import React from 'react';
import { Row, Col, Button, Form, Table } from 'react-bootstrap';
import axios from 'axios';

export default class searchForm extends React.Component{
    
    state = {
        term : 'react',
        tipo : 'Autor',
        results : [],
        loading : false
    };

    constructor(props) {
        super(props);
        this.submit = this.submit.bind(this);
    }

    componentDidMount(){
        console.log('componentDidMount')
    }

    starNumber( number ){
        return parseInt( number / 1000 ) + ( number % 1000 >= 500 ? 1 : 0 );
    }


    

    submit( e ){
        e.preventDefault();
        console.log( e )
        // console.log( this )
        console.log( this.state );
        if( this.state.term ){

            this.setState({
                loading : true,
                results : [],
            });

            const endPoint = `https://api.github.com/search/repositories?q=${this.state.term.split(' ').join('+')}`;

            axios.get( endPoint ).then( response => {

                this.setState({ loading : false });

                if( response.status === 200 ){
                    console.log( response );
                    this.setState({
                        total_count : response.data.total_count,
                        results  : response.data.items,
                    });

                    response.data.items.forEach(item => {
                        console.log( item );
                    });
                }else{
                    console.log('Error');
                }
            }).catch( error => {
                this.setState({ loading : false });
            });
        }
    }

    
    render(){
        return (

            <div>
                <Row>
                    <Col>
                        <Form onSubmit={this.submit}>
                            <Row>
                                <Col lg="6" md="6">
                                    <Form.Group style={{textAlign:'left'}}>
                                        <Form.Control type="text" placeholder="Buscar" value={this.state.term} onChange={(event) => this.setState({ term : event.target.value }) } />
                                    </Form.Group>
                                </Col>
                                <Col lg="2" md="2">
                                    <Button type="submit" variant="primary">
                                        Buscar {this.state.loading ? 'True' : 'False'}
                                    </Button>
                                </Col>
                            </Row>
                        </Form>
                    </Col>
                </Row>

                <p>{this.state.total_count || 0} resultados</p>

                {this.state.results.map( (item, index) => (
                    <div>
                        <hr />
                        <Row>
                            <Col lg="8" md="8" sm="8">
                                <h6 style={{fontSize:20, color:'blue', fontWeight:'bold'}}>{item.full_name}</h6>
                                <p>{item.description}</p>
                            </Col>
                            <Col lg="2" md="2" sm="2">
                                {item.language}
                            </Col>
                            <Col lg="2" md="2" sm="2">
                                {this.starNumber(item.stargazers_count)}K
                            </Col>
                        </Row>
                        <Row>
                            <Col>{item.license ? item.license.name : 'Licencia no especificada'}</Col>
                            <Col>{item.created_at}</Col>
                            <Col>Ultima actualización {item.pushed_at}</Col>
                            <Col></Col>
                        </Row>
                    </div>
                ))}

                <Row>
                    <Col>
                        <Table striped bordered hover>
                            <thead>
                                <tr>
                                    <th>Título</th>
                                    <th>Fecha</th>
                                    <th>Autor</th>
                                    <th>Licencia</th>
                                    <th>Tema</th>
                                </tr>
                            </thead>
                            <tbody>
                                { !this.state.results.length &&
                                    <tr>
                                        <td colSpan={5}>
                                            { this.state.loading ? 'Consultando...' : 'No se han encontrado resultados'}
                                        </td>
                                    </tr>
                                }
                                {this.state.results.map( (item, index) => (
                                    <tr key={index}>
                                        <td>{item.title}</td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                    </tr>
                                ))
                                }
                            </tbody>
                        </Table>
                    </Col>
                </Row>
            </div>
        );
    }
};