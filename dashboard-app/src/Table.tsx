import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './styles/main.scss';
import './styles/fonts.scss';
import backIcon from './imgs/back.png';
import searchIcon from './imgs/search-interface-symbol.png'

interface Test {
  id: number;
  name: string;
  type: string;
  status: 'ONLINE' | 'PAUSED' | 'STOPPED' | 'DRAFT';
  siteId: number;
}

interface Site {
  id: number;
  url: string;
}

const Table: React.FC = () => {
  const [tests, setTests] = useState<Test[]>([]);
  const [filter, setFilter] = useState<string>('');
  const [sites, setSites] = useState<Site[]>([]);
  const [selectedTest, setSelectedTest] = useState<Test | null>(null);
  const [currentView, setCurrentView] = useState<'table' | 'results' | 'finalize'>('table'); 

  useEffect(() => {
    const fetchData = async () => {
      try {
        const testsResponse = await axios.get<Test[]>('http://localhost:3100/tests');
        const sitesResponse = await axios.get<Site[]>('http://localhost:3100/sites');
        setTests(testsResponse.data);
        setSites(sitesResponse.data);
      } catch (error) {
        console.error('Ошибка загрузки данных:', error);
      }
    };
    fetchData();
  }, []);

  const filteredTests = tests.filter((test) =>
    test.name.toLowerCase().includes(filter.toLowerCase())
  );

  const sortByName = () => {
    setTests([...filteredTests].sort((a, b) => a.name.localeCompare(b.name)));
  };

  const sortByStatus = () => {
    const statusOrder = ['ONLINE', 'PAUSED', 'STOPPED', 'DRAFT'];
    setTests([...filteredTests].sort((a, b) => statusOrder.indexOf(a.status) - statusOrder.indexOf(b.status)));
  };

  const formatUrl = (url: string) => url.replace(/^https?:\/\//, '').replace(/^www\./, '');

  const getStatusClass = (status: string) => {
    return status.toLowerCase(); 
  };

  const openResults = (test: Test) => {
    setSelectedTest(test);
    setCurrentView('results');
  };

  const openFinalize = (test: Test) => {
    setSelectedTest(test);
    setCurrentView('finalize');
  };

  const goBackToTable = () => {
    setCurrentView('table');
    setSelectedTest(null);
  };
const getBorderColor = (url: string) => {
  if (url.includes('market.company.com')) {
    return '#E14165' 
  } if (url.includes('delivery.company.com')) {
    return '#C2C2FF'
  } if (url.includes('games.company.com')) {
    return '#8686ff'
  }
};
const handleClearFilter = () => {
  setFilter(''); // Очищаем значение фильтра
};
const capitalize = (str: string) => {
  if (str.length === 0 || str === 'MVT') return str; // Проверка на пустую строку
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};
const getStatusColor = (status: string) => {
  // Приводим строку к нижнему регистру для удобства сравнения
  const lowerCaseStatus = status.toLowerCase();

  if (lowerCaseStatus === 'online') {
    return '#2ecc71'; // Зеленый для ONLINE
  } else if (lowerCaseStatus === 'paused') {
    return '#f39c12'; // Оранжевый для PAUSED
  } else if (lowerCaseStatus === 'draft') {
    return '#95a5a6'; // Серый для DRAFT
  } else if (lowerCaseStatus === 'stopped') {
    return '#e74c3c'; // Красный для STOPPED
  } else {
    return '#7f8c8d'; // Цвет по умолчанию, если статус не найден
  }
};
  return (
    <div className="dashboard-app">
      {}
      {currentView === 'table' && (
        <>
          <h1 className='hm'>Dashboard</h1>
          <div className='inp'><img className='search' src={searchIcon} alt="" /><input 
            type="text"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            placeholder="What test are you looking for?"
          /></div>
        </>
      )}

      {}
      {currentView === 'table' && (
  <div className="table-container">
    {/* Заголовок таблицы */}
    {filteredTests.length > 0 && (
      <div className="table-header">
        <div className='n' onClick={sortByName}>NAME</div>
        <div  className='flex-end'>TYPE</div>
        <div className='flex-end' onClick={sortByStatus}>STATUS</div>
        <div className='flex-end'>SITE</div>
        <div></div>
      </div>
    )}

    <div className="table-body">
      {filteredTests.length > 0 ? (
        filteredTests.map((test) => {
          const site = sites.find((s) => s.id === test.siteId);
          return (
            <div
              className="table-row"
              key={test.id}
              style={{
                borderLeft: `5px solid ${site ? getBorderColor(site.url) : '#95a5a6'}`
              }}
            >
              <div className="n fff">{test.name}</div>
              <div className="type fff">{capitalize(test.type)}</div>
              <div style={{color:getStatusColor(test.status)}} className={`status fff ${getStatusClass(test.status)}`}>{capitalize(test.status)}</div>
              <div className="site fff">{site ? formatUrl(site.url) : 'Not found'}</div>
              <div className="bu fff">
                {test.status === 'DRAFT' ? (
                  <button className="action-btn finalize-btn" onClick={() => openFinalize(test)}>
                    Finalize
                  </button>
                ) : (
                  <button className="action-btn results-btn" onClick={() => openResults(test)}>
                    Results
                  </button>
                )}
              </div>
            </div>
          );
        })
      ) : (
        <div className="no-results">
          Your search did not match any results.
          <button onClick={handleClearFilter} className="action-btn">
            Reset
          </button>
        </div>
      )}
    </div>
  </div>
)}

      {}
      {currentView === 'results' && selectedTest && (
        <div className="results-page">
          <h2 className='fff h2'>Results</h2>
          <p className='fff p'>Order basket redesing</p>
          <button className='btn' onClick={goBackToTable}><img className='back' src={backIcon} alt="back" />Back</button>
        </div>
      )}

      {}
      {currentView === 'finalize' && selectedTest && (
        <div className="finalize-page">
          <h2 className='fff h2'>Finalize</h2>
          <p className='fff p'>Spring promotion</p>
          <button className='btn' onClick={goBackToTable}><img className='back' src={backIcon} alt="back" />Back</button>
        </div>
      )}
    </div>
  );
};

export default Table;