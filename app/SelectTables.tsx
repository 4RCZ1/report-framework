'use client'

import MultiSelect from "@/app/select";
import React, {useState} from 'react';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';

// get data about [tableNames], show [all columns accessible from that table after all joins]
// the problem is how to present to the user option to add rules to the report, for eg. sum of sales grouped by salesperson
// we can use a form with a select for the table name, and a select for the column name
// then we can add a button to add a new rule, and a button to submit the report

function SelectTables({tablesAndColumns, executeQuery}: {
  tablesAndColumns: any,
  executeQuery: (selectedTable: string, selectedColumns: string[], associations?: {
    [key: string]: string[]
  }) => Promise<any>
}) {
  const [selectedTable, setSelectedTable] = useState('');
  const [associatedTables, setAssociatedTables] = useState<string[]>([]);
  const [selectedColumns, setSelectedColumns] = useState<string[]>([]);
  const [queryResult, setQueryResult] = useState<any[]>([]);
  const [associatedTablesSelectedColumns, setAssociatedTablesSelectedColumns] = useState<string[][]>([]);

  const handleTableChange = (event: any) => {
    setSelectedTable(event.target.value);
    setSelectedColumns([]);
    setAssociatedTables([]);
    setAssociatedTablesSelectedColumns([]);
  };

  const updateSelectedColumns = (content: string[]) => {
    console.log(content)
    setSelectedColumns(content)
    const idCols = content.filter((column) => column.includes('id'))
    const associatedTables = idCols.map((column) => column.split('.')[0])
    setAssociatedTables(associatedTables)
  }

  const updateAssociatedColumns = (index: number, content: string[]) => {
    const newAssociatedTablesSelectedColumns = [...associatedTablesSelectedColumns];
    newAssociatedTablesSelectedColumns[index] = content;
    setAssociatedTablesSelectedColumns(newAssociatedTablesSelectedColumns);
  }

  const submitQuery = async () => {
    try {
      const allSelectedColumns = [
        ...selectedColumns,
        ...associatedTablesSelectedColumns.map((columns, index) => columns.map((column) => `${associatedTables[index]}.${column}`)).flat()
      ]
      console.log('submitting query', selectedTable, allSelectedColumns)
      const query = await executeQuery(selectedTable, allSelectedColumns);
      console.log(query)
      setQueryResult(query)
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <>
      <div>
        <Select value={selectedTable} onChange={handleTableChange}>
          {Object.keys(tablesAndColumns).map((tableName) => (
            <MenuItem key={tableName} value={tableName}>{tableName}</MenuItem>
          ))}
        </Select>
        {selectedTable && (
          <div>
            <h2>{selectedTable}</h2>
            <MultiSelect fields={tablesAndColumns[selectedTable].humanReadableColumns}
                         values={tablesAndColumns[selectedTable].columns} checkedValues={selectedColumns}
                         setCheckedValues={updateSelectedColumns}/>
          </div>
        )}
        {associatedTables.length > 0 && (
          <div>
            <h2>Associated Tables</h2>
            {associatedTables.map((tableName, index) => (
              <div key={tableName}>
                <h3>{tableName}</h3>
                <MultiSelect fields={tablesAndColumns[tableName].humanReadableColumns}
                             values={tablesAndColumns[tableName].columns}
                             checkedValues={associatedTablesSelectedColumns[index] || []}
                             setCheckedValues={(content) => updateAssociatedColumns(index, content)}/>
              </div>
            ))}
          </div>
        )}
        <button onClick={submitQuery}>Submit</button>
      </div>
      {queryResult.length > 0 && (
        <div>
          <h2>Query Result</h2>
          <pre>{JSON.stringify(queryResult, null, 2)}</pre>
        </div>
      )}
    </>
  );
}

export default SelectTables;