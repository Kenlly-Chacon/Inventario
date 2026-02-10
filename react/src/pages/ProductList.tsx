import { useState } from 'react';
import { useProducts } from '../hooks/useProducts';
import { useNavigate } from 'react-router-dom';
import { productService } from '../services/productService';

export default function ProductList() {
    const { products, loading, refresh } = useProducts();
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    const handleDelete = async (id: number) => {
        if (confirm('¿Estás seguro de eliminar este producto?')) {
            const response = await productService.delete(id);
            if (response.success) {
                refresh();
            } else {
                alert(response.message || 'No se pudo eliminar el producto');
            }
        }
    };

    const filteredProducts = products.filter(p =>
        p.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.categoria.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const paginatedProducts = filteredProducts.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    if (loading) return <div className="container"><p>Cargando inventario...</p></div>;

    return (
        <div className="container">
            <h1>Gestión de Inventario</h1>

            <div className="card" style={{ marginBottom: '20px', display: 'flex', gap: '10px', alignItems: 'center' }}>
                <button onClick={() => navigate('/products/new')} style={{ backgroundColor: '#28a745' }}>+ Nuevo Producto</button>
                <input
                    type="text"
                    placeholder="🔍 Buscar por nombre o categoría..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    style={{ padding: '10px', flexGrow: 1, borderRadius: '4px', border: '1px solid #ccc' }}
                />
            </div>

            <table border={0} cellPadding={10} style={{ width: '100%', borderCollapse: 'collapse', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
                <thead>
                <tr style={{ backgroundColor: '#f4f4f4', textAlign: 'left' }}>
                    <th>ID</th>
                    <th>Imagen</th>
                    <th>Nombre</th>
                    <th>Categoría</th>
                    <th>Precio</th>
                    <th>Stock</th>
                    <th style={{ textAlign: 'center' }}>Acciones</th>
                </tr>
                </thead>
                <tbody>
                {paginatedProducts.map(p => (
                    <tr key={p.id} style={{ borderBottom: '1px solid #eee' }}>
                        <td>{p.id}</td>
                        <td>
                            {p.imagen ? <img src={p.imagen} alt={p.nombre} width="50" height="50" style={{ objectFit: 'cover', borderRadius: '4px' }} /> : <span>📷</span>}
                        </td>
                        <td>{p.nombre}</td>
                        <td>{p.categoria}</td>
                        <td>${p.precio}</td>
                        <td style={{ color: p.stock < 5 ? 'red' : 'green', fontWeight: 'bold' }}>
                            {p.stock}
                        </td>
                        <td style={{ textAlign: 'center' }}>
                            <button onClick={() => navigate(`/products/edit/${p.id}`)} style={{ marginRight: '5px' }}>Editar</button>
                            <button onClick={() => navigate(`/transactions/${p.id}`)} style={{ marginRight: '5px', backgroundColor: '#008CBA' }}>Movimientos</button>
                            <button onClick={() => handleDelete(p.id)} style={{ backgroundColor: '#dc3545' }}>Eliminar</button>
                        </td>
                    </tr>
                ))}
                {paginatedProducts.length === 0 && (
                    <tr><td colSpan={7} style={{ textAlign: 'center' }}>No se encontraron productos.</td></tr>
                )}
                </tbody>
            </table>

            <div className="pagination" style={{ marginTop: '20px', display: 'flex', justifyContent: 'center', gap: '10px' }}>
                <button disabled={currentPage === 1} onClick={() => setCurrentPage(c => c - 1)}>&laquo; Anterior</button>
                <span style={{ margin: '0 10px', alignSelf: 'center' }}>Página {currentPage}</span>
                <button disabled={filteredProducts.length <= currentPage * itemsPerPage} onClick={() => setCurrentPage(c => c + 1)}>Siguiente &raquo;</button>
            </div>
        </div>
    );
}