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
  executeQuery: (selectedTable: string, selectedColumns: string[], associations?:{[key: string]:string[]}) => Promise<any>
}) {
  const [selectedTable, setSelectedTable] = useState('');
  const [selectedColumns, setSelectedColumns] = useState<string[]>([]);
  const [queryResult, setQueryResult] = useState<any[]>([]);

  const handleTableChange = (event: any) => {
    setSelectedTable(event.target.value);
    setSelectedColumns([]);
  };

  const updateSelectedColumns = (content: string[]) => {
    console.log(content)
    setSelectedColumns(content)
  }

  const submitQuery = async () => {
    try {
      console.log('submitting query', selectedTable, selectedColumns)
      const query = await executeQuery(selectedTable, selectedColumns);
      console.log(query)
      setQueryResult(query)
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <>
      <div>
        <h1>Dashboard</h1>
        <p>Welcome to the dashboard!</p>
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