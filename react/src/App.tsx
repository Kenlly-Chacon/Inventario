import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ProductList from './pages/ProductList';
import ProductForm from './pages/ProductForm';
import TransactionManager from './pages/TransactionManager';
import './App.css';

function App() {
    return (
        <BrowserRouter>
            <div className="app-container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
                <Routes>
                    <Route path="/" element={<ProductList />} />
                    <Route path="/products/new" element={<ProductForm />} />
                    <Route path="/products/edit/:id" element={<ProductForm />} />
                    <Route path="/transactions/:productId" element={<TransactionManager />} />
                </Routes>
            </div>
        </BrowserRouter>
    );
}

export default App;