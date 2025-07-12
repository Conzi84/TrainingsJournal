import React, { useState, useEffect } from 'react';

interface Training {
  id: string;
  name: string;
  content: string;
  category: string;
  createdAt: string;
  isFavorite?: boolean;
}

interface TrainingHistory {
  id: string;
  trainingId: string;
  trainingName: string;
  completedAt: string;
  notes: string;
}

const TrainingsJournal = () => {
  const [trainings, setTrainings] = useState<Training[]>([]);
  const [trainingHistory, setTrainingHistory] = useState<TrainingHistory[]>([]);
  const [currentView, setCurrentView] = useState<'upload' | 'library' | 'history' | 'current'>('upload');
  const [newTrainingInput, setNewTrainingInput] = useState('');
  const [newTrainingName, setNewTrainingName] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Kraft');
  const [categories, setCategories] = useState(['Kraft', 'Ausdauer', 'Yoga', 'Kettlebell']);
  const [currentTraining, setCurrentTraining] = useState<Training | null>(null);
  const [currentNotes, setCurrentNotes] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('Alle');
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);
  const [editingTraining, setEditingTraining] = useState<Training | null>(null);
  const [editName, setEditName] = useState('');
  const [editContent, setEditContent] = useState('');
  const [editCategory, setEditCategory] = useState('');
  const [newCategoryInput, setNewCategoryInput] = useState('');

  useEffect(() => {
    const styleSheet = document.createElement("style");
    styleSheet.innerText = `
      .neo-border { border: 4px solid black; }
      .neo-border-b { border-bottom: 4px solid black; }
      .neo-border-t { border-top: 4px solid black; }
      .neo-shadow { box-shadow: 4px 4px 0px black; }
      .bg-neo-cyan { background-color: #00E5CC; }
      .bg-neo-pink { background-color: #FF6B9D; }
      .bg-neo-yellow { background-color: #FFD93D; }
      .bg-neo-lime { background-color: #6BCF7F; }
      .bg-neo-purple { background-color: #A64AC9; }
      .bg-neo-red { background-color: #FF5E5B; }
      .bg-neo-blue { background-color: #4ECDC4; }
      .bg-neo-orange { background-color: #FFB84D; }
      .bg-neo-white { background-color: #FFFFFF; }
      .bg-neo-gray { background-color: #E8E8E8; }
      .text-neo-purple { color: #A64AC9; }
      .heading-1 { font-size: 1.875rem; font-weight: 900; text-transform: uppercase; color: black; line-height: 1.2; }
      .heading-2 { font-size: 1.5rem; font-weight: 900; text-transform: uppercase; color: black; line-height: 1.2; }
      .heading-3 { font-size: 1.25rem; font-weight: 900; text-transform: uppercase; color: black; line-height: 1.2; }
      .text-neo-base { font-size: 1rem; font-weight: 700; text-transform: uppercase; color: black; }
      .neo-btn {
        border: 4px solid black;
        background-color: #FFFFFF;
        color: black;
        font-weight: 900;
        padding: 12px 20px;
        font-size: 0.875rem;
        text-transform: uppercase;
        cursor: pointer;
        transition: all 0.1s ease;
        min-height: 48px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
      }
      .neo-btn:hover:not(:disabled) { transform: translate(1px, 1px); box-shadow: 2px 2px 0px black; }
      .neo-btn:disabled { opacity: 0.6; cursor: not-allowed; }
      .neo-btn-primary { background-color: #00E5CC; }
      .neo-btn-success { background-color: #6BCF7F; }
      .neo-btn-info { background-color: #4ECDC4; }
      .neo-btn-warning { background-color: #FFB84D; }
      .neo-btn-danger { background-color: #FF5E5B; }
      .neo-btn-sm { padding: 8px 12px; font-size: 0.75rem; min-height: 40px; }
      .neo-card { border: 4px solid black; background-color: #FFFFFF; color: black; box-shadow: 4px 4px 0px black; }
      .neo-card-cyan { background-color: #00E5CC; }
      .neo-card-yellow { background-color: #FFD93D; }
      .neo-card-white { background-color: #FFFFFF; }
      .neo-input, .neo-textarea {
        border: 4px solid black;
        background-color: #FFFFFF;
        color: black;
        font-weight: 700;
        padding: 12px 16px;
        font-size: 1rem;
        min-height: 48px;
      }
      .neo-input:focus, .neo-textarea:focus { outline: none; box-shadow: 0 0 0 4px rgba(0, 229, 204, 0.3); }
      .neo-textarea { min-height: 120px; resize: vertical; }
      .neo-badge {
        display: inline-block;
        border: 4px solid black;
        background-color: #FFD93D;
        color: black;
        font-weight: 900;
        padding: 4px 12px;
        font-size: 0.75rem;
        text-transform: uppercase;
      }
      .neo-container { max-width: 1200px; margin: 0 auto; padding: 0 16px; }
      .neo-header { padding: 16px 0; }
      .neo-nav { display: flex; align-items: center; }
      .grid { display: grid; }
      .grid-cols-1 { grid-template-columns: repeat(1, minmax(0, 1fr)); }
      .grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
      .gap-1 { gap: 0.25rem; }
      .gap-2 { gap: 0.5rem; }
      .gap-4 { gap: 1rem; }
      .space-y-3 > * + * { margin-top: 0.75rem; }
      .space-y-4 > * + * { margin-top: 1rem; }
      .space-y-6 > * + * { margin-top: 1.5rem; }
      .flex { display: flex; }
      .flex-wrap { flex-wrap: wrap; }
      .flex-1 { flex: 1 1 0%; }
      .items-center { align-items: center; }
      .items-start { align-items: flex-start; }
      .justify-center { justify-content: center; }
      .justify-between { justify-content: space-between; }
      .fixed { position: fixed; }
      .bottom-4 { bottom: 1rem; }
      .right-4 { right: 1rem; }
      .z-50 { z-index: 50; }
      .ml-auto { margin-left: auto; }
      .w-full { width: 100%; }
      .w-5 { width: 1.25rem; }
      .h-5 { height: 1.25rem; }
      .min-h-screen { min-height: 100vh; }
      .text-center { text-align: center; }
      .text-sm { font-size: 0.875rem; }
      .text-lg { font-size: 1.125rem; }
      .text-2xl { font-size: 1.5rem; }
      .font-bold { font-weight: 700; }
      .font-black { font-weight: 900; }
      .text-yellow-500 { color: #eab308; }
      .text-gray-400 { color: #9ca3af; }
      .whitespace-pre-wrap { white-space: pre-wrap; }
      .hidden { display: none; }
      .cursor-pointer { cursor: pointer; }
      .animate-bounce { animation: bounce 1s infinite; }
      @keyframes bounce { 0%, 100% { transform: translateY(-25%); } 50% { transform: none; } }
      @media (min-width: 768px) {
        .heading-1 { font-size: 2.25rem; }
        .heading-2 { font-size: 1.875rem; }
        .heading-3 { font-size: 1.5rem; }
        .neo-btn { padding: 12px 24px; font-size: 1rem; }
        .neo-btn-sm { padding: 8px 16px; font-size: 0.875rem; }
        .neo-container { padding: 0 24px; }
        .neo-header { padding: 24px 0; }
        .md-grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
        .md-grid-cols-4 { grid-template-columns: repeat(4, minmax(0, 1fr)); }
      }
    `;
    document.head.appendChild(styleSheet);
    return () => document.head.removeChild(styleSheet);
  }, []);

  useEffect(() => {
    const savedTrainings = localStorage.getItem('trainingsjournal-trainings');
    const savedHistory = localStorage.getItem('trainingsjournal-history');
    const savedCategories = localStorage.getItem('trainingsjournal-categories');
    
    if (savedTrainings) setTrainings(JSON.parse(savedTrainings));
    if (savedHistory) setTrainingHistory(JSON.parse(savedHistory));
    if (savedCategories) {
      const cats = JSON.parse(savedCategories);
      const allCategories = [...new Set([...['Kraft', 'Ausdauer', 'Yoga', 'Kettlebell'], ...cats])];
      setCategories(allCategories);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('trainingsjournal-trainings', JSON.stringify(trainings));
  }, [trainings]);

  useEffect(() => {
    localStorage.setItem('trainingsjournal-history', JSON.stringify(trainingHistory));
  }, [trainingHistory]);

  useEffect(() => {
    const customCats = categories.filter(cat => !['Kraft', 'Ausdauer', 'Yoga', 'Kettlebell'].includes(cat));
    localStorage.setItem('trainingsjournal-categories', JSON.stringify(customCats));
  }, [categories]);

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const showNotification = (message: string) => {
    setNotification(message);
  };

  const addTraining = () => {
    if (newTrainingInput.trim() && newTrainingName.trim()) {
      setIsLoading(true);
      setTimeout(() => {
        const newTraining: Training = {
          id: Date.now().toString(),
          name: newTrainingName.trim(),
          content: newTrainingInput.trim(),
          category: selectedCategory,
          createdAt: new Date().toISOString(),
          isFavorite: false
        };
        
        setTrainings(prev => [...prev, newTraining]);
        setNewTrainingInput('');
        setNewTrainingName('');
        setIsLoading(false);
        showNotification('Training hinzugefügt! 💪');
      }, 500);
    }
  };

  const startTraining = (training: Training) => {
    setCurrentTraining(training);
    setCurrentNotes('');
    setCurrentView('current');
  };

  const completeTraining = () => {
    if (currentTraining) {
      setIsLoading(true);
      setTimeout(() => {
        const historyEntry: TrainingHistory = {
          id: Date.now().toString(),
          trainingId: currentTraining.id,
          trainingName: currentTraining.name,
          completedAt: new Date().toISOString(),
          notes: currentNotes
        };
        
        setTrainingHistory(prev => [historyEntry, ...prev]);
        setCurrentTraining(null);
        setCurrentNotes('');
        setCurrentView('history');
        setIsLoading(false);
        showNotification('Training abgeschlossen! 🎉');
      }, 500);
    }
  };

  const toggleFavorite = (trainingId: string) => {
    setTrainings(prev => prev.map(t => 
      t.id === trainingId 
        ? { ...t, isFavorite: !t.isFavorite }
        : t
    ));
    showNotification('Favorit aktualisiert! ⭐');
  };

  const exportData = () => {
    const data = {
      trainings,
      trainingHistory,
      categories,
      exportDate: new Date().toISOString(),
      version: '1.0'
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `trainingsjournal-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showNotification('Daten exportiert! 📁');
  };

  const importData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        
        if (data.trainings && data.trainingHistory) {
          setTrainings(data.trainings || []);
          setTrainingHistory(data.trainingHistory || []);
          setCategories(data.categories || ['Kraft', 'Ausdauer', 'Yoga', 'Kettlebell']);
          showNotification('Daten importiert! ✅');
        } else {
          showNotification('Ungültiges Backup-Format! ❌');
        }
      } catch (error) {
        showNotification('Import-Fehler! ❌');
      }
    };
    reader.readAsText(file);
    event.target.value = '';
  };

  const addCategory = () => {
    if (newCategoryInput.trim() && !categories.includes(newCategoryInput.trim())) {
      setCategories(prev => [...prev, newCategoryInput.trim()]);
      setNewCategoryInput('');
      showNotification('Kategorie hinzugefügt! 📂');
    }
  };

  const startEditTraining = (training: Training) => {
    setEditingTraining(training);
    setEditName(training.name);
    setEditContent(training.content);
    setEditCategory(training.category);
  };

  const saveEditTraining = () => {
    if (editingTraining && editName.trim() && editContent.trim()) {
      setTrainings(prev => prev.map(t => 
        t.id === editingTraining.id 
          ? { ...t, name: editName.trim(), content: editContent.trim(), category: editCategory }
          : t
      ));
      setEditingTraining(null);
      setEditName('');
      setEditContent('');
      setEditCategory('');
      showNotification('Training aktualisiert! ✏️');
    }
  };

  const deleteTraining = (trainingId: string) => {
    if (confirm('Training wirklich löschen?')) {
      setTrainings(prev => prev.filter(t => t.id !== trainingId));
      showNotification('Training gelöscht! 🗑️');
    }
  };

  const filteredTrainings = trainings.filter(training => {
    const matchesSearch = training.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         training.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === 'Alle' || training.category === filterCategory;
    const matchesFavorites = !showFavoritesOnly || training.isFavorite;
    return matchesSearch && matchesCategory && matchesFavorites;
  });

  return (
    <div className="min-h-screen bg-neo-white">
      <header className="neo-header bg-neo-pink">
        <div className="neo-container">
          <h1 className="heading-1">TRAININGS JOURNAL 💪</h1>
          <p className="text-neo-base">Dein persönliches Fitness-Tagebuch</p>
        </div>
      </header>

      <nav className="neo-nav bg-neo-purple neo-border-b" style={{ padding: '16px' }}>
        <div className="neo-container">
          <div className="flex flex-wrap gap-2">
            <button 
              onClick={() => setCurrentView('upload')}
              className={`neo-btn neo-btn-sm ${currentView === 'upload' ? 'bg-neo-yellow' : 'bg-neo-white'}`}
            >
              UPLOAD
            </button>
            <button 
              onClick={() => setCurrentView('library')}
              className={`neo-btn neo-btn-sm ${currentView === 'library' ? 'bg-neo-yellow' : 'bg-neo-white'}`}
            >
              BIBLIOTHEK ({trainings.length})
            </button>
            <button 
              onClick={() => setCurrentView('history')}
              className={`neo-btn neo-btn-sm ${currentView === 'history' ? 'bg-neo-yellow' : 'bg-neo-white'}`}
            >
              HISTORIE
            </button>
            
            <div className="flex gap-1 ml-auto">
              <button 
                onClick={exportData}
                className="neo-btn neo-btn-info neo-btn-sm"
                title="Export"
              >
                📁
              </button>
              <label className="neo-btn neo-btn-info neo-btn-sm cursor-pointer" title="Import">
                📂
                <input 
                  type="file" 
                  accept=".json" 
                  onChange={importData} 
                  className="hidden" 
                />
              </label>
            </div>
          </div>
        </div>
      </nav>

      <main className="neo-container" style={{ paddingTop: '32px', paddingBottom: '32px' }}>
        {currentView === 'upload' && (
          <div className="space-y-6">
            <div className="neo-card bg-neo-cyan" style={{ padding: '24px' }}>
              <h2 className="heading-2" style={{ marginBottom: '16px' }}>NEUES TRAINING HINZUFÜGEN</h2>
              
              <div className="space-y-4">
                <input
                  type="text"
                  value={newTrainingName}
                  onChange={(e) => setNewTrainingName(e.target.value)}
                  placeholder="Training Name (z.B. Push Day #1)"
                  className="neo-input w-full"
                />
                
                <select 
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="neo-input w-full"
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
                
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newCategoryInput}
                    onChange={(e) => setNewCategoryInput(e.target.value)}
                    placeholder="Neue Kategorie..."
                    className="neo-input flex-1"
                  />
                  <button 
                    onClick={addCategory}
                    className="neo-btn neo-btn-info"
                  >
                    + KATEGORIE
                  </button>
                </div>
                
                <textarea
                  value={newTrainingInput}
                  onChange={(e) => setNewTrainingInput(e.target.value)}
                  placeholder="Training Inhalt:&#10;Bankdrücken 3x8 80kg&#10;Kniebeugen 3x10 100kg&#10;Kreuzheben 1x5 120kg"
                  className="neo-textarea w-full"
                  rows={6}
                />
                
                <button 
                  onClick={addTraining}
                  className="neo-btn neo-btn-primary w-full"
                  disabled={isLoading || !newTrainingName.trim() || !newTrainingInput.trim()}
                >
                  {isLoading ? 'SPEICHERE...' : 'TRAINING SPEICHERN'}
                </button>
              </div>
            </div>
          </div>
        )}

        {currentView === 'library' && (
          <div className="space-y-6">
            <div className="neo-card bg-neo-lime" style={{ padding: '24px' }}>
              <h2 className="heading-2" style={{ marginBottom: '16px' }}>
                TRAINING BIBLIOTHEK ({filteredTrainings.length}/{trainings.length})
              </h2>
              
              <div className="space-y-4" style={{ marginBottom: '24px' }}>
                <div className="grid grid-cols-1 gap-4">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Training suchen..."
                    className="neo-input"
                  />
                  <select 
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                    className="neo-input"
                  >
                    <option value="Alle">Alle Kategorien</option>
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={showFavoritesOnly}
                      onChange={(e) => setShowFavoritesOnly(e.target.checked)}
                      className="w-5 h-5"
                    />
                    <span className="font-bold">Nur Favoriten anzeigen ⭐</span>
                  </label>
                  <div className="ml-auto">
                    <span className="neo-badge">
                      {trainings.filter(t => t.isFavorite).length} Favoriten
                    </span>
                  </div>
                </div>
              </div>
              
              {filteredTrainings.length === 0 ? (
                <p className="font-bold">
                  {trainings.length === 0 
                    ? "Noch keine Trainings vorhanden. Füge welche hinzu!"
                    : "Keine Trainings gefunden. Ändere deine Suchkriterien."
                  }
                </p>
              ) : (
                <div className="space-y-4">
                  {categories.map(category => {
                    const categoryTrainings = filteredTrainings.filter(t => t.category === category);
                    if (categoryTrainings.length === 0) return null;
                    
                    return (
                      <div key={category} className="space-y-3">
                        <h3 className="heading-3 text-neo-purple">{category} ({categoryTrainings.length})</h3>
                        {categoryTrainings.map(training => (
                          <div key={training.id} className="neo-card-yellow" style={{ padding: '16px' }}>
                            {editingTraining?.id === training.id ? (
                              <div className="space-y-3">
                                <input
                                  type="text"
                                  value={editName}
                                  onChange={(e) => setEditName(e.target.value)}
                                  className="neo-input w-full"
                                />
                                <select 
                                  value={editCategory}
                                  onChange={(e) => setEditCategory(e.target.value)}
                                  className="neo-input w-full"
                                >
                                  {categories.map(cat => (
                                    <option key={cat} value={cat}>{cat}</option>
                                  ))}
                                </select>
                                <textarea
                                  value={editContent}
                                  onChange={(e) => setEditContent(e.target.value)}
                                  className="neo-textarea w-full"
                                  rows={4}
                                />
                                <div className="flex gap-2">
                                  <button
                                    onClick={saveEditTraining}
                                    className="neo-btn neo-btn-success neo-btn-sm"
                                  >
                                    SPEICHERN ✓
                                  </button>
                                  <button
                                    onClick={() => setEditingTraining(null)}
                                    className="neo-btn neo-btn-warning neo-btn-sm"
                                  >
                                    ABBRECHEN
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <div>
                                <div className="flex justify-between items-start" style={{ marginBottom: '8px' }}>
                                  <div className="flex items-center gap-2">
                                    <h4 className="font-black text-lg">{training.name}</h4>
                                    <button
                                      onClick={() => toggleFavorite(training.id)}
                                      className={`text-2xl ${training.isFavorite ? 'text-yellow-500' : 'text-gray-400'}`}
                                      title={training.isFavorite ? 'Aus Favoriten entfernen' : 'Zu Favoriten hinzufügen'}
                                    >
                                      {training.isFavorite ? '⭐' : '☆'}
                                    </button>
                                  </div>
                                  <div className="flex flex-wrap gap-1">
                                    <button
                                      onClick={() => startTraining(training)}
                                      className="neo-btn neo-btn-primary neo-btn-sm"
                                    >
                                      START
                                    </button>
                                    <button
                                      onClick={() => startEditTraining(training)}
                                      className="neo-btn neo-btn-info neo-btn-sm"
                                    >
                                      EDIT
                                    </button>
                                    <button
                                      onClick={() => deleteTraining(training.id)}
                                      className="neo-btn neo-btn-danger neo-btn-sm"
                                    >
                                      DEL
                                    </button>
                                  </div>
                                </div>
                                <pre className="font-bold text-sm whitespace-pre-wrap">
                                  {training.content}
                                </pre>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {currentView === 'current' && (
          <div className="space-y-6">
            {!currentTraining ? (
              <div className="neo-card bg-neo-red" style={{ padding: '24px' }}>
                <h2 className="heading-2">KEIN AKTIVES TRAINING</h2>
                <p className="font-bold">Wähle ein Training aus der Bibliothek!</p>
              </div>
            ) : (
              <div className="neo-card bg-neo-orange" style={{ padding: '24px' }}>
                <h2 className="heading-2" style={{ marginBottom: '16px' }}>AKTUELLES TRAINING</h2>
                <h3 className="heading-3 text-neo-purple" style={{ marginBottom: '16px' }}>{currentTraining.name}</h3>
                
                <div className="neo-card-white" style={{ padding: '16px', marginBottom: '16px' }}>
                  <pre className="font-bold whitespace-pre-wrap">
                    {currentTraining.content}
                  </pre>
                </div>
                
                <div className="space-y-4">
                  <textarea
                    value={currentNotes}
                    onChange={(e) => setCurrentNotes(e.target.value)}
                    placeholder="Notizen zu diesem Training..."
                    className="neo-textarea w-full"
                    rows={3}
                  />
                  
                  <button 
                    onClick={completeTraining}
                    className="neo-btn neo-btn-success w-full"
                    disabled={isLoading}
                  >
                    {isLoading ? 'SPEICHERE...' : 'TRAINING ABSCHLIESSEN ✓'}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {currentView === 'history' && (
          <div className="space-y-6">
            <div className="neo-card bg-neo-blue" style={{ padding: '24px' }}>
              <h2 className="heading-2" style={{ marginBottom: '16px' }}>
                TRAININGS HISTORIE ({trainingHistory.length})
              </h2>
              
              {trainingHistory.length === 0 ? (
                <p className="font-bold">Noch keine abgeschlossenen Trainings!</p>
              ) : (
                <div className="space-y-4">
                  {trainingHistory.map(entry => {
                    const entryDate = new Date(entry.completedAt);
                    const isToday = entryDate.toDateString() === new Date().toDateString();
                    const isThisWeek = (new Date().getTime() - entryDate.getTime()) < (7 * 24 * 60 * 60 * 1000);
                    
                    return (
                      <div key={entry.id} className="neo-card-white" style={{ padding: '16px' }}>
                        <div className="flex justify-between items-start" style={{ marginBottom: '8px' }}>
                          <h4 className="font-black text-lg">{entry.trainingName}</h4>
                          <div className="flex gap-2">
                            <span className={`neo-badge ${isToday ? 'bg-neo-lime' : isThisWeek ? 'bg-neo-yellow' : 'bg-neo-gray'}`}>
                              {isToday ? 'HEUTE' : entryDate.toLocaleDateString('de-DE')}
                            </span>
                            <span className="neo-badge bg-neo-blue">
                              {entryDate.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                        </div>
                        {entry.notes && (
                          <div className="bg-neo-gray neo-border" style={{ padding: '12px', marginTop: '8px' }}>
                            <p className="font-bold text-sm">
                              💭 {entry.notes}
                            </p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
            
            {trainingHistory.length > 0 && (
              <div className="neo-card bg-neo-yellow" style={{ padding: '24px' }}>
                <h3 className="heading-3" style={{ marginBottom: '16px' }}>STATISTIKEN</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-black">{trainingHistory.length}</div>
                    <div className="font-bold text-sm">GESAMT</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-black">
                      {trainingHistory.filter(h => {
                        const date = new Date(h.completedAt);
                        return date.toDateString() === new Date().toDateString();
                      }).length}
                    </div>
                    <div className="font-bold text-sm">HEUTE</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-black">
                      {trainingHistory.filter(h => {
                        const date = new Date(h.completedAt);
                        const weekAgo = new Date();
                        weekAgo.setDate(weekAgo.getDate() - 7);
                        return date > weekAgo;
                      }).length}
                    </div>
                    <div className="font-bold text-sm">7 TAGE</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-black">
                      {Math.round(trainingHistory.length / Math.max(1, Math.ceil((new Date().getTime() - new Date(trainingHistory[trainingHistory.length - 1]?.completedAt || new Date()).getTime()) / (1000 * 60 * 60 * 24 * 7))))}
                    </div>
                    <div className="font-bold text-sm">⌀ PRO WOCHE</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {notification && (
        <div className="fixed bottom-4 right-4 bg-neo-lime neo-border neo-shadow animate-bounce z-50" style={{ padding: '16px' }}>
          <p className="font-black text-sm">{notification}</p>
        </div>
      )}

      <footer className="bg-neo-gray neo-border-t" style={{ padding: '16px' }}>
        <div className="neo-container text-center">
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <span className="font-bold">📊 {trainings.length} Trainings</span>
            <span className="font-bold">🏃‍♂️ {trainingHistory.length} absolviert</span>
            <span className="font-bold">⭐ {trainings.filter(t => t.isFavorite).length} Favoriten</span>
            <span className="font-bold">💪 {categories.length} Kategorien</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default TrainingsJournal;
