import { useEffect, useState } from 'react'
import {
  Activity,
  ArrowUpRight,
  Bike,
  Check,
  ChevronRight,
  Clock3,
  Dumbbell,
  Footprints,
  Flame,
  House,
  Plus,
  Sparkles,
  Target,
  Trophy,
  Users,
  X,
  Zap,
} from 'lucide-react'
import mascot from '../../../docs/octofitapp-small.png'
import './App.css'

const navigation = [
  { id: 'overview', label: 'Aperçu', Icon: House },
  { id: 'activity', label: 'Activité', Icon: Activity },
  { id: 'teams', label: 'Équipes', Icon: Users },
  { id: 'leaderboard', label: 'Classement', Icon: Trophy },
  { id: 'workouts', label: 'Séances', Icon: Dumbbell },
]

const activityKinds = {
  run: { label: 'Course', detail: 'Course', Icon: Footprints, tone: 'coral' },
  walk: { label: 'Marche', detail: 'Marche', Icon: Activity, tone: 'mint' },
  ride: { label: 'Vélo', detail: 'Cyclisme', Icon: Bike, tone: 'blue' },
  strength: { label: 'Renforcement', detail: 'Force', Icon: Dumbbell, tone: 'gold' },
}

const startingActivities = [
  {
    id: 1,
    title: 'Course au parc',
    detail: 'Course · 4,2 km',
    time: 'Aujourd’hui · 08:14',
    duration: '32 min',
    points: '+96 pts',
    Icon: Footprints,
    tone: 'coral',
  },
  {
    id: 2,
    title: 'Renforcement',
    detail: 'Force · poids du corps',
    time: 'Hier · 17:30',
    duration: '28 min',
    points: '+84 pts',
    Icon: Dumbbell,
    tone: 'gold',
  },
  {
    id: 3,
    title: 'Tour à vélo',
    detail: 'Cyclisme · 8,5 km',
    time: 'Mercredi · 16:12',
    duration: '26 min',
    points: '+78 pts',
    Icon: Bike,
    tone: 'blue',
  },
]

const week = [
  { day: 'Lun', steps: 5600, minutes: 28 },
  { day: 'Mar', steps: 8200, minutes: 42 },
  { day: 'Mer', steps: 4900, minutes: 24 },
  { day: 'Jeu', steps: 7100, minutes: 36 },
  { day: 'Ven', steps: 9800, minutes: 51 },
  { day: 'Sam', steps: 8420, minutes: 54 },
  { day: 'Dim', steps: 2100, minutes: 12 },
]

const classmates = [
  { name: 'Noah', team: 'Les Comètes', points: '1 480', initials: 'N', tone: 'avatar-coral' },
  { name: 'Mila', team: 'Les Comètes', points: '1 248', initials: 'M', tone: 'avatar-mint' },
  { name: 'Inès', team: 'Les Comètes', points: '1 190', initials: 'I', tone: 'avatar-blue' },
]

const referenceDate = new Date()

function formatNumber(value) {
  return new Intl.NumberFormat('fr-FR').format(value)
}

function App() {
  const [activeSection, setActiveSection] = useState('overview')
  const [chartMode, setChartMode] = useState('steps')
  const [activities, setActivities] = useState(startingActivities)
  const [activeMinutes, setActiveMinutes] = useState(54)
  const [calories, setCalories] = useState(462)
  const [modalOpen, setModalOpen] = useState(false)
  const [activityType, setActivityType] = useState('run')
  const [duration, setDuration] = useState('30')
  const [distance, setDistance] = useState('')
  const todayIndex = (referenceDate.getDay() + 6) % 7
  const todayLabel = new Intl.DateTimeFormat('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  }).format(referenceDate)
  const chartValues = week.map((day, index) => (
    index === todayIndex && chartMode === 'minutes'
      ? { ...day, minutes: activeMinutes }
      : day
  ))
  const chartMax = chartMode === 'steps' ? 12000 : 70
  const weekTotal = chartValues.reduce((total, day) => total + day[chartMode], 0)

  useEffect(() => {
    if (!modalOpen) return undefined
    const closeOnEscape = (event) => {
      if (event.key === 'Escape') setModalOpen(false)
    }
    window.addEventListener('keydown', closeOnEscape)
    return () => window.removeEventListener('keydown', closeOnEscape)
  }, [modalOpen])

  function openActivityForm(type = 'run') {
    setActivityType(type)
    setModalOpen(true)
  }

  function addActivity(event) {
    event.preventDefault()
    const minutes = Number(duration)
    const kind = activityKinds[activityType]
    const distanceLabel = distance ? ` · ${distance.replace('.', ',')} km` : ''

    setActivities((current) => [
      {
        id: Date.now(),
        title: kind.label,
        detail: `${kind.detail}${activityType === 'strength' ? '' : distanceLabel}`,
        time: `Aujourd’hui · ${new Intl.DateTimeFormat('fr-FR', { hour: '2-digit', minute: '2-digit' }).format(new Date())}`,
        duration: `${minutes} min`,
        points: `+${minutes * 3} pts`,
        Icon: kind.Icon,
        tone: kind.tone,
      },
      ...current,
    ])
    setActiveMinutes((current) => current + minutes)
    setCalories((current) => current + Math.round(minutes * 7.5))
    setDuration('30')
    setDistance('')
    setModalOpen(false)
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <a className="brand" href="#overview" onClick={() => setActiveSection('overview')}>
          <img src={mascot} alt="" />
          <span className="brand-wordmark">OCTOFIT<span>TRACKER</span></span>
        </a>

        <p className="nav-caption">ESPACE ÉLÈVE</p>
        <nav className="side-nav" aria-label="Navigation principale">
          {navigation.map(({ id, label, Icon }) => (
            <a
              key={id}
              className={activeSection === id ? 'nav-link active' : 'nav-link'}
              href={`#${id}`}
              onClick={() => setActiveSection(id)}
            >
              <Icon size={19} strokeWidth={1.9} aria-hidden="true" />
              <span>{label}</span>
              {id === 'activity' && <span className="nav-dot" aria-label="Nouvelle activité" />}
            </a>
          ))}
        </nav>

        <div className="sidebar-challenge">
          <span className="challenge-icon"><Zap size={16} fill="currentColor" /></span>
          <span className="eyebrow">DÉFI DE LA SEMAINE</span>
          <strong>En route vers 50 km</strong>
          <div className="challenge-progress"><span /></div>
          <small>32,4 km parcourus</small>
        </div>

        <div className="sidebar-profile">
          <div className="profile-avatar">ML</div>
          <div className="profile-copy"><strong>Mila Laurent</strong><span>Classe de 3e</span></div>
          <span className="profile-status" aria-label="En ligne" />
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div>
            <p className="topbar-date">{todayLabel.charAt(0).toUpperCase() + todayLabel.slice(1)}</p>
            <p className="demo-note"><span /> DONNÉES DE DÉMO</p>
          </div>
          <div className="topbar-actions">
            <div className="topbar-profile"><div className="profile-avatar">ML</div><span>Mila</span></div>
            <button className="primary-button" type="button" onClick={() => openActivityForm()}>
              <Plus size={18} strokeWidth={2.4} />
              <span>Ajouter une activité</span>
            </button>
          </div>
        </header>

        <div className="dashboard">
          <section className="welcome-row" id="overview">
            <div>
              <p className="section-kicker">TA JOURNÉE, TON RYTHME</p>
              <h1>Bonjour, Mila <span className="wave">✦</span></h1>
              <p className="welcome-copy">Chaque mouvement compte. Voilà ta semaine.</p>
            </div>
            <div className="week-pill"><span className="week-pill-dot" /> Semaine en cours <ChevronRight size={15} /></div>
          </section>

          <section className="metrics-grid" aria-label="Tes statistiques du jour">
            <article className="metric-card steps-card">
              <div className="metric-top"><span className="metric-icon coral-icon"><Footprints size={19} /></span><span className="metric-trend"><ArrowUpRight size={14} /> 8%</span></div>
              <p className="metric-label">Pas aujourd’hui</p>
              <strong className="metric-value">8 420</strong>
              <div className="metric-progress"><span style={{ width: '84%' }} /></div>
              <span className="metric-foot">Objectif : 10 000 pas</span>
            </article>
            <article className="metric-card">
              <div className="metric-top"><span className="metric-icon mint-icon"><Clock3 size={19} /></span><span className="metric-tag">ACTIF</span></div>
              <p className="metric-label">Temps en mouvement</p>
              <strong className="metric-value">{activeMinutes}<small> min</small></strong>
              <span className="metric-foot">Objectif : 60 min</span>
            </article>
            <article className="metric-card">
              <div className="metric-top"><span className="metric-icon gold-icon"><Flame size={19} /></span><span className="metric-tag">AUJOURD’HUI</span></div>
              <p className="metric-label">Énergie dépensée</p>
              <strong className="metric-value">{formatNumber(calories)}<small> kcal</small></strong>
              <span className="metric-foot">Bouge à ton rythme</span>
            </article>
            <article className="metric-card streak-card">
              <div className="metric-top"><span className="metric-icon blue-icon"><Zap size={19} /></span><span className="streak-spark">✦ ✦ ✦</span></div>
              <p className="metric-label">Série en cours</p>
              <strong className="metric-value">6<small> jours</small></strong>
              <span className="metric-foot">La régularité, c’est fort.</span>
            </article>
          </section>

          <div className="content-grid">
            <div className="primary-column">
              <section className="panel activity-panel" id="activity">
                <div className="panel-heading">
                  <div><p className="section-kicker">TON RYTHME</p><h2>Mouvement cette semaine</h2></div>
                  <div className="segmented-control" aria-label="Mesure du graphique">
                    <button className={chartMode === 'steps' ? 'selected' : ''} type="button" onClick={() => setChartMode('steps')}>Pas</button>
                    <button className={chartMode === 'minutes' ? 'selected' : ''} type="button" onClick={() => setChartMode('minutes')}>Minutes</button>
                  </div>
                </div>
                <div className="chart-summary"><strong>{formatNumber(weekTotal)}</strong><span>{chartMode === 'steps' ? 'pas cette semaine' : 'minutes en mouvement'}</span><span className="chart-summary-badge"><ArrowUpRight size={13} /> +12%</span></div>
                <div className="weekly-chart" role="img" aria-label={`Activité de la semaine en ${chartMode === 'steps' ? 'pas' : 'minutes'}`}>
                  <div className="chart-guides"><span>{chartMode === 'steps' ? '12k' : '70'}</span><span>{chartMode === 'steps' ? '6k' : '35'}</span><span>0</span></div>
                  <div className="chart-columns">
                    {chartValues.map((day, index) => {
                      const value = day[chartMode]
                      const height = Math.max(8, (value / chartMax) * 100)
                      return (
                        <div className={index === todayIndex ? 'chart-column today' : 'chart-column'} key={day.day}>
                          <span className="chart-value">{index === todayIndex ? (chartMode === 'steps' ? '8,4k' : `${value}m`) : ''}</span>
                          <div className="chart-track"><span style={{ height: `${height}%` }} /></div>
                          <span className="chart-day">{day.day}</span>
                        </div>
                      )
                    })}
                  </div>
                </div>
                <div className="chart-footnote"><span className="legend-dot" /> {chartMode === 'steps' ? 'Pas enregistrés' : 'Minutes actives'} <span className="chart-footnote-right">Ton objectif quotidien : {chartMode === 'steps' ? '10 000 pas' : '60 min'}</span></div>
              </section>

              <section className="panel recent-panel">
                <div className="panel-heading compact-heading">
                  <div><p className="section-kicker">BIEN JOUÉ</p><h2>Activités récentes</h2></div>
                  <a className="text-link" href="#activity">Tout voir <ArrowUpRight size={15} /></a>
                </div>
                <div className="activity-list">
                  {activities.slice(0, 3).map((item) => {
                    const ItemIcon = item.Icon
                    return (
                      <article className="activity-row" key={item.id}>
                        <span className={`activity-icon ${item.tone}`}><ItemIcon size={19} /></span>
                        <div className="activity-details"><strong>{item.title}</strong><span>{item.detail}</span></div>
                        <div className="activity-time"><strong>{item.duration}</strong><span>{item.time}</span></div>
                        <span className="activity-points">{item.points}</span>
                      </article>
                    )
                  })}
                </div>
              </section>
            </div>

            <aside className="secondary-column">
              <section className="panel goal-panel">
                <div className="panel-heading compact-heading"><div><p className="section-kicker">PETIT À PETIT</p><h2>Ton objectif du jour</h2></div><Target className="heading-icon" size={20} /></div>
                <div className="goal-content">
                  <div className="goal-ring" style={{ '--goal-progress': '84%' }}><div><strong>84<small>%</small></strong><span>atteint</span></div></div>
                  <div className="goal-copy"><span>Plus que</span><strong>1 580</strong><span>pas pour y arriver</span><div className="goal-encouragement"><Check size={14} /> Tu es sur la bonne voie</div></div>
                </div>
              </section>

              <section className="team-panel" id="teams">
                <div className="team-topline"><span className="team-emblem"><Users size={17} /></span><span>LE DÉFI DES ÉQUIPES</span><span className="team-rank">2<sup>e</sup></span></div>
                <h2>Les Comètes</h2>
                <p className="team-subtitle">Ensemble, on va plus loin.</p>
                <div className="team-progress-label"><span>1 248 pts</span><span>1 390 pts</span></div>
                <div className="team-progress"><span /></div>
                <div className="team-bottom"><div className="avatar-stack"><span className="avatar avatar-coral">N</span><span className="avatar avatar-mint">M</span><span className="avatar avatar-blue">I</span><span className="avatar avatar-more">+4</span></div><a href="#leaderboard" aria-label="Voir le classement"><ChevronRight size={18} /></a></div>
              </section>

              <section className="panel leaderboard-panel" id="leaderboard">
                <div className="panel-heading compact-heading"><div><p className="section-kicker">CETTE SEMAINE</p><h2>Classement</h2></div><Trophy className="heading-icon trophy-icon" size={20} /></div>
                <div className="leader-list">
                  {classmates.map((person, index) => (
                    <div className={person.name === 'Mila' ? 'leader-row you' : 'leader-row'} key={person.name}>
                      <span className="leader-rank">0{index + 1}</span>
                      <span className={`avatar ${person.tone}`}>{person.initials}</span>
                      <span className="leader-name"><strong>{person.name}{person.name === 'Mila' && <small>TOI</small>}</strong><span>{person.team}</span></span>
                      <strong className="leader-score">{person.points}<small> pts</small></strong>
                    </div>
                  ))}
                </div>
              </section>

              <section className="workout-panel" id="workouts">
                <div className="workout-art"><span className="workout-sun" /><Dumbbell size={29} strokeWidth={1.7} /><span className="workout-tag"><Sparkles size={13} /> POUR TOI</span></div>
                <div className="workout-copy"><p className="section-kicker">SÉANCE CONSEILLÉE</p><h2>Circuit énergie</h2><p>Un petit boost, sans matériel.</p><div className="workout-meta"><span><Clock3 size={14} /> 18 min</span><span><Activity size={14} /> Facile</span></div><button className="workout-button" type="button" onClick={() => openActivityForm('strength')}>Enregistrer la séance <ChevronRight size={16} /></button></div>
              </section>
            </aside>
          </div>
          <footer className="dashboard-footer"><span>OCTOFIT TRACKER</span><span>Fais de ton mieux. Le reste suivra.</span></footer>
        </div>
      </main>

      {modalOpen && (
        <div className="modal-backdrop" onMouseDown={(event) => event.target === event.currentTarget && setModalOpen(false)}>
          <section className="activity-modal" role="dialog" aria-modal="true" aria-labelledby="activity-modal-title">
            <div className="modal-heading"><div><p className="section-kicker">NOUVEAU MOUVEMENT</p><h2 id="activity-modal-title">Ajouter une activité</h2></div><button className="icon-button close-button" type="button" aria-label="Fermer" onClick={() => setModalOpen(false)}><X size={19} /></button></div>
            <form onSubmit={addActivity}>
              <label htmlFor="activity-type">Type d’activité</label>
              <select id="activity-type" value={activityType} onChange={(event) => setActivityType(event.target.value)}>
                {Object.entries(activityKinds).map(([value, kind]) => <option value={value} key={value}>{kind.label}</option>)}
              </select>
              <div className="form-row">
                <div><label htmlFor="activity-duration">Durée (minutes)</label><input id="activity-duration" type="number" min="5" max="240" value={duration} onChange={(event) => setDuration(event.target.value)} required /></div>
                {activityType !== 'strength' && <div><label htmlFor="activity-distance">Distance (km)</label><input id="activity-distance" type="number" min="0.1" step="0.1" placeholder="Facultatif" value={distance} onChange={(event) => setDistance(event.target.value)} /></div>}
              </div>
              <button className="primary-button modal-submit" type="submit"><Check size={17} /> Enregistrer</button>
            </form>
          </section>
        </div>
      )}
    </div>
  )
}

export default App
