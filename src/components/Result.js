import React from 'react';
import { Image, Row, Col, Modal, Card } from 'react-bootstrap';
import moment from 'moment';
import '../App.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faEye, faCodeBranch, faCircle } from '@fortawesome/free-solid-svg-icons';
import Axios from 'axios';
import ReactPaginate from 'react-paginate';

export default class Result extends React.Component{

    state = {
        max_pages : 0,
        page : 1,
        comments : [],
    };

    constructor(props) {
        super(props);
        this.handleClose = this.handleClose.bind(this);
        this.handleShow = this.handleShow.bind(this);
    }

    kNumber( number ){
        return parseInt( number / 1000 ) + ( number % 1000 >= 500 ? 1 : 0 );
    }

    lastUpdate( date ){
        let minutes = moment().diff( moment(date), 'minutes' );
        let hours  = parseInt( minutes / 60 ) + ( minutes % 60 > 0.9 ? 1 : 0 );
        let days    = parseInt( minutes / 1440 ) + ( minutes % 1440 > 0.9 ? 1 : 0 );

        if( minutes < 60 ){
            return `Actualizado hace ${minutes} minutos`;
        }else if( hours < 24 ){
            return `Actualizado hace ${hours} horas`;
        }else if( days < 30 ){
            return `Actualizado hace ${days} dias`;
        }else{
            return `Actualizado el ${moment(date).format('DD-MM-YYYY')}`;
        }
    }

    search(){
        
        console.log( this.props.data )

        
        this.setState({
            loading   : true,           
        });
        
        let end_point = `${this.props.data.issue_comment_url.replace('{/number}', '')}?sort=created&direction=desc&page=${this.state.page}`;
        
        Axios.get(end_point).then( github_response => {
            
            this.setState({
                loading : false
            });

            if( github_response.status === 200 ){
                this.setState({
                    max_pages : Math.ceil( this.props.data.open_issues_count ) / 30,                     
                    total_count : this.props.data.open_issues_count,
                    comments : github_response.data
                });
            }
        }).catch( error => {
            this.setState({
                loading : false
            })
            console.log( 'Ha ocurrido un error al consultar el api de github' );
        });
    }

    handleShow( item ){
        if( item.issue_comment_url ){
            this.setState({
                show_modal : true,
            }, () => {
                this.search();
            });
        }
    }

    handleClose(){
        this.setState({ show_modal : false });
    }

    render(){
        
        let item = this.props.data;

        return (
            <div>
                <Row onClick={() => this.handleShow( item )}>
                    <Col lg="2" md="2" sm="2">
                        <Image src={item.owner.avatar_url} fluid />
                    </Col>
                    <Col lg="10" md="10" sm="10">
                        <Row style={{fontSize:14}}>
                            <Col lg="8" md="8" sm="8">
                                <a href="#" style={{fontSize:16, color:'blue', fontWeight:'bold'}} onClick={this.handleShow}>{item.full_name}</a>
                                <p>{item.description}</p>
                            </Col>
                            <Col lg="2" md="2" sm="2">
                                <FontAwesomeIcon icon={faCircle}/> {item.language}
                            </Col>
                            <Col lg="2" md="2" sm="2">
                                <FontAwesomeIcon icon={faStar}/> {this.kNumber(item.stargazers_count)}K
                            </Col>
                        </Row>
                        <Row style={{fontSize:14}}>
                            <Col>{item.license ? item.license.name : 'Licencia no especificada'}</Col>
                            <Col>{this.lastUpdate(item.pushed_at)}</Col>
                            <Col><FontAwesomeIcon icon={faEye}/> {this.kNumber(item.forks)}K</Col>
                            <Col><FontAwesomeIcon icon={faCodeBranch}/> {this.kNumber(item.forks)}K</Col>
                        </Row>
                    </Col>
                </Row>

                <Modal show={this.state.show_modal} onHide={this.handleClose} size="lg" backdrop="static">
                    <Modal.Header closeButton>
                        <Modal.Title  style={{fontSize : 17}}>Comentarios</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>

                        <Row>
                            <Col>

                                { this.state.loading && 
                                    <strong>Espere por favor...</strong>
                                }

                                { !this.state.loading && this.state.comments.length === 0 && 
                                    <strong>No se han encontrado comentarios</strong>
                                }

                                {this.state.comments.map( (item, index) => (
                                    <Card key={index} style={{ marginTop: index ? 20 : 0 }}>
                                        <Card.Body>
                                            <Card.Text style={{fontSize:14}}>
                                                <strong>{item.user.login}</strong> - <span style={{fontSize:12}}>{moment(item.created_at).format('DD-MM-YYYY')}</span>
                                            </Card.Text>
                                            <Card.Text style={{fontSize: 12}}>
                                                {item.body}
                                            </Card.Text>
                                        </Card.Body>
                                    </Card>
                                ))}
                            </Col>
                        </Row>

                        {this.state.comments.length > 0 && 
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
                    </Modal.Body>
                </Modal>
            </div>
        );
    }
}