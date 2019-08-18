import React from 'react';
import './App.css';
import SearchForm from './components/SearchForm';
import { Row, Col } from 'react-bootstrap';

function App() {
    
    return (
        <div className="App">
            <header className="App-header">
                <p>Busqueda de repositorios en GITHUB</p>
            </header>

            <Row>
                <Col style={{margin: 20}}>
                    <SearchForm />
                </Col>
            </Row>
        </div>
    );
}

export default App;
