import React, { Component } from 'react';
import styles from './styles/common.scss';
import './App.css';
import DragDemo from 'components/DragDemo';

class App extends Component {
  render() {
    return (
      <div className="App">
        <DragDemo className={styles.fullPage} />
      </div>
    );
  }
}

export default App;
