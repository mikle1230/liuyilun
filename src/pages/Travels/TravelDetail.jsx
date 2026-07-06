import { useParams, Link } from 'react-router-dom'
import './TravelsPage.css'

export default function TravelDetail() {
  const { slug } = useParams()
  return (
    <div className="travels-page" style={{ paddingTop: 100 }}>
      <div className="container-narrow">
        <Link to="/travels" className="back-link">← Back</Link>
        <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'var(--text-2xl)', color: 'var(--text)' }}>{slug}</h1>
      </div>
    </div>
  )
}
