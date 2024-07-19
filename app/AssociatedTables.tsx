import MultiSelect from "@/app/MultiSelect";
import React from "react";
import {TableObjectType} from "@/app/SelectTables";
import AssociatedTablesSelect from "@/app/AssociatedTableSelect";

type AssociatedTablesProps = {
  associatedTablesObject: TableObjectType,
  originTableObject: TableObjectType,
  tablesAndColumns: any,
  setTableObject: (tableObject: TableObjectType) => void,
  tablePath: string[]
}

const AssociatedTables = ({associatedTablesObject, tablesAndColumns, setTableObject, tablePath, originTableObject}: AssociatedTablesProps) => {
  const updateAssociatedColumns = (content: string[], tableName: string) => {
    const newAssociatedTables: TableObjectType = {...originTableObject}
    const localTablePath = [...tablePath, tableName]
    const firstPath = localTablePath.shift()
    if (!firstPath) throw new Error('tablePath is empty')
    let currentTable = newAssociatedTables[firstPath]
    for (let table of localTablePath) {
      if (!currentTable.associatedTables) {
        console.log('not yet decided what to do here, probably should throw an error, but for now just setting it to empty object')
        currentTable.associatedTables = {
          [table]: {
            columns: []
          }
        }
      }
      currentTable = currentTable.associatedTables[table]
    }
    currentTable.columns = content
    const _associatedTablesObject: TableObjectType = {}
    content.filter((column) => column.includes('id')).map((column) => column.split('.')[0]).forEach(tab => {
      _associatedTablesObject[tab] = {
        columns: []
      }
    })
    currentTable.associatedTables = _associatedTablesObject
    setTableObject(newAssociatedTables)
  }

  const tableObjectsMap = Object.entries(associatedTablesObject || {})

  return (
    <div>
      <h2>Associated Tables</h2>
      {tableObjectsMap.length && tableObjectsMap.map(([tableName, {associatedTables, columns}], index) => (
        <React.Fragment key={index}>
          <AssociatedTablesSelect
            tableName={tableName}
            tablesAndColumns={tablesAndColumns}
            updateAssociatedColumns={(content)=>updateAssociatedColumns(content, tableName)}
            selectedColumns={columns}
          />
          {associatedTables && <AssociatedTables
            associatedTablesObject={associatedTables}
            tablesAndColumns={tablesAndColumns}
            setTableObject={setTableObject}
            tablePath={[...tablePath, tableName]}
            originTableObject={originTableObject}
          />}
        </React.Fragment>
      ))}
    </div>
  )
}

export default AssociatedTables