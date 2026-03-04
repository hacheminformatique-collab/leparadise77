import { useState, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import SignatureCanvas from 'react-signature-canvas'
import { getClients, saveClients } from '../../utils/storage'
import { generatePDF } from '../PDF/generatePDF'

function formatMoney(n) {
  return Number(n || 0).toLocaleString('fr-FR', { minimumFractionDigits: 2 }) + ' €'
}

export default function EspaceClient() {
  const { devisId } = useParams()
  const navigate = useNavigate()
  const sigRef = useRef(null)

  const clients = getClients()
  const devis = clients.find((c) => c.id === devisId)

  const [signed, setSigned] = useState(!!devis?.signature)
  const [signatureData, setSignatureData] = useState(devis?.signature || null)
  const [showSig, setShowSig] = useState(false)

  if (!devis) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8f5f0' }}>
        <div className="card" style={{ textAlign: 'center', maxWidth: '400px' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>😕</div>
          <h2>Devis introuvable</h2>
          <p className="text-muted mt-1">Ce lien de devis n&apos;est pas valide ou a expiré.</p>
          <button className="btn btn-primary mt-3" onClick={() => navigate('/')}>Retour à l&apos;accueil</button>
        </div>
      </div>
    )
  }

  const nbPersonnes = devis.nbPersonnes || 0
  const prixSalle = devis.prixSalle || 0
  const menuTotal = (devis.menus || []).reduce((s, m) => s + (m.tarif || 0), 0) * nbPersonnes
  const gateauTotal = (devis.gateau?.tarif || 0) * nbPersonnes
  const prestationsTotal = (devis.prestations || []).reduce((s, p) => s + (p.tarif || 0), 0)
  const totalTTC = prixSalle + menuTotal + gateauTotal + prestationsTotal

  function handleSign() {
    if (sigRef.current?.isEmpty()) return
    const sigData = sigRef.current.toDataURL()
    const updated = clients.map((c) =>
      c.id === devisId ? { ...c, signature: sigData, status: 'signé', signedAt: new Date().toISOString() } : c
    )
    saveClients(updated)
    setSignatureData(sigData)
    setSigned(true)
    setShowSig(false)
  }

  function clearSig() {
    sigRef.current?.clear()
  }

  const statusColor = devis.status === 'signé' ? '#27ae60' : devis.status === 'annulé' ? '#e74c3c' : '#c9a84c'

  return (
    <div style={{ minHeight: '100vh', background: '#f8f5f0', paddingBottom: '40px' }}>
      {/* Header */}
      <div style={{ background: '#1a1a2e', padding: '20px 24px' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ color: '#c9a84c', fontWeight: '800', fontSize: '20px' }}>LE PARADISE</div>
            <div style={{ color: '#aaa', fontSize: '12px' }}>Espace client</div>
          </div>
          <div style={{ color: 'white', textAlign: 'right' }}>
            <div style={{ fontWeight: '700' }}>{devis.prenom} {devis.nom}</div>
            <div style={{ fontSize: '12px', color: '#aaa' }}>{devis.devisNumber}</div>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '32px 24px' }}>
        {/* Status banner */}
        <div style={{
          background: 'white', borderRadius: '12px', padding: '20px', marginBottom: '24px',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          borderLeft: `4px solid ${statusColor}`
        }}>
          <div>
            <div style={{ fontWeight: '700', fontSize: '16px' }}>Devis {devis.devisNumber}</div>
            <div style={{ color: '#888', fontSize: '13px' }}>
              Créé le {new Date(devis.createdAt).toLocaleDateString('fr-FR')}
            </div>
          </div>
          <div>
            <span style={{ background: statusColor + '22', color: statusColor, padding: '6px 16px', borderRadius: '20px', fontWeight: '700', fontSize: '14px' }}>
              {devis.status || 'En cours'}
            </span>
          </div>
        </div>

        {/* Event summary */}
        <div className="card mb-3">
          <h3 style={{ marginBottom: '16px', color: '#1a1a2e' }}>🎉 Votre événement</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '14px' }}>
            <div>
              <span style={{ color: '#888' }}>Type d&apos;événement</span>
              <div style={{ fontWeight: '600' }}>{devis.typeEvenement}</div>
            </div>
            <div>
              <span style={{ color: '#888' }}>Date</span>
              <div style={{ fontWeight: '600' }}>
                {devis.dateEvenement ? new Date(devis.dateEvenement).toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) : '—'}
              </div>
            </div>
            <div>
              <span style={{ color: '#888' }}>Nombre de personnes</span>
              <div style={{ fontWeight: '600' }}>{devis.nbPersonnes}</div>
            </div>
            <div>
              <span style={{ color: '#888' }}>Formule</span>
              <div style={{ fontWeight: '600' }}>{devis.formule?.nomFormule}</div>
            </div>
            {devis.heureDebut && (
              <div>
                <span style={{ color: '#888' }}>Horaires</span>
                <div style={{ fontWeight: '600' }}>{devis.heureDebut} — {devis.heureFin}</div>
              </div>
            )}
          </div>
        </div>

        {/* Pricing */}
        <div className="card mb-3">
          <h3 style={{ marginBottom: '16px', color: '#1a1a2e' }}>💰 Détail tarifaire</h3>
          <table style={{ width: '100%', fontSize: '14px', borderCollapse: 'collapse' }}>
            <tbody>
              {prixSalle > 0 && (
                <tr style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '10px 0' }}>Location salle — {devis.formule?.nomFormule}</td>
                  <td style={{ padding: '10px 0', textAlign: 'right', fontWeight: '600' }}>{formatMoney(prixSalle)}</td>
                </tr>
              )}
              {(devis.menus || []).filter((m) => m.tarif > 0).map((m) => (
                <tr key={m.id} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '8px 0', paddingLeft: '16px', color: '#666' }}>
                    {m.nomMenu} × {nbPersonnes} pers.
                  </td>
                  <td style={{ padding: '8px 0', textAlign: 'right', color: '#666' }}>{formatMoney(m.tarif * nbPersonnes)}</td>
                </tr>
              ))}
              {gateauTotal > 0 && (
                <tr style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '8px 0', paddingLeft: '16px', color: '#666' }}>
                    {devis.gateau?.nomGateau} × {nbPersonnes} pers.
                  </td>
                  <td style={{ padding: '8px 0', textAlign: 'right', color: '#666' }}>{formatMoney(gateauTotal)}</td>
                </tr>
              )}
              {(devis.prestations || []).map((p) => (
                <tr key={p.id} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '8px 0', paddingLeft: '16px', color: '#666' }}>{p.nomPresta}</td>
                  <td style={{ padding: '8px 0', textAlign: 'right', color: '#666' }}>{formatMoney(p.tarif)}</td>
                </tr>
              ))}
              <tr style={{ background: '#1a1a2e', color: 'white' }}>
                <td style={{ padding: '14px 12px', fontWeight: '700', fontSize: '16px' }}>TOTAL TTC</td>
                <td style={{ padding: '14px 12px', textAlign: 'right', fontWeight: '800', fontSize: '20px', color: '#c9a84c' }}>
                  {formatMoney(totalTTC)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Actions */}
        <div className="card mb-3">
          <h3 style={{ marginBottom: '16px', color: '#1a1a2e' }}>📋 Actions</h3>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <button
              className="btn btn-primary"
              onClick={() => generatePDF(devis)}
            >
              📄 Télécharger le devis PDF
            </button>

            {devis.status !== 'signé' && (
              <button
                className="btn btn-dark"
                onClick={() => setShowSig(true)}
              >
                ✍️ Signer le devis
              </button>
            )}
          </div>
        </div>

        {/* Signature panel */}
        {showSig && (
          <div className="card mb-3">
            <h3 style={{ marginBottom: '8px', color: '#1a1a2e' }}>✍️ Signature électronique</h3>
            <p className="text-muted mb-2" style={{ fontSize: '13px' }}>
              En signant ce devis, vous acceptez les conditions générales de vente.
            </p>
            <div style={{ border: '2px dashed #c9a84c', borderRadius: '10px', overflow: 'hidden', background: 'white' }}>
              <SignatureCanvas
                ref={sigRef}
                penColor="#1a1a2e"
                canvasProps={{ width: 700, height: 180, style: { width: '100%', height: '180px' } }}
              />
            </div>
            <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
              <button className="btn btn-outline btn-sm" onClick={clearSig}>Effacer</button>
              <button className="btn btn-primary" onClick={handleSign}>✅ Valider la signature</button>
              <button className="btn btn-sm" style={{ background: '#eee', color: '#444' }} onClick={() => setShowSig(false)}>Annuler</button>
            </div>
          </div>
        )}

        {/* Signed confirmation */}
        {signed && signatureData && (
          <div style={{ background: '#d4edda', border: '1px solid #c3e6cb', borderRadius: '12px', padding: '16px', marginBottom: '16px' }}>
            <div style={{ color: '#155724', fontWeight: '700', marginBottom: '8px' }}>✅ Devis signé électroniquement</div>
            <img src={signatureData} alt="Signature" style={{ maxWidth: '200px', border: '1px solid #ccc', borderRadius: '6px', background: 'white' }} />
            {devis.signedAt && (
              <div style={{ color: '#155724', fontSize: '12px', marginTop: '8px' }}>
                Signé le {new Date(devis.signedAt).toLocaleDateString('fr-FR')}
              </div>
            )}
          </div>
        )}

        {/* Contact */}
        <div className="card">
          <h3 style={{ marginBottom: '12px', color: '#1a1a2e' }}>📞 Contact</h3>
          <div style={{ fontSize: '14px', lineHeight: '1.8', color: '#555' }}>
            <p>📍 5 avenue Fridingen, 77100 Nanteuil les Meaux</p>
            <p>📞 0782281582</p>
            <p>✉️ contact@leparadise77.fr</p>
            <p>🏢 SARL AFM — RCS de Meaux : 904543816</p>
          </div>
        </div>
      </div>
    </div>
  )
}
