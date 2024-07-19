'use client'

import MultiSelect from "@/app/MultiSelect";
import React, {useState} from 'react';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import AssociatedTables from "@/app/AssociatedTables";

// get data about [tableNames], show [all columns accessible from that table after all joins]
// the problem is how to present to the user option to add rules to the report, for eg. sum of sales grouped by salesperson
// we can use a form with a select for the table name, and a select for the column name
// then we can add a button to add a new rule, and a button to submit the report

export type TableObjectType = {
  [key: string]: {
    columns: string[],
    associatedTables?: TableObjectType
  }
}

function SelectTables({tablesAndColumns, executeQuery}: {
  tablesAndColumns: any,
  executeQuery: (selectedTable: string, selectedColumns: string[], associations?: {
    [key: string]: string[]
  }) => Promise<any>
}) {
  const [selectedTable, setSelectedTable] = useState('');
  const [associatedTables, setAssociatedTables] = useState<TableObjectType>({});
  const [selectedColumns, setSelectedColumns] = useState<string[]>([]);
  const [queryResult, setQueryResult] = useState<any[]>([]);

  const handleTableChange = (event: any) => {
    setSelectedTable(event.target.value);
    setSelectedColumns([]);
    setAssociatedTables({});
  };

  const updateSelectedColumns = (content: string[]) => {
    console.log(content)
    setSelectedColumns(content)
    const associatedTablesObject: TableObjectType = {}
    content.filter((column) => column.includes('id')).map((column) => column.split('.')[0]).forEach(tab => {
      associatedTablesObject[tab] = {
        columns: []
      }
    })
    setAssociatedTables(associatedTablesObject)
  }

  const submitQuery = async () => {
    try {
      const allSelectedColumns = [
        ...selectedColumns
      ]
      const processAssociatedTables = (tables: TableObjectType, parentPath:string = '') => {
        for (const table in tables) {
          const selectedColumns = tables[table].columns
          allSelectedColumns.push(...selectedColumns.map((column) => parentPath + table + '.' + column))
          if (tables[table].associatedTables) {
            processAssociatedTables(tables[table].associatedTables as TableObjectType, parentPath + table + '.');
          }
        }
      }
      processAssociatedTables(associatedTables)
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
        <Select
          value={selectedTable}
          onChange={handleTableChange}
          aria-label="main_select"
          id="main_select"
        >
          {Object.keys(tablesAndColumns).map((tableName) => (
            <MenuItem key={tableName} value={tableName}>{tableName}</MenuItem>
          ))}
        </Select>
        {selectedTable && (
          <div>
            <h2>{selectedTable}</h2>
            <MultiSelect
              fields={tablesAndColumns[selectedTable].humanReadableColumns}
              values={tablesAndColumns[selectedTable].columns}
              checkedValues={selectedColumns}
              setCheckedValues={updateSelectedColumns}
              label={selectedTable + "_select"}
            />
          </div>
        )}
        {selectedTable && Object.keys(associatedTables).length && <AssociatedTables
          associatedTablesObject={associatedTables}
          originTableObject={associatedTables}
          tablesAndColumns={tablesAndColumns}
          setTableObject={setAssociatedTables}
          tablePath={[]}
        />}
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