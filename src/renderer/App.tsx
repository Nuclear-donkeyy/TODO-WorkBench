import React from 'react';
import { Routes, Route } from 'react-router-dom';
import TodoList from './components/TodoList';
import './App.less';

const App: React.FC = () => {
  return (
    <div className="app">
      <header className="header">
        <h1>📝 TODO WorkBench</h1>
        <p>Organize your tasks efficiently with React & Redux</p>
      </header>
      
      <main className="main-content">
        <Routes>
          <Route path="/" element={<TodoList />} />
          <Route path="/todos" element={<TodoList />} />
        </Routes>
      </main>
    </div>
  );
};

export default App; 