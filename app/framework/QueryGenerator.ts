import models from '@/app/sequelize/models';
import {Sequelize, FindOptions, Includeable, FindAttributeOptions, ProjectionAlias} from "sequelize";


type ExtendedFindOptions = FindOptions & {
  attributes: ProjectionAlias[];
  include?: Association[];
}

type Association = FindOptions & {
  model: any,
  attributes: ProjectionAlias[],
  include?: Association[]
}

type IntermediateAssociation = {
  [key: string]: (string | IntermediateAssociation)[]
}

type Query = {
  model: string,
  config: ExtendedFindOptions
}

class QueryGenerator {
  public static generateQuery(baseTable: string, selectedColumns: string[], selectedRules?: any[]): Query {
    selectedColumns = selectedColumns.sort()
    const associations: IntermediateAssociation = {}

    const query: Query = {
      model: baseTable,
      config: {
        attributes: []
      }
    }

    /**
     * This function converts string column names from frontend to an intermediate object representation
     * @param column
     * @param targetAssociation
     */
    const generateAssociations = (column: string, targetAssociation?: IntermediateAssociation) => {
      const [table, col, ...rest] = column.split('.')
      if (!targetAssociation) {
        targetAssociation = associations
      }
      if (!targetAssociation[table]) {
        targetAssociation[table] = []
      }
      if (rest.length > 0) {
        console.log(rest)
        let nestedAssociation: IntermediateAssociation = targetAssociation[table].find((association) => typeof association === 'object') as IntermediateAssociation
        if(!nestedAssociation) {
          nestedAssociation = {}
          targetAssociation[table].push(nestedAssociation)
        }
        generateAssociations([col, ...rest].join('.'), nestedAssociation)
      } else targetAssociation[table].push(col)
    }

    for (const column of selectedColumns) {
      if (column.includes('.')) {
        generateAssociations(column)
      } else {
        query.config.attributes.push([Sequelize.col(`${baseTable}.${column}`), column])
      }
    }
    console.log('generating query', baseTable, selectedColumns, query, selectedRules)

    const convertAssociationsToIncludes = (associations: IntermediateAssociation, targetInclude?:Association[]) => {
      if (!targetInclude) {
        targetInclude = query.config.include as Association[]
      }
      for (const table in associations) {
        const association: Association = {
          model: models[table as keyof typeof models],
          attributes: []
        }
        for (const columnOrAssociation of associations[table]) {
          if (typeof columnOrAssociation === 'object') {
            association.include = []
            convertAssociationsToIncludes(columnOrAssociation, association.include)
          } else {
            association.attributes.push([Sequelize.col(`${columnOrAssociation}`), columnOrAssociation])
          }
        }
        targetInclude.push(association)
      }
    }


    if (Object.keys(associations).length > 0) {
      if (!Array.isArray(query.config.include)) query.config.include = []
      convertAssociationsToIncludes(associations)
    }

    return query;
  }
}

export default QueryGenerator;