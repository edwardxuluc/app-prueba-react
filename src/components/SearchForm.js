import React from 'react';
import { Row, Col, Button, Form, Card } from 'react-bootstrap';
import axios from 'axios';
import '../App.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import NumberFormat from 'react-number-format';
import TabLanguages from './TabLanguages';
import ReactPaginate from 'react-paginate';
import Result from './Result';
import constants from '../assets/constants';

export default class searchForm extends React.Component{
    
    state = {
        term : '',
        results : [],
        loading : false,
        language : undefined,
        page : undefined,
        max_pages : undefined,
        searches : []
    };

    constructor(props) {
        super(props);
        this.search = this.search.bind(this);
        this.changeLanguage = this.changeLanguage.bind(this);
        this.changePage = this.changePage.bind(this);
        this.submitForm = this.submitForm.bind(this);
    }

    componentDidMount(){
       this.updateSearch();
    }

    search(){
        
        if( this.state.term ){

            this.setState({
                loading     : true,
                results     : [],
                total_count : 0
            });

            let end_point = `https://api.github.com/search/repositories?q=${this.state.term.split(' ').join('+')}`;

            if( this.state.language ){
                end_point += `+language:${this.state.language}`;
            }

            if( this.state.page ){
                end_point += `&page=${this.state.page}`;
            }

            // guardar la busqueda en el api
            axios.post(`${constants.apirest_url}/busqueda`, { texto : this.state.term }).then( api_response => {

                // realizar la peticion a github
                return axios.get( end_point ).then( github_response => {
    
                    this.setState({ loading : false });
    
                    if( github_response.status === 200 ){
    
                        this.setState({
                            results     : github_response.data.items,
                            total_count : github_response.data.total_count,
                        }, () => {
                            this.updateSearch();
                        });
                    }
                });
            }).catch( error => {
                this.setState({ loading : false });
                console.log('Ha ocurrido un error al realizar la consulta');
            });
        }
    }

    submitForm( event ){
        event.preventDefault();
        
        this.setState({
            page : 1,
        }, () => {
            this.search()
        });
    }

    changeLanguage( newLanguage ){
        this.setState({
            language : newLanguage,
            page  : 1
        }, () => {
            this.search();
        });
    }

    changePage( newPage ){
        this.setState({
            page : newPage.selected + 1
        }, () =>{
            this.search();
        })
    }

    deleteSearch( searchId ){
        axios.delete(`${constants.apirest_url}/busqueda/${searchId}`).then( api_response => {
            if( api_response.status === 200 ){
                this.updateSearch();
            }
        }).catch( error => {
            console.log('Ha ocurrido un error al consultar el api.')
        });
    }

    updateSearch(){
         axios.get(`${constants.apirest_url}/busqueda`).then( api_response => {
            if( api_response.status === 200 ){
                this.setState({
                    searches : api_response.data.data
                });
            }
        }).catch( error => {
            console.log('Ha ocurrido un error al consultar el api.')
        });
    }
    
    render(){
        return (
            <div>
                <Row>
                    <Col lg="2" md="2" sm="2">
                        <TabLanguages onClick={this.changeLanguage} />

                        <Card style={{marginTop : 20}}>
                            <Card.Header>Busquedas recientes</Card.Header>
                            <Card.Body >
                                {this.state.searches.map( (item, index) => (
                                    <Row key={index} className="search" onClick={() => this.deleteSearch(item.id)}>
                                        <Col lg="12" md="12" sm="12">
                                            {item.texto} <span style={{float:'right'}}>x</span>
                                        </Col>
                                    </Row>
                                ))}
                            </Card.Body>
                        </Card>
                    </Col>

                    <Col lg="10" md="10" sm="10">
                        <Row>
                            <Col>
                                <Form onSubmit={this.submitForm}>
                                    <Row>
                                        <Col lg="6" md="6">
                                            <Form.Group style={{textAlign:'left'}}>
                                                <Form.Control type="text" placeholder="Buscar" value={this.state.term} onChange={(event) => this.setState({ term : event.target.value }) } />
                                            </Form.Group>
                                        </Col>
                                        <Col lg="2" md="2">
                                            <Button type="submit" variant="primary" disabled={this.state.loading}>
                                                Buscar <FontAwesomeIcon icon={faSearch} fixedWidth />
                                            </Button>
                                        </Col>
                                    </Row>
                                </Form>
                            </Col>
                        </Row>
                        
                        <strong>
                            Se han encontrado <NumberFormat value={this.state.total_count || 0} displayType={'text'} thousandSeparator={true} /> resultados
                        </strong>

                        <hr />
                        
                        { this.state.loading && 
                            <div>
                                <strong>Espere por favor...</strong>
                            </div>
                        }

                        {this.state.results.map( (item, index) => (
                            <div key={index}>
                                <Result data={item} />

                                { (index + 1) !== this.state.results.length && 
                                    <hr />
                                }
                            </div>
                        ))}
                        
                        {this.state.total_count > 0 && 
                            <Row style={{marginTop:20, float:'center'}}>
                                <Col>
                                    <ReactPaginate
                                        previousLabel={'Anterior'}
                                        nextLabel={'Siguiente'}
                                        breakLabel={'...'}
                                        pageCount={this.state.max_pages}
                                        marginPagesDisplayed={2}
                                        pageRangeDisplayed={5}
                                        onPageChange={this.changePage}
                                        containerClassName={'pagination'}                                    
                                        pageClassName={'page-item'}
                                        pageLinkClassName={'page-link'}                                    
                                        previousClassName={'page-item'}
                                        nextClassName={'page-item'}
                                        previousLinkClassName={'page-link'}
                                        nextLinkClassName={'page-link'}
                                        breakClassName={'page-item'}
                                        breakLinkClassName={'page-link'}
                                        activeClassName={'active'}
                                    />
                                </Col>
                            </Row>
                        }
                    </Col>
                </Row>
            </div>
        );
    }
};