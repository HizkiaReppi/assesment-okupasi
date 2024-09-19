import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';

interface Column {
  header: string;
  accessor: string;
  cell?: (value: any, row: any) => React.ReactNode;
}

interface Action {
  icon: IconDefinition;
  onClick: (row: any) => void;
  title: string;
}

interface ReusableTableProps {
  columns: Column[];
  data: any[];
  actions?: Action[];
  onRowClick?: (row: any) => void;
}

const ReusableTable: React.FC<ReusableTableProps> = ({ columns, data, actions, onRowClick }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden">
        <thead className="bg-gray-200 dark:bg-gray-700">
          <tr>
            {columns.map((column, index) => (
              <th key={index} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
                {column.header}
              </th>
            ))}
            {actions && <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">Actions</th>}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
          {data.map((row, rowIndex) => (
            <tr 
              key={rowIndex} 
              className={`${rowIndex % 2 === 0 ? 'bg-white dark:bg-gray-800' : 'bg-gray-50 dark:bg-gray-900'} ${onRowClick ? 'cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700' : ''}`}
              onClick={() => onRowClick && onRowClick(row)}
            >
              {columns.map((column, colIndex) => (
                <td key={colIndex} className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                  {column.cell ? column.cell(row[column.accessor], row) : row[column.accessor]}
                </td>
              ))}
              {actions && (
                <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                  {actions.map((action, actionIndex) => (
                    <button
                      key={actionIndex}
                      onClick={(e) => {
                        e.stopPropagation();
                        action.onClick(row);
                      }}
                      className="text-blue-600 hover:text-blue-900 mr-3 dark:text-blue-400 dark:hover:text-blue-300"
                      title={action.title}
                    >
                      <FontAwesomeIcon icon={action.icon} />
                    </button>
                  ))}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ReusableTable;