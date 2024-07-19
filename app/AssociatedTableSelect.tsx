import MultiSelect from "@/app/MultiSelect";
import React from "react";

type AssociatedTablesProps = {
  tablesAndColumns: any,
  selectedColumns: string[],
  tableName:string,
  updateAssociatedColumns: (content: string[]) => void
}

const AssociatedTablesSelect = ({tableName, tablesAndColumns, updateAssociatedColumns, selectedColumns}: AssociatedTablesProps) => {
  return (
      <div>
        <h3>{tableName}</h3>
        <MultiSelect
          fields={tablesAndColumns[tableName].humanReadableColumns}
          values={tablesAndColumns[tableName].columns}
          checkedValues={selectedColumns}
          setCheckedValues={(content) => updateAssociatedColumns(content)}
          label={tableName + "_select"}/>
      </div>
  )
}

export default AssociatedTablesSelect