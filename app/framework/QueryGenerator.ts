import models from '@/app/sequelize/models';
import {Sequelize, FindOptions, Includeable} from "sequelize";

type query = {
  model: string,
  config: FindOptions
}

class QueryGenerator {
  public static generateQuery(baseTable: string, selectedColumns: string[], selectedRules?: any[]): query {
    const baseTableColumns = []
    const associations:{[key: string]: string[]} = {}
    for (const column of selectedColumns) {
      if(column.includes('.')) {
        const [table, col] = column.split('.')
        if(!associations[table]) {
          associations[table] = []
        }
        if(col !== 'id') associations[table].push(col)
      } else {
        baseTableColumns.push(column)
      }
    }
    console.log('generating query', baseTable, selectedColumns, associations, selectedRules)
    const query: query = {
      model: baseTable,
      config: {
        attributes: baseTableColumns.map(column => [Sequelize.col(`${baseTable}.${column}`), column]),
      }
    }

    if (associations && Object.keys(associations).length > 0) {
      query.config.include = []
      for (const table in associations) {
        const association: Includeable = {
          model: models[table as keyof typeof models],
        }
        if(associations[table].length > 0) {
          association.attributes = associations[table].map(column => [Sequelize.col(`${column}`), column])
        }
        query.config.include.push(association)
      }
    }

    return query;
  }
}

export default QueryGenerator;