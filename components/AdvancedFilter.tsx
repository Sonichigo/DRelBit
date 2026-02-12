
import React, { useState } from 'react';
import { Filter, Plus, X, ChevronDown, Calendar, Search } from 'lucide-react';
import { FilterRule, FilterOperator } from '../types';

interface AdvancedFilterProps {
  fields: { label: string; value: string; type: 'string' | 'number' | 'date' | 'select'; options?: string[] }[];
  onApply: (rules: FilterRule[]) => void;
  onClear: () => void;
}

const AdvancedFilter: React.FC<AdvancedFilterProps> = ({ fields, onApply, onClear }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [rules, setRules] = useState<FilterRule[]>([]);

  const addRule = () => {
    const newRule: FilterRule = {
      id: Math.random().toString(36).substr(2, 9),
      field: fields[0].value,
      operator: 'contains',
      value: '',
    };
    setRules([...rules, newRule]);
  };

  const removeRule = (id: string) => {
    setRules(rules.filter(r => r.id !== id));
  };

  const updateRule = (id: string, updates: Partial<FilterRule>) => {
    setRules(rules.map(r => r.id === id ? { ...r, ...updates } : r));
  };

  const handleApply = () => {
    onApply(rules);
    setIsOpen(false);
  };

  const handleClear = () => {
    setRules([]);
    onClear();
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <div className="flex items-center gap-2">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all border ${
            rules.length > 0 
              ? 'bg-blue-600 border-blue-500 text-white' 
              : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
          }`}
        >
          <Filter size={16} />
          <span>Filters {rules.length > 0 && `(${rules.length})`}</span>
          <ChevronDown size={14} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>
        {rules.length > 0 && (
          <button 
            onClick={handleClear}
            className="text-xs text-slate-500 hover:text-slate-300 font-medium"
          >
            Clear All
          </button>
        )}
      </div>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-[480px] bg-[#1e293b] border border-slate-700 rounded-2xl shadow-2xl z-50 p-6 animate-in fade-in slide-in-from-top-2">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-white flex items-center gap-2">
              <Filter size={18} className="text-blue-500" />
              Filter Builder
            </h3>
            <button onClick={() => setIsOpen(false)} className="p-1 hover:bg-slate-800 rounded-lg text-slate-500">
              <X size={18} />
            </button>
          </div>

          <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
            {rules.length === 0 ? (
              <div className="text-center py-8 border-2 border-dashed border-slate-800 rounded-xl">
                <p className="text-sm text-slate-500">No filters applied. Add a rule to start filtering.</p>
              </div>
            ) : (
              rules.map((rule) => {
                const fieldDef = fields.find(f => f.value === rule.field);
                return (
                  <div key={rule.id} className="flex gap-2 items-start bg-slate-900/50 p-3 rounded-xl border border-slate-800">
                    <div className="flex-1 grid grid-cols-12 gap-2">
                      <select
                        className="col-span-4 bg-slate-800 border-none rounded-lg text-xs py-2 px-2 focus:ring-1 focus:ring-blue-500"
                        value={rule.field}
                        onChange={(e) => updateRule(rule.id, { field: e.target.value })}
                      >
                        {fields.map(f => <option key={f.value} value={f.value}>{f.label}</option>)}
                      </select>
                      
                      <select
                        className="col-span-3 bg-slate-800 border-none rounded-lg text-xs py-2 px-2 focus:ring-1 focus:ring-blue-500"
                        value={rule.operator}
                        onChange={(e) => updateRule(rule.id, { operator: e.target.value as FilterOperator })}
                      >
                        <option value="contains">Contains</option>
                        <option value="equals">Equals</option>
                        {fieldDef?.type === 'number' || fieldDef?.type === 'date' ? (
                          <>
                            <option value="greaterThan">Greater Than</option>
                            <option value="lessThan">Less Than</option>
                            <option value="between">Between</option>
                          </>
                        ) : null}
                      </select>

                      <div className="col-span-5 flex flex-col gap-2">
                        {fieldDef?.type === 'select' ? (
                          <select
                            className="w-full bg-slate-800 border-none rounded-lg text-xs py-2 px-2 focus:ring-1 focus:ring-blue-500"
                            value={rule.value}
                            onChange={(e) => updateRule(rule.id, { value: e.target.value })}
                          >
                            <option value="">Select...</option>
                            {fieldDef.options?.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                          </select>
                        ) : (
                          <input
                            type={fieldDef?.type === 'number' ? 'number' : fieldDef?.type === 'date' ? 'date' : 'text'}
                            className="w-full bg-slate-800 border-none rounded-lg text-xs py-2 px-3 focus:ring-1 focus:ring-blue-500 placeholder:text-slate-600"
                            placeholder="Value"
                            value={rule.value}
                            onChange={(e) => updateRule(rule.id, { value: e.target.value })}
                          />
                        )}
                        {rule.operator === 'between' && (
                          <input
                            type={fieldDef?.type === 'number' ? 'number' : fieldDef?.type === 'date' ? 'date' : 'text'}
                            className="w-full bg-slate-800 border-none rounded-lg text-xs py-2 px-3 focus:ring-1 focus:ring-blue-500 placeholder:text-slate-600"
                            placeholder="To Value"
                            value={rule.valueEnd || ''}
                            onChange={(e) => updateRule(rule.id, { valueEnd: e.target.value })}
                          />
                        )}
                      </div>
                    </div>
                    <button onClick={() => removeRule(rule.id)} className="p-1.5 hover:bg-rose-500/10 text-slate-500 hover:text-rose-500 rounded-lg">
                      <X size={14} />
                    </button>
                  </div>
                );
              })
            )}
          </div>

          <div className="mt-6 flex items-center justify-between pt-4 border-t border-slate-800">
            <button 
              onClick={addRule}
              className="flex items-center gap-2 text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors"
            >
              <Plus size={16} />
              Add Rule
            </button>
            <div className="flex gap-3">
              <button 
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-sm font-medium transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleApply}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors shadow-lg shadow-blue-900/20"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdvancedFilter;
