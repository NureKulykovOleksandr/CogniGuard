import React, { useState, useEffect } from 'react';

// Dictionary of translations for Ukrainian and English
const T = {
  ua: {
    title: "CogniGuard — Панель Моніторингу",
    loginTitle: "Авторизація в CogniGuard",
    loginBtn: "Увійти",
    logoutBtn: "Вийти",
    loginLabel: "Логін (Ім'я користувача)",
    passwordLabel: "Пароль",
    loginError: "Невірний логін або пароль",
    connError: "Не вдалося з'єднатися з сервером",
    dashboard: "Дашборд",
    adminPanel: "Адміністрування",
    profile: "Мій профіль",
    settings: "Налаштування",
    langLabel: "Мова (Language)",
    dirLabel: "Напрямок тексту",
    dateFormatLabel: "Формат дати та часу",
    sortingLabel: "Сортування",
    ltr: "Зліва направо (LTR)",
    rtl: "Справа наліво (RTL)",
    uaFormat: "Український (ДД.ММ.РРРР)",
    usFormat: "Американський (ММ/ДД/РРРР)",
    sortName: "За ім'ям (український алфавіт)",
    sortRole: "За роллю",
    totalSoldiers: "Всього особового складу",
    avgReaction: "Сер. час реакції",
    totalErrors: "Сумарно помилок",
    activeAlerts: "Активні алерти",
    readinessTitle: "Бойова готовність підрозділу",
    soldierName: "ПІБ",
    rank: "Звання",
    role: "Роль",
    unit: "Підрозділ",
    status: "Статус",
    actions: "Дії",
    alertFeed: "Стрічка сповіщень",
    reactionTrend: "Динаміка швидкості реакції (PVT)",
    days: ["Пн", "Вв", "Ср", "Чт", "Пт", "Сб", "Нд"],
    statusNormal: "У нормі",
    statusFatigue: "Втома",
    statusCritical: "Критичний стан",
    userManagement: "Керування користувачами",
    searchPlaceholder: "Пошук бійця за ім'ям або званням...",
    addUser: "Додати користувача",
    editUser: "Редагувати",
    deleteUser: "Видалити",
    sysAdmin: "Системне адміністрування",
    createBackup: "Резервне копіювання (Backup)",
    exportDb: "Експорт бази даних (JSON)",
    importDb: "Імпорт бази даних (JSON)",
    confirmDelete: "Ви дійсно бажаєте видалити цього користувача?",
    saveBtn: "Зберегти",
    cancelBtn: "Скасувати",
    fullName: "Повне ім'я (ПІБ)",
    password: "Пароль (залиште порожнім, якщо не змінюється)",
    selectRole: "Оберіть роль",
    soldierRole: "Солдат",
    commanderRole: "Командир",
    medicRole: "Медик",
    adminRole: "Адміністратор",
    unitPlaceholder: "Ідентифікатор підрозділу (напр. Unit-101)",
    backupSuccess: "Резервну копію успішно створено на сервері: ",
    importSuccess: "Базу даних успішно імпортовано та відновлено!",
    importFileLabel: "Оберіть JSON файл для імпорту",
    unitManagement: "Керування підрозділами",
    addUnit: "Додати підрозділ",
    editUnit: "Редагувати підрозділ",
    deleteUnit: "Видалити підрозділ",
    unitName: "Назва підрозділу",
    unitLocation: "Локація підрозділу",
    noUnit: "Без підрозділу",
    confirmDeleteUnit: "Ви дійсно бажаєте видалити цей підрозділ?",
    viewDetails: "Перегляд",
    soldierDetails: "Детальний звіт по бійцю",
    totalTests: "Всього тестів",
    testType: "Тип тесту",
    reactionTime: "Час реакції",
    errorsCount: "Помилки",
    date: "Дата проходження",
    backBtn: "Назад до списку",
    noHistory: "Історія тестів цього бійця порожня.",
    personalTrend: "Персональний тренд часу реакції",
    allUnits: "Всі підрозділи",
    notEnoughData: "Недостатньо даних для графіка",
    unitTrend: "Динаміка швидкості реакції підрозділу"
  },
  en: {
    title: "CogniGuard — Monitoring Panel",
    loginTitle: "CogniGuard Authentication",
    loginBtn: "Login",
    logoutBtn: "Logout",
    loginLabel: "Login (Username)",
    passwordLabel: "Password",
    loginError: "Invalid login or password",
    connError: "Failed to connect to server",
    dashboard: "Dashboard",
    adminPanel: "Administration",
    profile: "Profile",
    settings: "Settings",
    langLabel: "Language",
    dirLabel: "Text Direction",
    dateFormatLabel: "Date & Time Format",
    sortingLabel: "Sorting Order",
    ltr: "Left to Right (LTR)",
    rtl: "Right to Left (RTL)",
    uaFormat: "Ukrainian (DD.MM.YYYY)",
    usFormat: "US format (MM/DD/YYYY)",
    sortName: "By Name (Ukrainian collation)",
    sortRole: "By Role",
    totalSoldiers: "Total Personnel",
    avgReaction: "Avg Reaction Time",
    totalErrors: "Total Errors",
    activeAlerts: "Active Alerts",
    readinessTitle: "Personnel Combat Readiness",
    soldierName: "Name",
    rank: "Rank",
    role: "Role",
    unit: "Unit",
    status: "Status",
    actions: "Actions",
    alertFeed: "Alert Feed",
    reactionTrend: "Reaction Time Dynamics (PVT)",
    days: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    statusNormal: "Normal",
    statusFatigue: "Fatigue",
    statusCritical: "Critical",
    userManagement: "User Management",
    searchPlaceholder: "Search by name or rank...",
    addUser: "Add User",
    editUser: "Edit",
    deleteUser: "Delete",
    sysAdmin: "System Administration",
    createBackup: "Create Backup (Server)",
    exportDb: "Export Database (JSON)",
    importDb: "Import Database (JSON)",
    confirmDelete: "Are you sure you want to delete this user?",
    saveBtn: "Save",
    cancelBtn: "Cancel",
    fullName: "Full Name",
    password: "Password (leave blank if unchanged)",
    selectRole: "Select Role",
    soldierRole: "Soldier",
    commanderRole: "Commander",
    medicRole: "Medic",
    adminRole: "Administrator",
    unitPlaceholder: "Unit Identifier (e.g. Unit-101)",
    backupSuccess: "Backup created successfully on server: ",
    importSuccess: "Database successfully imported and restored!",
    importFileLabel: "Choose JSON file to import",
    unitManagement: "Unit Management",
    addUnit: "Add Unit",
    editUnit: "Edit Unit",
    deleteUnit: "Delete Unit",
    unitName: "Unit Name",
    unitLocation: "Unit Location",
    noUnit: "No Unit",
    confirmDeleteUnit: "Are you sure you want to delete this unit?",
    viewDetails: "View",
    soldierDetails: "Detailed Soldier Report",
    totalTests: "Total Tests",
    testType: "Test Type",
    reactionTime: "Reaction Time",
    errorsCount: "Errors",
    date: "Date",
    backBtn: "Back to List",
    noHistory: "No test history available for this soldier.",
    personalTrend: "Personal Reaction Time Trend",
    allUnits: "All Units",
    notEnoughData: "Not enough data for chart",
    unitTrend: "Unit Reaction Time Dynamics"
  }
};

const API_URL = "http://localhost:3000/api";

export default function App() {
  const [token, setToken] = useState(localStorage.getItem('@web_token') || null);
  const [currentUser, setCurrentUser] = useState(JSON.parse(localStorage.getItem('@web_user')) || null);
  
  // Customization & Localization state
  const [language, setLanguage] = useState(localStorage.getItem('@pref_lang') || 'ua');
  const [rtl, setRtl] = useState(localStorage.getItem('@pref_rtl') === 'true');
  const [dateFormat, setDateFormat] = useState(localStorage.getItem('@pref_date') || 'ua');
  const [sortingType, setSortingType] = useState(localStorage.getItem('@pref_sort') || 'name');
  
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loginForm, setLoginForm] = useState({ login: '', password: '' });
  const [loginError, setLoginError] = useState('');
  
  // Data state
  const [users, setUsers] = useState([]);
  const [units, setUnits] = useState([]);
  const [tests, setTests] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Dashboard Unit filter
  const [selectedUnitFilter, setSelectedUnitFilter] = useState('');

  // Detailed view of a soldier
  const [selectedSoldier, setSelectedSoldier] = useState(null);

  // User Edit Modal state
  const [showUserModal, setShowUserModal] = useState(false);
  const [modalMode, setModalMode] = useState('create'); // create or edit
  const [modalForm, setModalForm] = useState({
    id: '',
    full_name: '',
    login: '',
    password: '',
    rank: '',
    role: 'soldier',
    unit_id: ''
  });

  // Unit CRUD Modal state
  const [showUnitModal, setShowUnitModal] = useState(false);
  const [modalUnitMode, setModalUnitMode] = useState('create'); // create or edit
  const [modalUnitForm, setModalUnitForm] = useState({
    id: '',
    name: '',
    location: ''
  });

  const t = T[language];

  // Persist settings
  useEffect(() => {
    localStorage.setItem('@pref_lang', language);
  }, [language]);

  useEffect(() => {
    localStorage.setItem('@pref_rtl', rtl);
  }, [rtl]);

  useEffect(() => {
    localStorage.setItem('@pref_date', dateFormat);
  }, [dateFormat]);

  useEffect(() => {
    localStorage.setItem('@pref_sort', sortingType);
  }, [sortingType]);

  // Load backend data if logged in
  useEffect(() => {
    if (token) {
      loadData();
    }
  }, [token]);

  // Handle role constraints upon login or load
  useEffect(() => {
    if (currentUser) {
      if (['commander', 'soldier'].includes(currentUser.role)) {
        // Enforce the unit filter to be their assigned unit ONLY
        setSelectedUnitFilter(currentUser.unit_id || 'no_unit_assigned');
      } else {
        setSelectedUnitFilter('');
      }
    }
  }, [currentUser]);

  const loadData = async () => {
    try {
      // Fetch users
      const usersRes = await fetch(`${API_URL}/users`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (usersRes.ok) {
        const usersData = await usersRes.json();
        setUsers(usersData);
      }
      
      // Fetch units
      const unitsRes = await fetch(`${API_URL}/units`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (unitsRes.ok) {
        const unitsData = await unitsRes.json();
        setUnits(unitsData);
      }
      
      // Fetch tests
      const testsRes = await fetch(`${API_URL}/tests/history`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (testsRes.ok) {
        const testsData = await testsRes.json();
        setTests(testsData);
      }
    } catch (e) {
      console.error("Error loading data from API:", e);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError('');
    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginForm)
      });
      const data = await res.json();
      if (res.ok) {
        setToken(data.token);
        setCurrentUser(data.user);
        localStorage.setItem('@web_token', data.token);
        localStorage.setItem('@web_user', JSON.stringify(data.user));
      } else {
        setLoginError(data.message || t.loginError);
      }
    } catch (err) {
      setLoginError(t.connError);
    }
  };

  const handleLogout = () => {
    setToken(null);
    setCurrentUser(null);
    setSelectedSoldier(null);
    setActiveTab('dashboard');
    localStorage.removeItem('@web_token');
    localStorage.removeItem('@web_user');
  };

  // User CRUD functions
  const handleSaveUser = async (e) => {
    e.preventDefault();
    try {
      if (modalMode === 'create') {
        const res = await fetch(`${API_URL}/auth/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(modalForm)
        });
        if (res.ok) {
          setShowUserModal(false);
          loadData();
        } else {
          const data = await res.json();
          alert(data.message || "Failed to create user");
        }
      } else {
        const updatePayload = {
          full_name: modalForm.full_name,
          login: modalForm.login,
          rank: modalForm.rank,
          role: modalForm.role,
          unit_id: modalForm.unit_id || null
        };
        if (modalForm.password) {
          updatePayload.password = modalForm.password;
        }

        const res = await fetch(`${API_URL}/users/${modalForm.id}`, {
          method: 'PATCH',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` 
          },
          body: JSON.stringify(updatePayload)
        });
        if (res.ok) {
          setShowUserModal(false);
          loadData();
        } else {
          const data = await res.json();
          alert(data.message || "Failed to update user");
        }
      }
    } catch (err) {
      alert("Network error");
    }
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm(t.confirmDelete)) return;
    try {
      const res = await fetch(`${API_URL}/users/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        loadData();
      } else {
        alert("Failed to delete user");
      }
    } catch (err) {
      alert("Network error");
    }
  };

  const openCreateModal = () => {
    setModalMode('create');
    setModalForm({
      id: '',
      full_name: '',
      login: '',
      password: '',
      rank: '',
      role: 'soldier',
      unit_id: ''
    });
    setShowUserModal(true);
  };

  const openEditModal = (user) => {
    setModalMode('edit');
    setModalForm({
      id: user._id,
      full_name: user.full_name,
      login: user.login,
      password: '',
      rank: user.rank || '',
      role: user.role || 'soldier',
      unit_id: user.unit_id || ''
    });
    setShowUserModal(true);
  };

  // Unit CRUD functions
  const handleSaveUnit = async (e) => {
    e.preventDefault();
    try {
      if (modalUnitMode === 'create') {
        const res = await fetch(`${API_URL}/units`, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(modalUnitForm)
        });
        if (res.ok) {
          setShowUnitModal(false);
          loadData();
        } else {
          alert("Failed to create unit");
        }
      } else {
        const res = await fetch(`${API_URL}/units/${modalUnitForm.id}`, {
          method: 'PATCH',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            name: modalUnitForm.name,
            location: modalUnitForm.location
          })
        });
        if (res.ok) {
          setShowUnitModal(false);
          loadData();
        } else {
          alert("Failed to update unit");
        }
      }
    } catch (err) {
      alert("Network error");
    }
  };

  const handleDeleteUnit = async (id) => {
    if (!window.confirm(t.confirmDeleteUnit)) return;
    try {
      const res = await fetch(`${API_URL}/units/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        loadData();
      } else {
        const data = await res.json();
        alert(data.message || "Failed to delete unit");
      }
    } catch (err) {
      alert("Network error");
    }
  };

  const openCreateUnitModal = () => {
    setModalUnitMode('create');
    setModalUnitForm({ id: '', name: '', location: '' });
    setShowUnitModal(true);
  };

  const openEditUnitModal = (unit) => {
    setModalUnitMode('edit');
    setModalUnitForm({
      id: unit._id,
      name: unit.name,
      location: unit.location || ''
    });
    setShowUnitModal(true);
  };

  // Backup & Import/Export
  const triggerBackup = async () => {
    try {
      const res = await fetch(`${API_URL}/admin/backup`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) {
        alert(`${t.backupSuccess} ${data.file_name}`);
      } else {
        alert("Backup failed: " + data.message);
      }
    } catch (e) {
      alert("Connection failed");
    }
  };

  const triggerExport = () => {
    window.open(`${API_URL}/admin/export?user_id=${currentUser._id}`, '_blank');
  };

  const handleImportFile = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (evt) => {
      try {
        const importedData = JSON.parse(evt.target.result);
        const res = await fetch(`${API_URL}/admin/import`, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(importedData.data || importedData)
        });
        if (res.ok) {
          alert(t.importSuccess);
          loadData();
        } else {
          const data = await res.json();
          alert("Import failed: " + data.message);
        }
      } catch (err) {
        alert("Invalid JSON format");
      }
    };
    reader.readAsText(file);
  };

  // i18n Date formatting
  const formatDateTime = (isoString) => {
    if (!isoString) return "";
    const date = new Date(isoString);
    if (isNaN(date.getTime())) return isoString;

    const pad = (n) => String(n).padStart(2, '0');
    const day = pad(date.getDate());
    const month = pad(date.getMonth() + 1);
    const year = date.getFullYear();
    const hours = pad(date.getHours());
    const min = pad(date.getMinutes());

    if (dateFormat === 'ua') {
      return `${day}.${month}.${year} ${hours}:${min}`;
    } else {
      let h = date.getHours();
      const ampm = h >= 12 ? 'PM' : 'AM';
      h = h % 12;
      h = h ? h : 12;
      return `${month}/${day}/${year} ${pad(h)}:${min} ${ampm}`;
    }
  };

  // Locale-aware sorting of users
  const getSortedUsers = () => {
    const filtered = users.filter(u => 
      u.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (u.rank && u.rank.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    if (sortingType === 'name') {
      return [...filtered].sort((a, b) => 
        a.full_name.localeCompare(b.full_name, 'uk-UA', { sensitivity: 'base' })
      );
    } else {
      const roleOrder = { admin: 0, commander: 1, medic: 2, soldier: 3 };
      return [...filtered].sort((a, b) => 
        (roleOrder[a.role] || 99) - (roleOrder[b.role] || 99)
      );
    }
  };

  // Helpers to resolve human readable unit names
  const getUnitName = (unitId) => {
    if (!unitId) return t.noUnit;
    const found = units.find(u => u._id === unitId);
    return found ? found.name : unitId;
  };

  // Single soldier detailed statistics
  const getSoldierStats = (soldier) => {
    const soldierTests = tests.filter(t => t.user_id === soldier.login || t.user_id === soldier._id);
    const total = soldierTests.length;
    const avg = total > 0 ? Math.round(soldierTests.reduce((a, b) => a + b.reaction_time_ms, 0) / total) : 0;
    const errors = soldierTests.reduce((a, b) => a + b.errors_count, 0);
    const critical = soldierTests.filter(t => t.status === 'critical').length;
    const fatigue = soldierTests.filter(t => t.status === 'fatigue').length;
    
    let currentStatus = 'normal';
    if (soldierTests[0]) currentStatus = soldierTests[0].status;

    return { total, avg, errors, critical, fatigue, currentStatus, history: soldierTests };
  };

  // Filtered lists for Dashboard tab (using selectedUnitFilter)
  const getFilteredDashboardData = () => {
    const filteredUsers = selectedUnitFilter
      ? users.filter(u => u.unit_id === selectedUnitFilter)
      : users;
    
    const userLogins = filteredUsers.map(u => u.login);
    const userIds = filteredUsers.map(u => u._id);

    const filteredTests = tests.filter(t => 
      userIds.includes(t.user_id) || userLogins.includes(t.user_id)
    );

    const totalSoldiers = filteredUsers.length;
    const avgReaction = filteredTests.length > 0
      ? Math.round(filteredTests.reduce((a, b) => a + b.reaction_time_ms, 0) / filteredTests.length)
      : 0;
    const totalErrors = filteredTests.reduce((a, b) => a + b.errors_count, 0);
    const activeAlerts = filteredTests.filter(t => t.status === 'critical').length;

    return {
      filteredUsers,
      filteredTests,
      totalSoldiers,
      avgReaction,
      totalErrors,
      activeAlerts
    };
  };

  const dashboardData = getFilteredDashboardData();

  // Login component
  if (!token) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <div className="glass-card" style={{ width: '400px', padding: '40px', textAlign: 'left' }}>
          <h1 style={{ fontSize: '28px', textAlign: 'center', marginBottom: '24px' }}>{t.loginTitle}</h1>
          <form onSubmit={handleLogin}>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '8px' }}>{t.loginLabel}</label>
              <input 
                id="login-username"
                className="form-input" 
                type="text" 
                value={loginForm.login} 
                onChange={(e) => setLoginForm({...loginForm, login: e.target.value})} 
                required
              />
            </div>
            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '8px' }}>{t.passwordLabel}</label>
              <input 
                id="login-password"
                className="form-input" 
                type="password" 
                value={loginForm.password} 
                onChange={(e) => setLoginForm({...loginForm, password: e.target.value})} 
                required
              />
            </div>
            {loginError && <p style={{ color: 'var(--status-critical)', fontSize: '14px', marginBottom: '16px' }}>{loginError}</p>}
            <button id="login-submit-btn" className="btn-primary" type="submit" style={{ width: '100%', justifyContent: 'center' }}>{t.loginBtn}</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div dir={rtl ? 'rtl' : 'ltr'}>
      {/* Header */}
      <header className="app-header">
        <div className="app-logo">
          <div className="logo-icon">CG</div>
          <span className="logo-text">CogniGuard</span>
        </div>
        <nav style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <button 
            id="nav-dashboard"
            className="btn-secondary" 
            style={{ 
              background: activeTab === 'dashboard' ? 'var(--accent-color)' : '', 
              borderColor: activeTab === 'dashboard' ? 'var(--accent-color)' : '',
              color: activeTab === 'dashboard' ? '#fff' : ''
            }}
            onClick={() => { setActiveTab('dashboard'); setSelectedSoldier(null); }}
          >
            {t.dashboard}
          </button>
          
          {/* Admin panel only for admin role (restricting commander & medic from system backups and DB imports/exports) */}
          {currentUser.role === 'admin' && (
            <button 
              id="nav-admin"
              className="btn-secondary" 
              style={{ 
                background: activeTab === 'admin' ? 'var(--accent-color)' : '', 
                borderColor: activeTab === 'admin' ? 'var(--accent-color)' : '',
                color: activeTab === 'admin' ? '#fff' : ''
              }}
              onClick={() => setActiveTab('admin')}
            >
              {t.adminPanel}
            </button>
          )}

          <button 
            id="nav-profile"
            className="btn-secondary" 
            style={{ 
              background: activeTab === 'profile' ? 'var(--accent-color)' : '', 
              borderColor: activeTab === 'profile' ? 'var(--accent-color)' : '',
              color: activeTab === 'profile' ? '#fff' : ''
            }}
            onClick={() => setActiveTab('profile')}
          >
            {t.profile}
          </button>

          <button id="nav-logout" className="btn-danger" onClick={handleLogout}>{t.logoutBtn}</button>
        </nav>
      </header>

      {/* Main Content */}
      <main style={{ paddingBottom: '60px' }}>
        
        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && !selectedSoldier && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '32px 32px 0', flexWrap: 'wrap', gap: '16px' }}>
              <h2 style={{ fontSize: '32px', margin: 0, textAlign: rtl ? 'right' : 'left' }}>
                {t.dashboard}
              </h2>

              {/* Dropdown filter visible ONLY for Admin/Medic (Commanders are locked to their own unit) */}
              {['admin', 'medic'].includes(currentUser.role) ? (
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <span style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>Фільтр підрозділу:</span>
                  <select 
                    id="dashboard-unit-filter"
                    className="form-input" 
                    style={{ width: '220px' }} 
                    value={selectedUnitFilter}
                    onChange={(e) => setSelectedUnitFilter(e.target.value)}
                  >
                    <option value="">{t.allUnits}</option>
                    {units.map(unit => (
                      <option key={unit._id} value={unit._id}>{unit.name}</option>
                    ))}
                  </select>
                </div>
              ) : (
                /* Text indicator for commander showing their specific unit context */
                <div style={{ background: 'var(--accent-glow)', padding: '8px 16px', borderRadius: '8px', border: '1px solid var(--accent-color)' }}>
                  <span style={{ fontSize: '14px', fontWeight: '600' }}>
                    {t.unit}: <span style={{ color: 'var(--text-primary)' }}>{getUnitName(currentUser.unit_id)}</span>
                  </span>
                </div>
              )}
            </div>
            
            {/* Stats row */}
            <div className="stats-row" style={{ marginTop: '24px' }}>
              <div className="glass-card" style={{ padding: '20px', textAlign: 'left' }}>
                <p style={{ color: 'var(--text-secondary)', fontSize: '14px', margin: 0 }}>{t.totalSoldiers}</p>
                <h3 style={{ fontSize: '36px', margin: '10px 0 0', color: 'var(--text-primary)' }}>{dashboardData.totalSoldiers}</h3>
              </div>
              <div className="glass-card" style={{ padding: '20px', textAlign: 'left' }}>
                <p style={{ color: 'var(--text-secondary)', fontSize: '14px', margin: 0 }}>{t.avgReaction}</p>
                <h3 style={{ fontSize: '36px', margin: '10px 0 0', color: 'var(--accent-color)' }}>{dashboardData.avgReaction} ms</h3>
              </div>
              <div className="glass-card" style={{ padding: '20px', textAlign: 'left' }}>
                <p style={{ color: 'var(--text-secondary)', fontSize: '14px', margin: 0 }}>{t.totalErrors}</p>
                <h3 style={{ fontSize: '36px', margin: '10px 0 0', color: 'var(--status-fatigue)' }}>{dashboardData.totalErrors}</h3>
              </div>
              <div className="glass-card" style={{ padding: '20px', textAlign: 'left' }}>
                <p style={{ color: 'var(--text-secondary)', fontSize: '14px', margin: 0 }}>{t.activeAlerts}</p>
                <h3 style={{ fontSize: '36px', margin: '10px 0 0', color: 'var(--status-critical)' }}>{dashboardData.activeAlerts}</h3>
              </div>
            </div>

            {/* Dashboard Grid */}
            <div className="dashboard-grid" style={{ paddingTop: 0 }}>
              
              {/* Soldier Readiness List */}
              <div className="glass-card" style={{ padding: '24px', gridColumn: 'span 2' }}>
                <h3 style={{ fontSize: '20px', marginBottom: '20px', textAlign: 'left' }}>{t.readinessTitle}</h3>
                <div className="admin-table-container">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>{t.soldierName}</th>
                        <th>{t.rank}</th>
                        <th>{t.role}</th>
                        <th>{t.unit}</th>
                        <th>{t.status}</th>
                        <th>{t.actions}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {dashboardData.filteredUsers.map(u => {
                        const soldierStats = getSoldierStats(u);
                        return (
                          <tr key={u._id}>
                            <td style={{ fontWeight: '600' }}>{u.full_name}</td>
                            <td>{u.rank || '—'}</td>
                            <td style={{ textTransform: 'capitalize' }}>{u.role}</td>
                            <td>{getUnitName(u.unit_id)}</td>
                            <td>
                              <span className={`status-badge ${soldierStats.currentStatus}`}>
                                {soldierStats.currentStatus === 'normal' && t.statusNormal}
                                {soldierStats.currentStatus === 'fatigue' && t.statusFatigue}
                                {soldierStats.currentStatus === 'critical' && t.statusCritical}
                              </span>
                            </td>
                            <td>
                              <button 
                                className="btn-secondary" 
                                style={{ padding: '6px 12px', fontSize: '12px' }}
                                onClick={() => setSelectedSoldier(u)}
                              >
                                {t.viewDetails}
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Right Column (dynamic unit trends & alerts) */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                
                {/* SVG Trend Graph (filtered dynamically by unit) */}
                <div className="glass-card" style={{ padding: '24px', textAlign: 'left' }}>
                  <h3 style={{ fontSize: '18px', marginBottom: '16px' }}>
                    {selectedUnitFilter ? t.unitTrend : t.reactionTrend}
                  </h3>
                  
                  {(() => {
                    const trendTests = [...dashboardData.filteredTests].reverse().slice(-5);
                    if (trendTests.length < 2) {
                      return (
                        <div style={{ height: '140px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
                          {t.notEnoughData}
                        </div>
                      );
                    }
                    
                    const minRT = 200;
                    const maxRT = 800;
                    const spanX = 100 / (trendTests.length - 1);
                    
                    let pPoints = "";
                    let pointsList = [];
                    
                    trendTests.forEach((item, index) => {
                      const x = index * spanX;
                      const rtVal = Math.max(minRT, Math.min(maxRT, item.reaction_time_ms));
                      const y = 25 - ((rtVal - minRT) / (maxRT - minRT)) * 20;
                      pPoints += `${x},${y} `;
                      pointsList.push({ x, y, val: item.reaction_time_ms });
                    });

                    return (
                      <div style={{ position: 'relative', height: '140px', width: '100%', marginTop: '10px' }}>
                        <svg viewBox="0 0 100 30" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
                          <line x1="0" y1="5" x2="100" y2="5" stroke="rgba(255,255,255,0.05)" strokeWidth="0.2" />
                          <line x1="0" y1="15" x2="100" y2="15" stroke="rgba(255,255,255,0.05)" strokeWidth="0.2" />
                          <line x1="0" y1="25" x2="100" y2="25" stroke="rgba(255,255,255,0.05)" strokeWidth="0.2" />
                          
                          <path d={`M0,30 L${pPoints} L100,30 Z`} fill="url(#unit-gradient)" opacity="0.2" />
                          <polyline points={pPoints} fill="none" stroke="var(--accent-color)" strokeWidth="1" />
                          
                          {pointsList.map((pt, idx) => (
                            <g key={idx}>
                              <circle cx={pt.x} cy={pt.y} r="1" fill="#fff" stroke="var(--accent-color)" strokeWidth="0.5" />
                            </g>
                          ))}
                          
                          <defs>
                            <linearGradient id="unit-gradient" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor="var(--accent-color)" />
                              <stop offset="100%" stopColor="transparent" />
                            </linearGradient>
                          </defs>
                        </svg>
                      </div>
                    );
                  })()}
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '12px', fontSize: '12px', color: 'var(--text-secondary)' }}>
                    {t.days.map((day, idx) => <span key={idx}>{day}</span>)}
                  </div>
                </div>

                {/* Alerts feed */}
                <div className="glass-card" style={{ padding: '24px', flex: 1, textAlign: 'left' }}>
                  <h3 style={{ fontSize: '18px', marginBottom: '16px' }}>{t.alertFeed}</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '250px', overflowY: 'auto' }}>
                    {dashboardData.filteredTests.filter(t => t.status === 'critical').map(alertItem => {
                      const userObj = users.find(u => u.login === alertItem.user_id || u._id === alertItem.user_id);
                      const name = userObj ? userObj.full_name : alertItem.user_id;
                      return (
                        <div key={alertItem._id} style={{ padding: '12px', background: 'rgba(239,68,68,0.06)', borderLeft: '4px solid var(--status-critical)', borderRadius: '4px', fontSize: '13px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                            <span style={{ fontWeight: '700', color: 'var(--status-critical)' }}>CRITICAL FATIGUE</span>
                            <span style={{ color: 'var(--text-muted)' }}>{formatDateTime(alertItem.timestamp)}</span>
                          </div>
                          <p style={{ margin: 0, color: 'var(--text-primary)' }}>
                            {name} ({alertItem.test_type.toUpperCase()}) — Reaction: <strong>{alertItem.reaction_time_ms} ms</strong>, Errors: <strong>{alertItem.errors_count}</strong>.
                          </p>
                        </div>
                      );
                    })}
                    {dashboardData.filteredTests.filter(t => t.status === 'critical').length === 0 && (
                      <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>No active critical alerts.</p>
                    )}
                  </div>
                </div>

              </div>

            </div>
          </div>
        )}

        {/* Detailed Soldier View */}
        {activeTab === 'dashboard' && selectedSoldier && (() => {
          const statsDetails = getSoldierStats(selectedSoldier);
          const maxPoints = 5;
          const lastTests = [...statsDetails.history].reverse().slice(-maxPoints);
          
          let polylinePoints = "";
          let dotCoordinates = [];
          if (lastTests.length > 1) {
            const minRT = 200;
            const maxRT = 800;
            const spanX = 100 / (lastTests.length - 1);
            
            lastTests.forEach((item, index) => {
              const x = index * spanX;
              const rtVal = Math.max(minRT, Math.min(maxRT, item.reaction_time_ms));
              const y = 25 - ((rtVal - minRT) / (maxRT - minRT)) * 20;
              polylinePoints += `${x},${y} `;
              dotCoordinates.push({ x, y, value: item.reaction_time_ms, date: item.timestamp });
            });
          }

          return (
            <div style={{ padding: '32px' }}>
              <button 
                id="soldier-back-btn"
                className="btn-secondary" 
                style={{ marginBottom: '24px' }} 
                onClick={() => setSelectedSoldier(null)}
              >
                ← {t.backBtn}
              </button>
              
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px', textAlign: 'left' }}>
                
                {/* Left block: Details & stats */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                  <div className="glass-card" style={{ padding: '24px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                      <h2 style={{ fontSize: '28px', margin: 0 }}>{selectedSoldier.full_name}</h2>
                      <span className={`status-badge ${statsDetails.currentStatus}`}>
                        {statsDetails.currentStatus === 'normal' && t.statusNormal}
                        {statsDetails.currentStatus === 'fatigue' && t.statusFatigue}
                        {statsDetails.currentStatus === 'critical' && t.statusCritical}
                      </span>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px' }}>
                      <div>
                        <span style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>{t.rank}:</span>
                        <p style={{ margin: '4px 0 0', fontWeight: '600' }}>{selectedSoldier.rank || '—'}</p>
                      </div>
                      <div>
                        <span style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>{t.role}:</span>
                        <p style={{ margin: '4px 0 0', fontWeight: '600', textTransform: 'capitalize' }}>{selectedSoldier.role}</p>
                      </div>
                      <div>
                        <span style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>{t.unit}:</span>
                        <p style={{ margin: '4px 0 0', fontWeight: '600' }}>{getUnitName(selectedSoldier.unit_id)}</p>
                      </div>
                    </div>
                  </div>

                  {/* History table */}
                  <div className="glass-card" style={{ padding: '24px' }}>
                    <h3 style={{ fontSize: '20px', marginBottom: '16px' }}>{t.totalTests} ({statsDetails.total})</h3>
                    {statsDetails.total > 0 ? (
                      <div className="admin-table-container">
                        <table className="admin-table">
                          <thead>
                            <tr>
                              <th>{t.testType}</th>
                              <th>{t.reactionTime}</th>
                              <th>{t.errorsCount}</th>
                              <th>{t.date}</th>
                              <th>{t.status}</th>
                            </tr>
                          </thead>
                          <tbody>
                            {statsDetails.history.map(item => (
                              <tr key={item._id}>
                                <td style={{ fontWeight: '600', textTransform: 'uppercase' }}>{item.test_type}</td>
                                <td>{item.reaction_time_ms} ms</td>
                                <td>{item.errors_count}</td>
                                <td>{formatDateTime(item.timestamp)}</td>
                                <td>
                                  <span className={`status-badge ${item.status}`}>
                                    {item.status === 'normal' && t.statusNormal}
                                    {item.status === 'fatigue' && t.statusFatigue}
                                    {item.status === 'critical' && t.statusCritical}
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <p style={{ color: 'var(--text-secondary)', margin: 0 }}>{t.noHistory}</p>
                    )}
                  </div>
                </div>

                {/* Right block: Personal SVG trend & counters */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                  
                  {/* Detailed metrics box */}
                  <div className="glass-card" style={{ padding: '24px' }}>
                    <h3 style={{ fontSize: '18px', marginBottom: '20px' }}>Метрики бійця</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--card-border)', paddingBottom: '8px' }}>
                        <span style={{ color: 'var(--text-secondary)' }}>{t.totalTests}:</span>
                        <strong>{statsDetails.total}</strong>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--card-border)', paddingBottom: '8px' }}>
                        <span style={{ color: 'var(--text-secondary)' }}>{t.avgReaction}:</span>
                        <strong style={{ color: 'var(--accent-color)' }}>{statsDetails.avg} ms</strong>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--card-border)', paddingBottom: '8px' }}>
                        <span style={{ color: 'var(--text-secondary)' }}>{t.totalErrors}:</span>
                        <strong style={{ color: 'var(--status-fatigue)' }}>{statsDetails.errors}</strong>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--card-border)', paddingBottom: '8px' }}>
                        <span style={{ color: 'var(--text-secondary)' }}>Критичні випадки:</span>
                        <strong style={{ color: 'var(--status-critical)' }}>{statsDetails.critical}</strong>
                      </div>
                    </div>
                  </div>

                  {/* Personal SVG Chart */}
                  {statsDetails.total > 1 && (
                    <div className="glass-card" style={{ padding: '24px' }}>
                      <h3 style={{ fontSize: '18px', marginBottom: '16px' }}>{t.personalTrend}</h3>
                      <div style={{ position: 'relative', height: '140px', width: '100%' }}>
                        <svg viewBox="0 0 100 30" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
                          <line x1="0" y1="5" x2="100" y2="5" stroke="rgba(255,255,255,0.05)" strokeWidth="0.2" />
                          <line x1="0" y1="15" x2="100" y2="15" stroke="rgba(255,255,255,0.05)" strokeWidth="0.2" />
                          <line x1="0" y1="25" x2="100" y2="25" stroke="rgba(255,255,255,0.05)" strokeWidth="0.2" />
                          
                          <polyline points={polylinePoints} fill="none" stroke="var(--accent-color)" strokeWidth="1" />
                          
                          {dotCoordinates.map((dot, idx) => (
                            <g key={idx}>
                              <circle cx={dot.x} cy={dot.y} r="1" fill="#fff" stroke="var(--accent-color)" strokeWidth="0.5" />
                              <text x={dot.x} y={dot.y - 2} fill="var(--text-secondary)" fontSize="2" textAnchor="middle">
                                {dot.value}ms
                              </text>
                            </g>
                          ))}
                        </svg>
                      </div>
                    </div>
                  )}

                </div>

              </div>
            </div>
          );
        })()}

        {/* Admin Tab */}
        {activeTab === 'admin' && currentUser?.role === 'admin' && (
          <div style={{ padding: '32px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
              <h2 style={{ fontSize: '32px', margin: 0 }}>{t.userManagement}</h2>
              <button id="admin-add-user-btn" className="btn-primary" onClick={openCreateModal}>+ {t.addUser}</button>
            </div>

            {/* User Search & Sort Bar */}
            <div className="glass-card" style={{ padding: '16px', display: 'flex', gap: '16px', marginBottom: '24px', alignItems: 'center', flexWrap: 'wrap' }}>
              <input 
                id="admin-search-input"
                className="form-input" 
                style={{ flex: 1, minWidth: '200px' }} 
                type="text" 
                placeholder={t.searchPlaceholder} 
                value={searchTerm} 
                onChange={(e) => setSearchTerm(e.target.value)} 
              />
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <span style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>{t.sortingLabel}:</span>
                <select 
                  id="admin-sort-select"
                  className="form-input" 
                  style={{ width: 'auto' }} 
                  value={sortingType} 
                  onChange={(e) => setSortingType(e.target.value)}
                >
                  <option value="name">{t.sortName}</option>
                  <option value="role">{t.sortRole}</option>
                </select>
              </div>
            </div>

            {/* Users table */}
            <div className="glass-card" style={{ padding: '24px', marginBottom: '40px' }}>
              <div className="admin-table-container">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>{t.soldierName}</th>
                      <th>{t.loginLabel}</th>
                      <th>{t.rank}</th>
                      <th>{t.role}</th>
                      <th>{t.unit}</th>
                      <th>{t.actions}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {getSortedUsers().map(u => (
                      <tr key={u._id}>
                        <td style={{ fontWeight: '600' }}>{u.full_name}</td>
                        <td>{u.login}</td>
                        <td>{u.rank || '—'}</td>
                        <td style={{ textTransform: 'uppercase', fontSize: '12px', fontWeight: 'bold' }}>{u.role}</td>
                        <td>{getUnitName(u.unit_id)}</td>
                        <td>
                          <div style={{ display: 'flex', gap: '8px' }}>
                            <button className="btn-secondary" style={{ padding: '6px 12px', fontSize: '12px' }} onClick={() => openEditModal(u)}>{t.editUser}</button>
                            {u._id !== currentUser._id && (
                              <button className="btn-danger" style={{ padding: '6px 12px', fontSize: '12px', boxShadow: 'none' }} onClick={() => handleDeleteUser(u._id)}>{t.deleteUser}</button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Unit Management (CRUD) */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
              <h2 style={{ fontSize: '32px', margin: 0 }}>{t.unitManagement}</h2>
              <button id="admin-add-unit-btn" className="btn-primary" onClick={openCreateUnitModal}>+ {t.addUnit}</button>
            </div>

            <div className="glass-card" style={{ padding: '24px', marginBottom: '40px' }}>
              <div className="admin-table-container">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>{t.unitName}</th>
                      <th>{t.unitLocation}</th>
                      <th>Кількість бійців</th>
                      <th>{t.actions}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {units.map(unit => {
                      const membersCount = users.filter(user => user.unit_id === unit._id).length;
                      return (
                        <tr key={unit._id}>
                          <td style={{ fontWeight: '600' }}>{unit.name}</td>
                          <td>{unit.location || '—'}</td>
                          <td>{membersCount}</td>
                          <td>
                            <div style={{ display: 'flex', gap: '8px' }}>
                              <button className="btn-secondary" style={{ padding: '6px 12px', fontSize: '12px' }} onClick={() => openEditUnitModal(unit)}>{t.editUser}</button>
                              <button className="btn-danger" style={{ padding: '6px 12px', fontSize: '12px', boxShadow: 'none' }} onClick={() => handleDeleteUnit(unit._id)}>{t.deleteUser}</button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Backups / Exports / Imports */}
            <h2 style={{ fontSize: '24px', marginBottom: '16px', textAlign: 'left' }}>{t.sysAdmin}</h2>
            <div className="glass-card" style={{ padding: '24px', display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
              <button id="admin-backup-btn" className="btn-primary" onClick={triggerBackup}>{t.createBackup}</button>
              <button id="admin-export-btn" className="btn-secondary" onClick={triggerExport}>{t.exportDb}</button>
              
              <div style={{ display: 'inline-flex', flexDirection: 'column', gap: '8px' }}>
                <span style={{ fontSize: '13px', color: 'var(--text-secondary)', textAlign: 'left' }}>{t.importDb}:</span>
                <input 
                  id="admin-import-file"
                  type="file" 
                  accept=".json" 
                  onChange={handleImportFile} 
                  style={{ fontSize: '13px', color: 'var(--text-secondary)' }}
                />
              </div>
            </div>

          </div>
        )}

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div style={{ padding: '32px', display: 'flex', justifyContent: 'center' }}>
            <div className="glass-card" style={{ width: '600px', padding: '40px', textAlign: 'left' }}>
              <h2 style={{ fontSize: '32px', textAlign: 'center', marginBottom: '24px' }}>{t.profile}</h2>
              
              <div style={{ display: 'grid', gridTemplateColumns: '150px 1fr', gap: '16px 8px', marginBottom: '32px', borderBottom: '1px solid var(--card-border)', paddingBottom: '24px' }}>
                <span style={{ color: 'var(--text-secondary)' }}>{t.soldierName}:</span>
                <strong style={{ fontSize: '18px' }}>{currentUser.full_name}</strong>

                <span style={{ color: 'var(--text-secondary)' }}>{t.loginLabel}:</span>
                <span>{currentUser.login}</span>

                <span style={{ color: 'var(--text-secondary)' }}>{t.rank}:</span>
                <span>{currentUser.rank || '—'}</span>

                <span style={{ color: 'var(--text-secondary)' }}>{t.role}:</span>
                <span style={{ textTransform: 'uppercase', fontWeight: 'bold', color: 'var(--accent-color)' }}>{currentUser.role}</span>

                {currentUser.unit_id && (
                  <>
                    <span style={{ color: 'var(--text-secondary)' }}>{t.unit}:</span>
                    <span>{getUnitName(currentUser.unit_id)}</span>
                  </>
                )}
              </div>

              <h3 style={{ fontSize: '20px', marginBottom: '16px' }}>{t.settings}</h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>{t.langLabel}:</span>
                  <select 
                    id="pref-lang-select"
                    className="form-input" 
                    style={{ width: '180px' }} 
                    value={language} 
                    onChange={(e) => setLanguage(e.target.value)}
                  >
                    <option value="ua">Українська</option>
                    <option value="en">English</option>
                  </select>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>{t.dirLabel}:</span>
                  <select 
                    id="pref-dir-select"
                    className="form-input" 
                    style={{ width: '180px' }} 
                    value={rtl ? 'rtl' : 'ltr'} 
                    onChange={(e) => setRtl(e.target.value === 'rtl')}
                  >
                    <option value="ltr">{t.ltr}</option>
                    <option value="rtl">{t.rtl}</option>
                  </select>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>{t.dateFormatLabel}:</span>
                  <select 
                    id="pref-date-select"
                    className="form-input" 
                    style={{ width: '180px' }} 
                    value={dateFormat} 
                    onChange={(e) => setDateFormat(e.target.value)}
                  >
                    <option value="ua">{t.uaFormat}</option>
                    <option value="us">{t.usFormat}</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        )}

      </main>

      {/* Edit User Modal Dialog Overlay */}
      {showUserModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
          <div className="glass-card" style={{ width: '450px', padding: '32px', textAlign: 'left' }}>
            <h3 style={{ fontSize: '22px', marginBottom: '20px' }}>
              {modalMode === 'create' ? t.addUser : `${t.editUser} ${modalForm.full_name}`}
            </h3>
            <form onSubmit={handleSaveUser}>
              
              <div style={{ marginBottom: '12px' }}>
                <label style={{ display: 'block', fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '4px' }}>{t.fullName}</label>
                <input 
                  id="modal-user-fullname"
                  className="form-input" 
                  type="text" 
                  value={modalForm.full_name} 
                  onChange={(e) => setModalForm({...modalForm, full_name: e.target.value})} 
                  required 
                />
              </div>

              <div style={{ marginBottom: '12px' }}>
                <label style={{ display: 'block', fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '4px' }}>{t.loginLabel}</label>
                <input 
                  id="modal-user-login"
                  className="form-input" 
                  type="text" 
                  value={modalForm.login} 
                  onChange={(e) => setModalForm({...modalForm, login: e.target.value})} 
                  required 
                  disabled={modalMode === 'edit'} 
                />
              </div>

              <div style={{ marginBottom: '12px' }}>
                <label style={{ display: 'block', fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '4px' }}>{t.password}</label>
                <input 
                  id="modal-user-password"
                  className="form-input" 
                  type="password" 
                  value={modalForm.password} 
                  onChange={(e) => setModalForm({...modalForm, password: e.target.value})} 
                  required={modalMode === 'create'} 
                />
              </div>

              <div style={{ marginBottom: '12px' }}>
                <label style={{ display: 'block', fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '4px' }}>{t.rank}</label>
                <input 
                  id="modal-user-rank"
                  className="form-input" 
                  type="text" 
                  value={modalForm.rank} 
                  onChange={(e) => setModalForm({...modalForm, rank: e.target.value})} 
                />
              </div>

              <div style={{ marginBottom: '12px' }}>
                <label style={{ display: 'block', fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '4px' }}>{t.role}</label>
                <select 
                  id="modal-user-role"
                  className="form-input" 
                  value={modalForm.role} 
                  onChange={(e) => setModalForm({...modalForm, role: e.target.value})}
                >
                  <option value="soldier">{t.soldierRole}</option>
                  <option value="commander">{t.commanderRole}</option>
                  <option value="medic">{t.medicRole}</option>
                  <option value="admin">{t.adminRole}</option>
                </select>
              </div>

              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '4px' }}>{t.unit}</label>
                <select 
                  id="modal-user-unit"
                  className="form-input" 
                  value={modalForm.unit_id} 
                  onChange={(e) => setModalForm({...modalForm, unit_id: e.target.value})}
                >
                  <option value="">{t.noUnit}</option>
                  {units.map(unit => (
                    <option key={unit._id} value={unit._id}>{unit.name}</option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                <button id="modal-cancel-btn" className="btn-secondary" type="button" onClick={() => setShowUserModal(false)}>{t.cancelBtn}</button>
                <button id="modal-save-btn" className="btn-primary" type="submit">{t.saveBtn}</button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* Edit Unit Modal Dialog Overlay */}
      {showUnitModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
          <div className="glass-card" style={{ width: '400px', padding: '32px', textAlign: 'left' }}>
            <h3 style={{ fontSize: '22px', marginBottom: '20px' }}>
              {modalUnitMode === 'create' ? t.addUnit : t.editUnit}
            </h3>
            <form onSubmit={handleSaveUnit}>
              
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '6px' }}>{t.unitName}</label>
                <input 
                  id="modal-unit-name"
                  className="form-input" 
                  type="text" 
                  value={modalUnitForm.name} 
                  onChange={(e) => setModalUnitForm({...modalUnitForm, name: e.target.value})} 
                  required 
                />
              </div>

              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '6px' }}>{t.unitLocation}</label>
                <input 
                  id="modal-unit-location"
                  className="form-input" 
                  type="text" 
                  value={modalUnitForm.location} 
                  onChange={(e) => setModalUnitForm({...modalUnitForm, location: e.target.value})} 
                />
              </div>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                <button id="modal-unit-cancel-btn" className="btn-secondary" type="button" onClick={() => setShowUnitModal(false)}>{t.cancelBtn}</button>
                <button id="modal-unit-save-btn" className="btn-primary" type="submit">{t.saveBtn}</button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
