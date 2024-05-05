import models, { getTablesAndColumns } from './sequelize/models';
import SelectTables from "@/app/SelectTables";
import QueryGenerator from "@/app/framework/QueryGenerator";

// get data about [tableNames], show [all columns accessible from that table after all joins]
// the problem is how to present to the user option to add rules to the report, for eg. sum of sales grouped by salesperson
// we can use a form with a select for the table name, and a select for the column name
// then we can add a button to add a new rule, and a button to submit the report

function Dashboard() {
  const tablesAndColumns = getTablesAndColumns();

  async function executeQuery(selectedTable: string, selectedColumns: string[]) {
    'use server'
    try{
      const query = QueryGenerator.generateQuery(selectedTable, selectedColumns)
      // @ts-ignore
      const results = await models[query.model].findAll(query.config)
      const jsonResults = results.map((result: { toJSON: () => any; }) => result.toJSON());
      return jsonResults
    } catch (error) {
      console.error('Error:', error);
      return []
    }
  }

  return (
    <>
      <SelectTables tablesAndColumns={tablesAndColumns} executeQuery={executeQuery}/>
    </>
  );
}

export default Dashboard;