import {Sequelize} from "sequelize";
import models from '@/app/sequelize/models';

class QueryDecoder {
  static decodeQuery(encodedQuery: string): any {
    const query = JSON.parse(encodedQuery, (key, value) => {
      if (typeof value === 'string') {
        if(value in models){
          return models[value as keyof typeof models];
        }
      }
      if (typeof value === 'object' && value !== null) {
        const sequelizeFunctionMatch = Object.keys(value).find(key => key.startsWith('Sequelize.'));
        if (sequelizeFunctionMatch) {
          const sequelizeFunctionName = sequelizeFunctionMatch.split('.')[1];
          if (sequelizeFunctionName in Sequelize) {
            // @ts-ignore
            return Sequelize[sequelizeFunctionName](...this.decodeQuery(value[sequelizeFunctionMatch]));
          }
        }
      }
      return value;
    });

    return query;
  }
}

export default QueryDecoder;