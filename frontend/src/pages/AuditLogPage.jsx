import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import Layout from '../components/Layout';
import { getAuditLogs } from '../api/auth';
import './AuditLogPage.css';

function fmtDateTime(s) {
  if (!s) return '—';
  return new Date(s).toLocaleString('fr-FR', { day:'2-digit', month:'short', year:'numeric', hour:'2-digit', minute:'2-digit' });
}

const METHOD_BADGE = {
  POST:   'badge-success',
  PUT:    'badge-primary',
  DELETE: 'badge-danger',
  GET:    'badge-neutral',
};

export default function AuditLogPage() {
  const [logs,    setLogs]    = useState([]);
  const [loading, setLoading] = useState(true);
  const [page,    setPage]    = useState(1);
  const [total,   setTotal]   = useState(0);
  const [search,  setSearch]  = useState('');
  const LIMIT = 20;

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const res = await getAuditLogs({ page, limit: LIMIT, search: search || undefined });
      setLogs(res.data.logs || res.data || []);
      setTotal(res.data.pagination?.total || res.data.total || 0);
    } catch { toast.error('Impossible de charger les logs'); }
    finally { setLoading(false); }
  }, [page, search]);

  useEffect(() => { load(); }, [load]);

  const totalPages = Math.ceil(total / LIMIT);

  return (
    <Layout title="Journal d'audit" subtitle="Historique complet des actions effectuées dans le système">
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        {/* Toolbar */}
        <div style={{ display:'flex', alignItems:'center', gap:10, padding:'14px 20px', borderBottom:'1px solid var(--border)' }}>
          <div className="topbar__search" style={{ maxWidth:320 }}>
            <span className="material-symbols-outlined">search</span>
            <input type="text" placeholder="Rechercher une action, un endpoint…"
              value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} />
          </div>
          <span style={{ marginLeft:'auto', fontSize:12, color:'var(--text-faint)' }}>{total} entrée(s)</span>
        </div>

        {/* Table */}
        <div className="data-table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Date / Heure</th>
                <th>Utilisateur</th>
                <th>Méthode</th>
                <th>Endpoint</th>
                <th>Détails</th>
              </tr>
            </thead>
            <tbody>
              {loading ? Array.from({length:8}).map((_,i)=>(
                <tr key={i}>{Array.from({length:5}).map((_,j)=><td key={j}><div className="skeleton" style={{height:13,width:'70%',borderRadius:4}}/></td>)}</tr>
              )) : logs.length===0 ? (
                <tr><td colSpan={5}><div className="empty-state"><span className="material-symbols-outlined">history</span><h4>Aucune entrée de log</h4></div></td></tr>
              ) : logs.map(log => (
                <tr key={log.id}>
                  <td style={{fontSize:11,color:'var(--text-muted)',whiteSpace:'nowrap'}}>{fmtDateTime(log.created_at)}</td>
                  <td style={{fontSize:12}}>{log.user_email || `#${log.user_id}` || '—'}</td>
                  <td><span className={`badge ${METHOD_BADGE[log.action]||'badge-neutral'}`}>{log.action}</span></td>
                  <td style={{fontSize:12,color:'var(--text-muted)',fontFamily:'monospace'}}>{log.table_name}</td>
                  <td style={{fontSize:11,color:'var(--text-faint)',maxWidth:220,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>
                    {log.details ? JSON.stringify(log.details).substring(0,80) : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'12px 20px', borderTop:'1px solid var(--border)' }}>
            <span style={{ fontSize:12, color:'var(--text-faint)' }}>Page {page} / {totalPages}</span>
            <div style={{ display:'flex', gap:6 }}>
              <button className="btn btn-ghost btn-sm" disabled={page===1} onClick={() => setPage(p=>p-1)}>
                <span className="material-symbols-outlined" style={{fontSize:16}}>chevron_left</span>
              </button>
              <button className="btn btn-ghost btn-sm" disabled={page===totalPages} onClick={() => setPage(p=>p+1)}>
                <span className="material-symbols-outlined" style={{fontSize:16}}>chevron_right</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
