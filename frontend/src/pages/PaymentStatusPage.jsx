import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import Layout from '../components/Layout';
import { getPaymentStatus, exportExcel } from '../api/auth';
import './PaymentStatusPage.css';

function fmtCFA(n) { return (n??0).toLocaleString('fr-FR') + ' FCFA'; }
function fmt(n) { return (n??0).toLocaleString('fr-FR', { maximumFractionDigits:1 }); }
function getInitials(fn,ln) { return `${(fn||'')[0]||''}${(ln||'')[0]||''}`.toUpperCase()||'?'; }

const STATUS_BADGE = {
  paid:    { cls: 'badge-success', label: 'Payé' },
  pending: { cls: 'badge-warning', label: 'En attente' },
  partial: { cls: 'badge-info',    label: 'Partiel' },
};

export default function PaymentStatusPage() {
  const [data,    setData]    = useState([]);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    let active = true;
    async function load() {
      try {
        setLoading(true);
        const res = await getPaymentStatus();
        if (active) setData(res.data.teachers || res.data || []);
      } catch { toast.error('Impossible de charger les données de paiement'); }
      finally { if(active) setLoading(false); }
    }
    load();
    return () => { active = false; };
  }, []);

  async function handleExport() {
    try {
      setExporting(true);
      const res = await exportExcel();
      const url = URL.createObjectURL(new Blob([res.data]));
      const a = document.createElement('a');
      a.href = url;
      a.download = `rapport_paiements_${new Date().toISOString().split('T')[0]}.xlsx`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success('Export Excel téléchargé');
    } catch { toast.error('Erreur lors de l\'export'); }
    finally { setExporting(false); }
  }

  const totalDue  = data.reduce((s,t) => s + parseFloat(t.amount_due||0), 0);
  const overLimit = data.filter(t => parseFloat(t.complementary_etd||0) > 0).length;

  return (
    <Layout title="État de paiement" subtitle="Montants dus aux enseignants pour les heures complémentaires">
      {/* KPIs */}
      <div className="kpi-grid" style={{ marginBottom: 20 }}>
        <div className="kpi-card animate-in">
          <div className="kpi-card__icon" style={{ background:'#22c55e20', color:'#22c55e' }}>
            <span className="material-symbols-outlined" style={{fontSize:20}}>payments</span>
          </div>
          <div className="kpi-card__label">Total à régler</div>
          <div className="kpi-card__value" style={{fontSize:20}}>{loading?'—':fmtCFA(totalDue)}</div>
          <div className="kpi-card__sub">toutes heures complémentaires</div>
        </div>
        <div className="kpi-card animate-in">
          <div className="kpi-card__icon" style={{ background:'#f59e0b20', color:'#f59e0b' }}>
            <span className="material-symbols-outlined" style={{fontSize:20}}>warning</span>
          </div>
          <div className="kpi-card__label">Enseignants concernés</div>
          <div className="kpi-card__value">{loading?'—':overLimit}</div>
          <div className="kpi-card__sub">avec heures complémentaires</div>
        </div>
      </div>

      {/* Table */}
      <div className="card" style={{ padding:0, overflow:'hidden' }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'14px 20px', borderBottom:'1px solid var(--border)' }}>
          <h3 style={{ fontSize:14, fontWeight:700 }}>Récapitulatif par enseignant</h3>
          <button className="btn btn-secondary btn-sm" onClick={handleExport} disabled={exporting}>
            <span className="material-symbols-outlined" style={{fontSize:14}}>download</span>
            {exporting ? 'Export…' : 'Exporter Excel'}
          </button>
        </div>

        <div className="data-table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Enseignant</th>
                <th>Grade / Statut</th>
                <th style={{textAlign:'right'}}>Service (h ETD)</th>
                <th style={{textAlign:'right'}}>Réalisé (h ETD)</th>
                <th style={{textAlign:'right'}}>Complémentaires</th>
                <th style={{textAlign:'right'}}>Taux horaire</th>
                <th style={{textAlign:'right'}}>Montant dû</th>
              </tr>
            </thead>
            <tbody>
              {loading ? Array.from({length:5}).map((_,i)=>(
                <tr key={i}>{Array.from({length:7}).map((_,j)=><td key={j}><div className="skeleton" style={{height:13,width:'75%',borderRadius:4}}/></td>)}</tr>
              )) : data.length===0 ? (
                <tr><td colSpan={7}><div className="empty-state"><span className="material-symbols-outlined">payments</span><h4>Aucune donnée de paiement</h4><p>Les données apparaîtront une fois les heures validées.</p></div></td></tr>
              ) : data.map((t,i) => (
                <tr key={t.teacher_id||i}>
                  <td>
                    <div style={{ display:'flex', alignItems:'center', gap:9 }}>
                      <div style={{ width:28,height:28,borderRadius:'50%',background:'var(--primary-light)',color:'var(--primary)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:10,fontWeight:700,flexShrink:0 }}>
                        {getInitials(t.first_name, t.last_name)}
                      </div>
                      <div>
                        <div style={{ fontWeight:600, fontSize:13 }}>{t.first_name} {t.last_name}</div>
                        <div style={{ fontSize:11, color:'var(--text-faint)' }}>{t.department_name||'—'}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{fontSize:12}}>
                    <div style={{textTransform:'capitalize'}}>{(t.grade||'').replace('_',' ')}</div>
                    <span className={`badge ${t.status==='permanent'?'badge-success':'badge-info'}`} style={{marginTop:2}}>{t.status}</span>
                  </td>
                  <td style={{textAlign:'right',fontSize:13}}>{fmt(t.contractual_hours)} h</td>
                  <td style={{textAlign:'right',fontSize:13,fontWeight:600}}>{fmt(t.total_etd)} h</td>
                  <td style={{textAlign:'right'}}>
                    {parseFloat(t.complementary_etd||0)>0
                      ? <span className="badge badge-warning">{fmt(t.complementary_etd)} h</span>
                      : <span style={{fontSize:12,color:'var(--text-faint)'}}>—</span>
                    }
                  </td>
                  <td style={{textAlign:'right',fontSize:12,color:'var(--text-muted)'}}>{fmtCFA(t.hourly_rate)}/h</td>
                  <td style={{textAlign:'right',fontWeight:700}}>
                    {parseFloat(t.amount_due||0)>0
                      ? <span style={{color:'var(--success)'}}>{fmtCFA(t.amount_due)}</span>
                      : <span style={{fontSize:12,color:'var(--text-faint)'}}>—</span>
                    }
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
}
