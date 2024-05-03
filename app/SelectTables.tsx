'use client'

import MultiSelect from "@/app/select";
import React, {useState} from 'react';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';

// get data about [tableNames], show [all columns accessible from that table after all joins]
// the problem is how to present to the user option to add rules to the report, for eg. sum of sales grouped by salesperson
// we can use a form with a select for the table name, and a select for the column name
// then we can add a button to add a new rule, and a button to submit the report

function SelectTables({tablesAndColumns}: { tablesAndColumns: any }) {
  const [selectedTable, setSelectedTable] = useState('');
  const [selectedColumns, setSelectedColumns] = useState<string[]>([]);

  const handleTableChange = (event: any) => {
    setSelectedTable(event.target.value);
  };

  const updateSelectedColumns = (content: string[]) => {
    console.log(content)
    setSelectedColumns(content)
  }

  // TODO: make this submittable, so that we can use the selected columns to generate a report

  return (
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
    </div>
  );
}

export default SelectTables;