/**
 * Search Bar Component
 * Multi-criteria search for elements in the 3D model
 */

import { useState, useRef, useEffect } from 'react';
import { useViewer } from '../contexts/ViewerContext';

interface SearchResult {
  dbId: number;
  name: string;
  type: string;
  category: string;
}

type SearchType = 'name' | 'tag' | 'discipline' | 'wbs' | 'structure';

export function SearchBar() {
  const [query, setQuery] = useState('');
  const [searchType, setSearchType] = useState<SearchType>('name');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const { viewerRef, isolateElement, selectElement } = useViewer();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  // Search function
  const handleSearch = async (searchQuery: string) => {
    setQuery(searchQuery);

    if (searchQuery.length < 2) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    setLoading(true);

    // Search in the viewer model
    const viewer = viewerRef.current;
    if (!viewer) {
      setLoading(false);
      return;
    }

    const model = viewer.model;
    if (!model) {
      setLoading(false);
      return;
    }

    try {
      // Use the viewer's search API
      viewer.search(
        searchQuery,
        (dbIds: number[]) => {
          // Get properties for each result
          const searchResults: SearchResult[] = [];
          let processed = 0;

          if (dbIds.length === 0) {
            setResults([]);
            setIsOpen(true);
            setLoading(false);
            return;
          }

          // Limit to first 20 results
          const limitedIds = dbIds.slice(0, 20);

          limitedIds.forEach((dbId) => {
            viewer.getProperties(dbId, (result) => {
              searchResults.push({
                dbId,
                name: result.name || `Element ${dbId}`,
                type: result.externalId || 'Unknown',
                category: getCategory(result.properties),
              });

              processed++;
              if (processed === limitedIds.length) {
                setResults(searchResults);
                setIsOpen(true);
                setLoading(false);
              }
            });
          });
        },
        (err) => {
          console.error('Search error:', err);
          setLoading(false);
        },
        [searchType === 'name' ? 'name' : searchType]
      );
    } catch (err) {
      console.error('Search failed:', err);
      setLoading(false);
    }
  };

  const getCategory = (properties: any[]): string => {
    const categoryProp = properties.find(
      (p) => p.displayName.toLowerCase().includes('category') || p.displayName.toLowerCase().includes('discipline')
    );
    return categoryProp?.displayValue || 'General';
  };

  const handleSelectResult = (result: SearchResult) => {
    isolateElement(result.dbId);
    setIsOpen(false);
    setQuery(result.name);

    // Load full properties
    viewerRef.current?.getProperties(result.dbId, (propResult) => {
      selectElement({
        dbId: result.dbId,
        name: propResult.name || result.name,
        type: propResult.externalId || result.type,
        properties: propResult.properties.map((p) => ({
          label: p.displayName,
          value: p.displayValue,
          category: p.displayCategory,
        })),
      });
    });
  };

  return (
    <div className="position-relative" ref={containerRef} style={{ minWidth: '300px' }}>
      {/* Search Input */}
      <div className="position-relative">
        <i className="fa-solid fa-magnifying-glass position-absolute top-50 translate-middle-y ms-4 text-gray-500"></i>
        <input
          type="text"
          className="form-control form-control-sm ps-12 pe-24"
          placeholder={`Search by ${searchType}...`}
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          onFocus={() => query.length >= 2 && setIsOpen(true)}
        />

        {/* Search Type Selector */}
        <select
          className="form-select form-select-sm position-absolute end-0 top-0 border-0 bg-transparent"
          style={{ width: '100px' }}
          value={searchType}
          onChange={(e) => setSearchType(e.target.value as SearchType)}
        >
          <option value="name">Name</option>
          <option value="tag">Tag</option>
          <option value="discipline">Discipline</option>
          <option value="wbs">WBS</option>
          <option value="structure">Structure</option>
        </select>

        {/* Loading indicator */}
        {loading && (
          <div className="position-absolute end-0 top-50 translate-middle-y me-24">
            <span className="spinner-border spinner-border-sm text-primary"></span>
          </div>
        )}
      </div>

      {/* Results Dropdown */}
      {isOpen && (
        <div
          className="position-absolute w-100 mt-2 bg-white rounded shadow-lg"
          style={{ maxHeight: '400px', overflowY: 'auto', zIndex: 1000 }}
        >
          {results.length > 0 ? (
            results.map((result) => (
              <div
                key={result.dbId}
                className="p-3 border-bottom cursor-pointer hover-bg-light"
                onClick={() => handleSelectResult(result)}
                style={{ cursor: 'pointer' }}
              >
                <div className="fw-semibold text-gray-900">{result.name}</div>
                <div className="fs-7 text-gray-600">
                  {result.category} • {result.type}
                </div>
              </div>
            ))
          ) : (
            <div className="p-4 text-center text-gray-500">
              {query.length >= 2 ? 'No results found' : 'Type at least 2 characters'}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
