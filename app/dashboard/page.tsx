import { getTablesAndColumns } from '../sequelize/models';

// get data about [tableNames], show [all columns accessible from that table after all joins]
// the problem is how to present to the user option to add rules to the report, for eg. sum of sales grouped by salesperson
// we can use a form with a select for the table name, and a select for the column name
// then we can add a button to add a new rule, and a button to submit the report

// @ts-ignore
function Dashboard({ tablesAndColumns }) {
  return (
    <div>
      <h1>Dashboard</h1>
      <p>Welcome to the dashboard!</p>

    </div>
  );
}

export async function getServerSideProps() {
  const tablesAndColumns = getTablesAndColumns();

  return {
    props: {
      tablesAndColumns,
    },
  };
}

export default Dashboard;