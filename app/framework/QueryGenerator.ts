import models from '@/app/sequelize/models';
import {Sequelize, ModelAttributeColumnOptions} from "sequelize";

type Attribute = string | [any, string];
type Include = {
  model: string
  attributes: Attribute[]
}

type query = {
  model: string,
  config:{
    attributes: Attribute[],
    include?: Include[],
    group?: string[],
    where?: {
      [key: string]: any
    },
    raw?: boolean
  }
}

type associations = {
  [key: string]: string[]
}

class QueryGenerator {
    public static generateQuery(baseTable:string, selectedColumns:string[], associations:associations,selectedRules?:any[]):query {
      const query:query = {
        model: baseTable,
        config: {
          attributes: selectedColumns.map(column => [Sequelize.col(`${baseTable}.${column}`), column]),
        }
      }

      if(Object.keys(associations).length > 0){
        query.config.include = []
        for(const table in associations){
          query.config.include.push({
            model: table,
            attributes: associations[table].map(column => [Sequelize.col(`${table}.${column}`), column])
          })
        }
      }

      return query;
    }
}

export default QueryGenerator;