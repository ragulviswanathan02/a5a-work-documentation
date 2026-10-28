import React, { useState, useEffect, useMemo } from 'react';
import { 
  INITIAL_LOGS, 
  CATEGORIES, 
  STATUS_OPTIONS 
} from './data/initialLogs';
import { 
  Plus, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Copy, 
  Download, 
  Upload, 
  Printer, 
  Search, 
  Filter, 
  Sun, 
  Moon, 
  ExternalLink, 
  Edit3, 
  Trash2, 
  CopyCheck, 
  Briefcase, 
  Code2, 
  Layers, 
  FileText,
  X,
  Sparkles,
  RefreshCw
} from 'lucide-react';

const STORAGE_KEY = 'a5a_work_logs_v2';
const THEME_KEY = 'a5a_work_theme';

export default function App() {
  // Theme state
  const [theme, setTheme] = useState(() => localStorage.getItem(THEME_KEY) || 'dark');

  // Logs state
  const [logs, setLogs] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to load local storage logs', e);
    }
    return INITIAL_LOGS;
  });

  // Filter & View states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProject, setSelectedProject] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [dateRangeFilter, setDateRangeFilter] = useState('all'); // all, today, this_week, this_month
  const [activeView, setActiveView] = useState('timeline'); // timeline, table

  // Modals state
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isStandupModalOpen, setIsStandupModalOpen] = useState(false);
  const [editingLog, setEditingLog] = useState(null);
  const [standupTab, setStandupTab] = useState('today');

  // Toast notification
  const [toastMessage, setToastMessage] = useState('');

  // Form State
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    title: '',
    project: 'A5A Assessment',
    category: 'Feature Development',
    hours: 2,
    status: 'Completed',
    description: '',
    blockers: '',
    links: [{ label: '', url: '' }]
  });

  // Persist Theme
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(THEME_KEY, theme);
  }, [theme]);

  // Persist Logs
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(logs));
    } catch (e) {
      console.error('Error saving to localStorage', e);
    }
  }, [logs]);

  // Trigger Toast
  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage('');
    }, 2800);
  };

  // Distinct Projects list
  const projectsList = useMemo(() => {
    const set = new Set(logs.map(l => l.project).filter(Boolean));
    return ['All', ...Array.from(set)];
  }, [logs]);

  // Filtered logs
  const filteredLogs = useMemo(() => {
    const todayStr = new Date().toISOString().split('T')[0];
    const today = new Date();
    
    // Start of current week (Monday)
    const dayOfWeek = today.getDay() || 7;
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - dayOfWeek + 1);
    startOfWeek.setHours(0, 0, 0, 0);

    return logs.filter(log => {
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = log.title?.toLowerCase().includes(q);
        const matchesDesc = log.description?.toLowerCase().includes(q);
        const matchesProject = log.project?.toLowerCase().includes(q);
        const matchesCat = log.category?.toLowerCase().includes(q);
        if (!matchesTitle && !matchesDesc && !matchesProject && !matchesCat) return false;
      }

      // Project filter
      if (selectedProject !== 'All' && log.project !== selectedProject) {
        return false;
      }

      // Status filter
      if (selectedStatus !== 'All' && log.status !== selectedStatus) {
        return false;
      }

      // Date range filter
      if (dateRangeFilter === 'today') {
        if (log.date !== todayStr) return false;
      } else if (dateRangeFilter === 'this_week') {
        const logDate = new Date(log.date);
        if (logDate < startOfWeek) return false;
      } else if (dateRangeFilter === 'this_month') {
        const logDate = new Date(log.date);
        if (logDate.getMonth() !== today.getMonth() || logDate.getFullYear() !== today.getFullYear()) {
          return false;
        }
      }

      return true;
    }).sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [logs, searchQuery, selectedProject, selectedStatus, dateRangeFilter]);

  // Grouped by Date for Timeline
  const groupedLogs = useMemo(() => {
    const groups = {};
    filteredLogs.forEach(log => {
      if (!groups[log.date]) {
        groups[log.date] = [];
      }
      groups[log.date].push(log);
    });
    return groups;
  }, [filteredLogs]);

  // High-level statistics
  const metrics = useMemo(() => {
    const totalHours = filteredLogs.reduce((sum, item) => sum + (parseFloat(item.hours) || 0), 0);
    const todayStr = new Date().toISOString().split('T')[0];
    const todayHours = logs
      .filter(l => l.date === todayStr)
      .reduce((sum, item) => sum + (parseFloat(item.hours) || 0), 0);
    const completedCount = filteredLogs.filter(l => l.status === 'Completed').length;
    const inProgressCount = filteredLogs.filter(l => l.status === 'In Progress').length;
    const distinctDates = new Set(filteredLogs.map(l => l.date)).size;
    const avgDailyHours = distinctDates > 0 ? (totalHours / distinctDates).toFixed(1) : 0;

    return {
      totalHours: totalHours.toFixed(1),
      todayHours: todayHours.toFixed(1),
      completedCount,
      inProgressCount,
      totalTasks: filteredLogs.length,
      avgDailyHours
    };
  }, [filteredLogs, logs]);

  // Open modal for Create
  const handleOpenCreateModal = (presetDate = null) => {
    setEditingLog(null);
    setFormData({
      date: presetDate || new Date().toISOString().split('T')[0],
      title: '',
      project: 'A5A Assessment',
      category: 'Feature Development',
      hours: 2,
      status: 'Completed',
      description: '',
      blockers: '',
      links: [{ label: '', url: '' }]
    });
    setIsFormModalOpen(true);
  };

  // Open modal for Edit
  const handleOpenEditModal = (log) => {
    setEditingLog(log);
    setFormData({
      date: log.date,
      title: log.title,
      project: log.project || 'A5A Assessment',
      category: log.category || 'Feature Development',
      hours: log.hours || 1,
      status: log.status || 'Completed',
      description: log.description || '',
      blockers: log.blockers || '',
      links: log.links?.length ? [...log.links] : [{ label: '', url: '' }]
    });
    setIsFormModalOpen(true);
  };

  // Duplicate Log
  const handleDuplicate = (log) => {
    const newLog = {
      ...log,
      id: 'log-' + Date.now(),
      title: `${log.title} (Copy)`,
      date: new Date().toISOString().split('T')[0]
    };
    setLogs(prev => [newLog, ...prev]);
    showToast('Log duplicated for today!');
  };

  // Delete Log
  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this log entry?')) {
      setLogs(prev => prev.filter(l => l.id !== id));
      showToast('Work log deleted');
    }
  };

  // Submit Add / Edit
  const handleSaveLog = (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      alert('Please enter a work title/headline.');
      return;
    }

    const cleanedLinks = (formData.links || []).filter(l => l.label.trim() && l.url.trim());

    if (editingLog) {
      setLogs(prev => prev.map(l => l.id === editingLog.id ? {
        ...formData,
        id: editingLog.id,
        hours: parseFloat(formData.hours) || 0,
        links: cleanedLinks
      } : l));
      showToast('Log entry updated successfully');
    } else {
      const newEntry = {
        ...formData,
        id: 'log-' + Date.now(),
        hours: parseFloat(formData.hours) || 0,
        links: cleanedLinks
      };
      setLogs(prev => [newEntry, ...prev]);
      showToast('New work log added!');
    }

    setIsFormModalOpen(false);
  };

  // Link repeater helpers
  const handleAddLink = () => {
    setFormData(prev => ({
      ...prev,
      links: [...prev.links, { label: '', url: '' }]
    }));
  };

  const handleLinkChange = (index, field, value) => {
    setFormData(prev => {
      const updated = [...prev.links];
      updated[index][field] = value;
      return { ...prev, links: updated };
    });
  };

  const handleRemoveLink = (index) => {
    setFormData(prev => ({
      ...prev,
      links: prev.links.filter((_, i) => i !== index)
    }));
  };

  // Export JSON (Clean structured file for Git repo)
  const handleExportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(logs, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `work-logs-${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast('Exported logs JSON. You can commit this to Git!');
  };

  // Import JSON
  const handleImportJSON = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target.result);
        if (Array.isArray(parsed)) {
          setLogs(parsed);
          showToast(`Successfully imported ${parsed.length} log entries!`);
        } else {
          alert('Invalid JSON structure. Expected an array of logs.');
        }
      } catch (err) {
        alert('Could not parse JSON file.');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  // Generate Standup Text
  const standupText = useMemo(() => {
    const todayStr = new Date().toISOString().split('T')[0];
    const todayItems = logs.filter(l => l.date === todayStr);

    if (standupTab === 'today') {
      let text = `🚀 *Daily Standup Update (${todayStr})*\n\n`;
      text += `*Key Work Done / In-Progress:*\n`;
      if (todayItems.length === 0) {
        text += `• Logged working on sprint backlog tasks.\n`;
      } else {
        todayItems.forEach(item => {
          text += `• [${item.project}] ${item.title} (${item.hours}h) - ${item.status}\n`;
          if (item.description) {
            const lines = item.description.split('\n').filter(Boolean);
            lines.forEach(l => {
              text += `   ${l.startsWith('•') ? l : '  - ' + l}\n`;
            });
          }
        });
      }
      const blockers = todayItems.filter(i => i.blockers).map(i => i.blockers);
      text += `\n*Blockers:* ${blockers.length > 0 ? blockers.join('; ') : 'None'}\n`;
      text += `*Total Hours Logged Today:* ${metrics.todayHours} hrs`;
      return text;
    } else {
      // Weekly Executive Summary
      let text = `📊 *Weekly Engineering Work Summary*\n`;
      text += `Total Hours: ${metrics.totalHours} hrs | Tasks Completed: ${metrics.completedCount}\n\n`;
      const projects = {};
      filteredLogs.forEach(l => {
        if (!projects[l.project]) projects[l.project] = [];
        projects[l.project].push(l);
      });

      Object.entries(projects).forEach(([proj, items]) => {
        const projHours = items.reduce((s, i) => s + (parseFloat(i.hours) || 0), 0);
        text += `*Project: ${proj}* (${projHours.toFixed(1)} hrs)\n`;
        items.forEach(it => {
          text += `• [${it.date}] ${it.title} - ${it.status} (${it.hours}h)\n`;
        });
        text += `\n`;
      });
      return text;
    }
  }, [logs, standupTab, metrics]);

  // Copy standup
  const handleCopyStandup = () => {
    navigator.clipboard.writeText(standupText);
    showToast('Copied standup report to clipboard!');
  };

  // Format nice readable date
  const formatReadableDate = (dateStr) => {
    try {
      const parts = dateStr.split('-');
      const d = new Date(parts[0], parts[1] - 1, parts[2]);
      return d.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    } catch {
      return dateStr;
    }
  };

  const getRelativeDateLabel = (dateStr) => {
    const todayStr = new Date().toISOString().split('T')[0];
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    if (dateStr === todayStr) return 'Today';
    if (dateStr === yesterdayStr) return 'Yesterday';
    return null;
  };

  const getStatusColorConfig = (status) => {
    return STATUS_OPTIONS.find(s => s.value === status) || STATUS_OPTIONS[0];
  };

  return (
    <div className="app-wrapper">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="toast-notice">
          <Sparkles size={18} color="#3b82f6" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Top Header */}
      <header className="app-header">
        <div className="brand-section">
          <div className="brand-icon">
            <FileText size={24} />
          </div>
          <div className="brand-meta">
            <h1>
              A5A WorkLog
              <span className="brand-badge">Git & Vercel Ready</span>
            </h1>
            <p>Daily Engineering Work Documentation & Time Tracker</p>
          </div>
        </div>

        <div className="header-actions">
          <button 
            className="btn btn-primary"
            onClick={() => handleOpenCreateModal()}
            id="btn-add-log"
          >
            <Plus size={18} />
            <span>Add Work Log</span>
          </button>

          <button 
            className="btn btn-secondary"
            onClick={() => setIsStandupModalOpen(true)}
            id="btn-standup"
            title="Generate Standup update for Slack/Teams"
          >
            <CopyCheck size={16} />
            <span>Standup</span>
          </button>

          <button 
            className="btn btn-secondary"
            onClick={() => window.print()}
            title="Print or Save PDF report"
          >
            <Printer size={16} />
            <span>PDF / Print</span>
          </button>

          <button 
            className="btn btn-secondary"
            onClick={handleExportJSON}
            title="Download JSON to commit to your GitHub repository"
          >
            <Download size={16} />
            <span>Export</span>
          </button>

          <label className="btn btn-secondary" style={{ cursor: 'pointer' }} title="Import existing JSON logs">
            <Upload size={16} />
            <span>Import</span>
            <input 
              type="file" 
              accept=".json" 
              style={{ display: 'none' }} 
              onChange={handleImportJSON} 
            />
          </label>

          <button 
            className="btn-icon" 
            onClick={() => setTheme(t => t === 'dark' ? 'light' : 'dark')}
            title="Toggle Light / Dark mode"
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>
      </header>

      {/* Metrics Highlights Bar */}
      <section className="metrics-grid">
        <div className="metric-card" style={{ '--card-accent': '#3b82f6', '--card-accent-bg': 'rgba(59, 130, 246, 0.15)' }}>
          <div className="metric-icon-wrap">
            <Clock size={24} />
          </div>
          <div className="metric-info">
            <span className="metric-title">Total Filtered Hours</span>
            <span className="metric-value">{metrics.totalHours} hrs</span>
            <span className="metric-sub">{metrics.totalTasks} tasks recorded</span>
          </div>
        </div>

        <div className="metric-card" style={{ '--card-accent': '#10b981', '--card-accent-bg': 'rgba(16, 185, 129, 0.15)' }}>
          <div className="metric-icon-wrap">
            <Calendar size={24} />
          </div>
          <div className="metric-info">
            <span className="metric-title">Today's Logged Hours</span>
            <span className="metric-value">{metrics.todayHours} hrs</span>
            <span className="metric-sub">{metrics.todayHours >= 7 ? 'Target met' : 'In progress today'}</span>
          </div>
        </div>

        <div className="metric-card" style={{ '--card-accent': '#8b5cf6', '--card-accent-bg': 'rgba(139, 92, 246, 0.15)' }}>
          <div className="metric-icon-wrap">
            <CheckCircle2 size={24} />
          </div>
          <div className="metric-info">
            <span className="metric-title">Completed Tasks</span>
            <span className="metric-value">{metrics.completedCount}</span>
            <span className="metric-sub">{metrics.inProgressCount} currently in progress</span>
          </div>
        </div>

        <div className="metric-card" style={{ '--card-accent': '#f59e0b', '--card-accent-bg': 'rgba(245, 158, 11, 0.15)' }}>
          <div className="metric-icon-wrap">
            <Briefcase size={24} />
          </div>
          <div className="metric-info">
            <span className="metric-title">Daily Average</span>
            <span className="metric-value">{metrics.avgDailyHours} hrs/day</span>
            <span className="metric-sub">Across recorded working days</span>
          </div>
        </div>
      </section>

      {/* Control Filter Bar */}
      <section className="control-bar">
        <div className="search-box">
          <Search size={18} className="search-icon" />
          <input 
            type="text" 
            placeholder="Search by title, description, project, PR..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="filter-group">
          <select 
            className="select-filter"
            value={dateRangeFilter}
            onChange={(e) => setDateRangeFilter(e.target.value)}
          >
            <option value="all">All Dates</option>
            <option value="today">Today Only</option>
            <option value="this_week">This Week</option>
            <option value="this_month">This Month</option>
          </select>

          <select 
            className="select-filter"
            value={selectedProject}
            onChange={(e) => setSelectedProject(e.target.value)}
          >
            {projectsList.map(p => (
              <option key={p} value={p}>{p === 'All' ? 'All Projects' : p}</option>
            ))}
          </select>

          <select 
            className="select-filter"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
          >
            <option value="All">All Statuses</option>
            <option value="Completed">Completed</option>
            <option value="In Progress">In Progress</option>
            <option value="Under Review">Under Review</option>
            <option value="Blocked">Blocked</option>
          </select>

          <div className="view-tabs">
            <button 
              className={`view-tab ${activeView === 'timeline' ? 'active' : ''}`}
              onClick={() => setActiveView('timeline')}
            >
              <Layers size={15} />
              <span>Timeline</span>
            </button>
            <button 
              className={`view-tab ${activeView === 'table' ? 'active' : ''}`}
              onClick={() => setActiveView('table')}
            >
              <FileText size={15} />
              <span>Table</span>
            </button>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      {filteredLogs.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">
            <Search size={28} />
          </div>
          <h3>No work logs match your filter criteria</h3>
          <p>Try clearing your search query or selecting "All Dates" / "All Projects".</p>
          <button 
            className="btn btn-secondary"
            onClick={() => {
              setSearchQuery('');
              setSelectedProject('All');
              setSelectedStatus('All');
              setDateRangeFilter('all');
            }}
          >
            Reset Filters
          </button>
        </div>
      ) : activeView === 'timeline' ? (
        /* Timeline View Grouped By Date */
        <div className="timeline-container">
          {Object.entries(groupedLogs).map(([dateStr, items]) => {
            const dayHours = items.reduce((sum, it) => sum + (parseFloat(it.hours) || 0), 0);
            const relativeBadge = getRelativeDateLabel(dateStr);

            return (
              <div key={dateStr} className="date-group">
                <div className="date-header">
                  <div className="date-title-wrap">
                    <span className="date-badge">{dateStr}</span>
                    <strong style={{ fontSize: '1rem' }}>{formatReadableDate(dateStr)}</strong>
                    {relativeBadge && (
                      <span className="brand-badge" style={{ backgroundColor: 'rgba(16, 185, 129, 0.15)', color: '#10b981', borderColor: 'rgba(16, 185, 129, 0.3)' }}>
                        {relativeBadge}
                      </span>
                    )}
                  </div>
                  
                  <div className="date-summary-stats">
                    <span>{items.length} task{items.length > 1 ? 's' : ''}</span>
                    <span className="day-hours-badge">
                      <Clock size={14} />
                      {dayHours.toFixed(1)} hrs total
                    </span>
                    <button 
                      className="btn btn-secondary" 
                      style={{ padding: '4px 10px', fontSize: '0.78rem' }}
                      onClick={() => handleOpenCreateModal(dateStr)}
                      title="Add another task for this date"
                    >
                      <Plus size={13} />
                      Add Task
                    </button>
                  </div>
                </div>

                <div className="log-items-list">
                  {items.map(log => {
                    const statusConfig = getStatusColorConfig(log.status);
                    return (
                      <article key={log.id} className="log-item">
                        <div className="log-item-header">
                          <div className="log-title-area">
                            <h3 className="log-title">
                              <span>{log.title}</span>
                            </h3>

                            <div className="log-meta-tags">
                              <span 
                                className="badge-tag"
                                style={{
                                  backgroundColor: statusConfig.bg,
                                  color: statusConfig.color,
                                  border: `1px solid ${statusConfig.border}`
                                }}
                              >
                                {log.status}
                              </span>

                              <span className="badge-tag badge-project">
                                <Briefcase size={12} />
                                {log.project}
                              </span>

                              <span className="badge-tag badge-category">
                                <Code2 size={12} />
                                {log.category}
                              </span>

                              <span className="badge-hours">
                                <Clock size={12} />
                                {log.hours}h
                              </span>
                            </div>
                          </div>

                          <div className="log-actions">
                            <button 
                              className="btn-icon" 
                              onClick={() => handleDuplicate(log)}
                              title="Duplicate to today"
                            >
                              <Copy size={15} />
                            </button>
                            <button 
                              className="btn-icon" 
                              onClick={() => handleOpenEditModal(log)}
                              title="Edit log entry"
                            >
                              <Edit3 size={15} />
                            </button>
                            <button 
                              className="btn-icon" 
                              onClick={() => handleDelete(log.id)}
                              title="Delete log"
                            >
                              <Trash2 size={15} color="#ef4444" />
                            </button>
                          </div>
                        </div>

                        {/* Description bullet points */}
                        {log.description && (
                          <div className="log-description">
                            {log.description}
                          </div>
                        )}

                        {/* Blocker alert if present */}
                        {log.blockers && (
                          <div className="log-blocker-note">
                            <AlertCircle size={15} style={{ flexShrink: 0 }} />
                            <span><strong>Blocker / Dependency:</strong> {log.blockers}</span>
                          </div>
                        )}

                        {/* Relevant Links & PRs */}
                        {log.links && log.links.length > 0 && (
                          <div className="log-links-list">
                            {log.links.map((link, idx) => (
                              <a 
                                key={idx} 
                                href={link.url} 
                                target="_blank" 
                                rel="noreferrer"
                                className="log-link-pill"
                              >
                                <ExternalLink size={12} />
                                <span>{link.label || 'Reference'}</span>
                              </a>
                            ))}
                          </div>
                        )}
                      </article>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Table View */
        <div className="table-card">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Project</th>
                <th>Task / Headline</th>
                <th>Category</th>
                <th>Hours</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.map(log => {
                const statusConfig = getStatusColorConfig(log.status);
                return (
                  <tr key={log.id}>
                    <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 600 }}>{log.date}</td>
                    <td>
                      <span className="badge-tag badge-project">{log.project}</span>
                    </td>
                    <td>
                      <strong style={{ display: 'block', marginBottom: '2px' }}>{log.title}</strong>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-subtle)' }}>
                        {log.description ? log.description.split('\n')[0].replace('•', '').trim() : ''}
                      </span>
                    </td>
                    <td>
                      <span className="badge-tag badge-category">{log.category}</span>
                    </td>
                    <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 700 }}>
                      {log.hours}h
                    </td>
                    <td>
                      <span 
                        className="badge-tag"
                        style={{
                          backgroundColor: statusConfig.bg,
                          color: statusConfig.color,
                          border: `1px solid ${statusConfig.border}`
                        }}
                      >
                        {log.status}
                      </span>
                    </td>
                    <td>
                      <div className="log-actions" style={{ justifyContent: 'flex-end' }}>
                        <button className="btn-icon" onClick={() => handleOpenEditModal(log)} title="Edit">
                          <Edit3 size={14} />
                        </button>
                        <button className="btn-icon" onClick={() => handleDelete(log.id)} title="Delete">
                          <Trash2 size={14} color="#ef4444" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal: Add / Edit Work Log */}
      {isFormModalOpen && (
        <div className="modal-overlay" onClick={() => setIsFormModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingLog ? 'Edit Work Documentation' : 'Log New Work Activity'}</h2>
              <button className="btn-icon" onClick={() => setIsFormModalOpen(false)}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveLog}>
              <div className="modal-body">
                <div className="form-row-2">
                  <div className="form-group">
                    <label className="form-label">Date of Work</label>
                    <input 
                      type="date" 
                      className="form-input" 
                      required
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Hours Spent</label>
                    <input 
                      type="number" 
                      step="0.25" 
                      min="0.25" 
                      max="24"
                      className="form-input" 
                      required
                      value={formData.hours}
                      onChange={(e) => setFormData({ ...formData, hours: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Task / Work Headline</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Implemented OAuth 2.0 PKCE Authorization Flow"
                    className="form-input" 
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  />
                </div>

                <div className="form-row-3">
                  <div className="form-group">
                    <label className="form-label">Project / Client</label>
                    <input 
                      type="text" 
                      list="project-suggestions"
                      className="form-input"
                      placeholder="e.g. A5A Assessment"
                      value={formData.project}
                      onChange={(e) => setFormData({ ...formData, project: e.target.value })}
                    />
                    <datalist id="project-suggestions">
                      <option value="A5A Assessment" />
                      <option value="VakilDesk" />
                      <option value="Internal / Agile" />
                      <option value="DevOps & Tooling" />
                    </datalist>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Work Category</label>
                    <select 
                      className="form-select"
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    >
                      {CATEGORIES.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Work Status</label>
                    <select 
                      className="form-select"
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    >
                      {STATUS_OPTIONS.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Detailed Description / Highlights</label>
                  <textarea 
                    className="form-textarea" 
                    rows={4}
                    placeholder="• Implemented API endpoints&#10;• Refactored database schema&#10;• Added tests and verified edge cases"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Blockers or Dependencies (Optional)</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Awaiting AWS IAM permissions approval or API spec"
                    className="form-input"
                    value={formData.blockers}
                    onChange={(e) => setFormData({ ...formData, blockers: e.target.value })}
                  />
                </div>

                {/* PR / Commit Links */}
                <div className="form-group">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                    <label className="form-label">Deliverables & PR Links</label>
                    <button 
                      type="button" 
                      className="btn btn-secondary" 
                      style={{ padding: '2px 8px', fontSize: '0.75rem' }}
                      onClick={handleAddLink}
                    >
                      + Add Link
                    </button>
                  </div>

                  {formData.links.map((link, idx) => (
                    <div key={idx} style={{ display: 'flex', gap: '8px', marginBottom: '6px' }}>
                      <input 
                        type="text" 
                        placeholder="Label (e.g. PR #142)"
                        className="form-input"
                        style={{ flex: '1' }}
                        value={link.label}
                        onChange={(e) => handleLinkChange(idx, 'label', e.target.value)}
                      />
                      <input 
                        type="url" 
                        placeholder="https://github.com/..."
                        className="form-input"
                        style={{ flex: '2' }}
                        value={link.url}
                        onChange={(e) => handleLinkChange(idx, 'url', e.target.value)}
                      />
                      {formData.links.length > 1 && (
                        <button 
                          type="button" 
                          className="btn-icon" 
                          onClick={() => handleRemoveLink(idx)}
                        >
                          <X size={14} color="#ef4444" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setIsFormModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingLog ? 'Save Changes' : 'Create Work Log'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Standup Generator */}
      {isStandupModalOpen && (
        <div className="modal-overlay" onClick={() => setIsStandupModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Slack / Teams Standup Generator</h2>
              <button className="btn-icon" onClick={() => setIsStandupModalOpen(false)}>
                <X size={18} />
              </button>
            </div>

            <div className="modal-body">
              <div style={{ display: 'flex', gap: '10px', marginBottom: '12px' }}>
                <button 
                  className={`btn ${standupTab === 'today' ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={() => setStandupTab('today')}
                >
                  Today's Standup Update
                </button>
                <button 
                  className={`btn ${standupTab === 'weekly' ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={() => setStandupTab('weekly')}
                >
                  Weekly Executive Summary
                </button>
              </div>

              <div className="standup-preview-box">
                {standupText}
              </div>
            </div>

            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={() => setIsStandupModalOpen(false)}>
                Close
              </button>
              <button type="button" className="btn btn-primary" onClick={handleCopyStandup}>
                <Copy size={16} />
                <span>Copy Standup Text</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
