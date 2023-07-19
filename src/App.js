import React from 'react';
import Dashboard from "./components/Dashboard";
import data from "./data/convertedData"

function App() {
    return (
        <div className="App">
            <Dashboard data={data}/>
        </div>
    );
}

export default App;
