import { getTablesAndColumns } from './sequelize/models';
import SelectTables from "@/app/SelectTables";

// get data about [tableNames], show [all columns accessible from that table after all joins]
// the problem is how to present to the user option to add rules to the report, for eg. sum of sales grouped by salesperson
// we can use a form with a select for the table name, and a select for the column name
// then we can add a button to add a new rule, and a button to submit the report

function Dashboard() {
  const tablesAndColumns = getTablesAndColumns();

  return (
    <>
      <SelectTables tablesAndColumns={tablesAndColumns} />
    </>
  );
}

export default Dashboard;