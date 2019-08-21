import React from 'react';
import { Row, Col, Card } from 'react-bootstrap';
import '../App.css';

export default class TabLanguages extends React.Component{

    state = {
        languages : ['JavaScript','HTML','TypeScript','CSS','Objective-C','Java','Ruby','Python','PHP','C#'],
        language : undefined,
    };

    changeLanguage( newLanguage ){
        this.setState({
            language : this.state.language === newLanguage ? undefined : newLanguage 
        }, () => {
            if( this.props.onClick && typeof this.props.onClick === 'function' ){
                this.props.onClick( this.state.language );
            }
        });
    }

    render(){
        return (
            <Card>
                <Card.Header>Lenguajes</Card.Header>
                <Card.Body >
                    {this.state.languages.map( (item, index) => (
                        <Row key={index} className={`language ${this.state.language === item ? 'selected-language' : 'deselected-language'}`} onClick={() => this.changeLanguage(item)}>
                            <Col lg="12" md="12" sm="12">
                                {item}
                                {this.state.language === item &&
                                    <span style={{float:'right'}}>x</span>
                                }
                            </Col>
                        </Row>
                    ))}
                </Card.Body>
            </Card>
        );
    }
}