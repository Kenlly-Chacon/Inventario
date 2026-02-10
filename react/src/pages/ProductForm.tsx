import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { productService } from '../services/productService';
import type { ProductCreateDto } from '../models/Product';

export default function ProductForm() {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEdit = !!id;

    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const [form, setForm] = useState<ProductCreateDto>({
        nombre: '',
        descripcion: '',
        categoria: '',
        imagen: '',
        precio: 0,
        stock: 0
    });

    useEffect(() => {
        if (isEdit) {
            setLoading(true);
            productService.getById(Number(id))
                .then(response => {
                    if (response.success && response.data) {
                        setForm({
                            nombre: response.data.nombre,
                            descripcion: response.data.descripcion || '',
                            categoria: response.data.categoria,
                            imagen: response.data.imagen || '',
                            precio: response.data.precio,
                            stock: response.data.stock
                        });
                    } else {
                        setError(response.message || "No se pudo cargar el producto");
                    }
                })
                .catch(() => setError("Error de conexión al cargar el producto"))
                .finally(() => setLoading(false));
        }
    }, [id, isEdit]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (form.precio <= 0) {
            setError("El precio debe ser mayor a 0");
            return;
        }
        if (form.stock < 0) {
            setError("El stock no puede ser negativo");
            return;
        }

        try {
            setLoading(true);
            let response;
            if (isEdit) {
                response = await productService.update(Number(id), form);
            } else {
                response = await productService.create(form);
            }

            if (response.success) {
                alert(response.message);
                navigate('/');
            } else {
                setError(response.message);
            }
        } catch (err: any) {
            if (err.response && err.response.data && err.response.data.message) {
                setError(err.response.data.message);
            } else {
                setError('Ocurrió un error inesperado al guardar.');
            }
        } finally {
            setLoading(false);
        }
    };

    if (loading && isEdit && !form.nombre) return <p>Cargando...</p>;

    return (
        <div className="card">
            <h2>{isEdit ? 'Editar Producto' : 'Nuevo Producto'}</h2>

            {error && (
                <div style={{ backgroundColor: '#ffebee', color: '#c62828', padding: '10px', borderRadius: '4px', marginBottom: '15px' }}>
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '400px', margin: '0 auto' }}>
                <input placeholder="Nombre" required value={form.nombre} onChange={e => setForm({...form, nombre: e.target.value})} />
                <input placeholder="Categoría" required value={form.categoria} onChange={e => setForm({...form, categoria: e.target.value})} />
                <textarea placeholder="Descripción" value={form.descripcion} onChange={e => setForm({...form, descripcion: e.target.value})} />
                <input placeholder="URL Imagen" value={form.imagen} onChange={e => setForm({...form, imagen: e.target.value})} />
                <label>Precio: <input type="number" step="0.01" required value={form.precio} onChange={e => setForm({...form, precio: parseFloat(e.target.value)})} /></label>

                {}
                <label>Stock Inicial: <input type="number" required value={form.stock} onChange={e => setForm({...form, stock: parseInt(e.target.value)})} /></label>

                <button type="submit" disabled={loading}>{loading ? 'Guardando...' : 'Guardar'}</button>
                <button type="button" onClick={() => navigate('/')} style={{ backgroundColor: '#666' }}>Cancelar</button>
            </form>
        </div>
    );
}