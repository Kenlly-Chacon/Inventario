import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { productService } from '../services/productService';
import { transactionService } from '../services/transactionService';
import type { Product } from '../models/Product';
import type { Transaction, TransactionCreateDto } from '../models/Transaction';

export default function TransactionManager() {
    const { productId } = useParams();
    const navigate = useNavigate();

    const [product, setProduct] = useState<Product | null>(null);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [msg, setMsg] = useState<{type: 'success'|'error', text: string} | null>(null);

    // Filtros
    const [filterType, setFilterType] = useState('TODAS');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    // Estado para Edición
    const [editingId, setEditingId] = useState<number | null>(null);

    const [formTrans, setFormTrans] = useState<TransactionCreateDto>({
        productoId: Number(productId),
        tipoTransaccion: 'COMPRA',
        cantidad: 1,
        precioUnitario: 0,
        detalle: ''
    });

    const loadData = async () => {
        if (!productId) return;

        const pResponse = await productService.getById(Number(productId));
        if (pResponse.success && pResponse.data) {
            setProduct(pResponse.data);
            if (editingId === null) {
                setFormTrans(prev => ({ ...prev, precioUnitario: pResponse.data!.precio }));
            }
        }

        const tResponse = await transactionService.getByProduct(Number(productId));
        if (tResponse.success && tResponse.data) {
            setTransactions(tResponse.data);
        }
    };

    useEffect(() => {
        loadData();
    }, [productId]);

    const filteredTransactions = transactions.filter(t => {
        if (filterType !== 'TODAS' && t.tipoTransaccion !== filterType) return false;

        const transDate = new Date(t.fecha).setHours(0,0,0,0);

        if (startDate) {
            const start = new Date(startDate + 'T00:00:00').setHours(0,0,0,0);
            if (transDate < start) return false;
        }
        if (endDate) {
            const end = new Date(endDate + 'T00:00:00').setHours(0,0,0,0);
            if (transDate > end) return false;
        }
        return true;
    });

    const handleEditClick = (t: Transaction) => {
        setEditingId(t.id);
        setFormTrans({
            productoId: t.productoId,
            tipoTransaccion: t.tipoTransaccion,
            cantidad: t.cantidad,
            precioUnitario: t.precioUnitario,
            detalle: t.detalle || ''
        });
        setMsg(null);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleCancelEdit = () => {
        setEditingId(null);
        setFormTrans({
            productoId: Number(productId),
            tipoTransaccion: 'COMPRA',
            cantidad: 1,
            precioUnitario: product?.precio || 0,
            detalle: ''
        });
        setMsg(null);
    };

    const handleDelete = async (id: number) => {
        if (!confirm('¿Seguro que deseas eliminar esta transacción? Esto podría afectar el stock.')) return;

        try {
            const res = await transactionService.delete(id);
            if (res.success) {
                setMsg({ type: 'success', text: res.message });
                loadData();
            } else {
                setMsg({ type: 'error', text: res.message });
            }
        } catch (error) {
            setMsg({ type: 'error', text: "Error al eliminar." });
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMsg(null);

        if (formTrans.cantidad <= 0) {
            setMsg({ type: 'error', text: "La cantidad debe ser mayor a 0." });
            return;
        }

        try {
            let res;
            if (editingId) {
                res = await transactionService.update(editingId, formTrans);
            } else {
                res = await transactionService.create({ ...formTrans, productoId: Number(productId) });
            }

            if (res.success) {
                setMsg({ type: 'success', text: res.message });
                loadData();
                if (!editingId) {
                    setFormTrans(prev => ({ ...prev, cantidad: 1, detalle: '' }));
                } else {
                    handleCancelEdit();
                }
            } else {
                setMsg({ type: 'error', text: res.message });
            }
        } catch (error: any) {
            const errorMsg = error.response?.data?.message || "Error al procesar la solicitud.";
            setMsg({ type: 'error', text: errorMsg });
        }
    };

    if (!product) return <div className="container"><p>Cargando producto...</p></div>;

    return (
        <div className="container">
            <button onClick={() => navigate('/')} style={{ marginBottom: '1rem', cursor:'pointer' }}>&larr; Volver al Inventario</button>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h1>Gestión: {product.nombre}</h1>
                <div style={{ textAlign: 'right', background: '#f5f5f5', padding: '10px', borderRadius: '8px' }}>
                    <small>Stock Actual</small>
                    <div style={{ fontSize: '1.5em', fontWeight: 'bold', color: product.stock < 5 ? 'red' : 'green' }}>
                        {product.stock}
                    </div>
                </div>
            </div>

            {msg && (
                <div style={{
                    padding: '10px', margin: '10px 0', borderRadius: '5px',
                    backgroundColor: msg.type === 'success' ? '#d4edda' : '#f8d7da',
                    color: msg.type === 'success' ? '#155724' : '#721c24'
                }}>
                    {msg.text}
                </div>
            )}

            <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start', flexWrap: 'wrap', marginTop: '20px' }}>

                {/* FORMULARIO */}
                <div className="card" style={{ flex: '1 1 300px', border: editingId ? '2px solid #ffa500' : '1px solid #ddd' }}>
                    <h3>{editingId ? 'Editar Transacción' : 'Registrar Movimiento'}</h3>
                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        <label>
                            Tipo:
                            <select
                                value={formTrans.tipoTransaccion}
                                onChange={e => setFormTrans({...formTrans, tipoTransaccion: e.target.value as any})}
                                style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                            >
                                <option value="COMPRA">Entrada (Compra)</option>
                                <option value="VENTA">Salida (Venta)</option>
                            </select>
                        </label>

                        <label>Cantidad:
                            <input type="number" min="1" value={formTrans.cantidad} onChange={e => setFormTrans({...formTrans, cantidad: parseInt(e.target.value)})} style={{ width: '100%', padding: '8px' }} />
                        </label>

                        <label>Precio Unitario ($):
                            <input type="number" step="0.01" value={formTrans.precioUnitario} onChange={e => setFormTrans({...formTrans, precioUnitario: parseFloat(e.target.value)})} style={{ width: '100%', padding: '8px' }} />
                        </label>

                        <label>Detalle:
                            <input placeholder="Ej: Venta mostrador..." value={formTrans.detalle} onChange={e => setFormTrans({...formTrans, detalle: e.target.value})} style={{ width: '100%', padding: '8px' }} />
                        </label>

                        <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                            <button type="submit" style={{ flex: 1, backgroundColor: editingId ? '#ffa500' : (formTrans.tipoTransaccion === 'VENTA' ? '#e67e22' : '#27ae60') }}>
                                {editingId ? 'Actualizar' : 'Registrar'}
                            </button>
                            {editingId && (
                                <button type="button" onClick={handleCancelEdit} style={{ backgroundColor: '#666' }}>
                                    Cancelar
                                </button>
                            )}
                        </div>
                    </form>
                </div>

                {}
                <div style={{ flex: '2 1 500px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h3>Historial</h3>
                    </div>

                    {/* Filtros */}
                    <div className="card" style={{ padding: '15px', marginBottom: '15px', display: 'flex', gap: '15px', alignItems: 'center', flexWrap: 'wrap', backgroundColor: '#fafafa' }}>
                        <div>
                            <label style={{ fontSize: '0.8em', display: 'block' }}>Tipo</label>
                            <select value={filterType} onChange={e => setFilterType(e.target.value)} style={{ padding: '5px' }}>
                                <option value="TODAS">Todas</option>
                                <option value="COMPRA">Compras</option>
                                <option value="VENTA">Ventas</option>
                            </select>
                        </div>
                        <div>
                            <label style={{ fontSize: '0.8em', display: 'block' }}>Desde</label>
                            <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} style={{ padding: '4px' }}/>
                        </div>
                        <div>
                            <label style={{ fontSize: '0.8em', display: 'block' }}>Hasta</label>
                            <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} style={{ padding: '4px' }}/>
                        </div>
                        <div style={{ flexGrow: 1, textAlign: 'right' }}>
                            <button
                                onClick={() => { setFilterType('TODAS'); setStartDate(''); setEndDate(''); }}
                                style={{ fontSize: '0.8em', padding: '6px 12px', backgroundColor: '#999' }}
                            >
                                Limpiar
                            </button>
                        </div>
                    </div>

                    {}
                    <div style={{ overflowX: 'auto', border: '1px solid #eee', borderRadius: '8px' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9em' }}>
                            <thead>
                            <tr style={{ backgroundColor: '#333', color: 'white', textAlign: 'left' }}>
                                <th style={{ padding: '10px' }}>Fecha</th>
                                <th style={{ padding: '10px' }}>Tipo</th>
                                <th style={{ padding: '10px' }}>Cant.</th>
                                <th style={{ padding: '10px' }}>Precio</th>
                                <th style={{ padding: '10px' }}>Total</th>
                                <th style={{ padding: '10px' }}>Detalle</th>
                                <th style={{ padding: '10px', textAlign: 'center' }}>Acciones</th>
                            </tr>
                            </thead>
                            <tbody>
                            {filteredTransactions.length === 0 ? (
                                <tr><td colSpan={7} style={{ textAlign: 'center', padding: '20px', color: '#666' }}>No se encontraron transacciones.</td></tr>
                            ) : (
                                filteredTransactions.map(t => (
                                    <tr key={t.id} style={{ borderBottom: '1px solid #eee' }}>
                                        <td style={{ padding: '10px' }}>
                                            {new Date(t.fecha).toLocaleDateString()} <br/>
                                            <span style={{ fontSize: '0.8em', color: '#888' }}>{new Date(t.fecha).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                                        </td>
                                        <td style={{ padding: '10px' }}>
                                            <span style={{
                                                padding: '4px 8px', borderRadius: '4px', fontSize: '0.8em', fontWeight: 'bold',
                                                backgroundColor: t.tipoTransaccion === 'VENTA' ? '#ffebee' : '#e8f5e9',
                                                color: t.tipoTransaccion === 'VENTA' ? '#c62828' : '#2e7d32'
                                            }}>
                                                {t.tipoTransaccion}
                                            </span>
                                        </td>
                                        <td style={{ padding: '10px', fontWeight: 'bold' }}>{t.cantidad}</td>
                                        <td style={{ padding: '10px' }}>${t.precioUnitario.toFixed(2)}</td>
                                        <td style={{ padding: '10px' }}>${t.precioTotal.toFixed(2)}</td>
                                        <td style={{ padding: '10px', maxWidth: '150px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={t.detalle || ''}>
                                            {t.detalle || '-'}
                                        </td>
                                        <td style={{ padding: '10px', textAlign: 'center' }}>
                                            <button
                                                onClick={() => handleEditClick(t)}
                                                style={{ marginRight: '5px', padding: '4px 8px', fontSize: '0.8em', backgroundColor: '#ffc107', color: 'black' }}
                                                title="Editar"
                                            >
                                                ✐
                                            </button>
                                            <button
                                                onClick={() => handleDelete(t.id)}
                                                style={{ padding: '4px 8px', fontSize: '0.8em', backgroundColor: '#dc3545' }}
                                                title="Eliminar"
                                            >
                                                ✕
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}