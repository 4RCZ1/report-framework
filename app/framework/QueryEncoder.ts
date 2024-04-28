import {Sequelize} from "sequelize";
import _ from 'lodash';

class QueryEncoder {
  static getClassName(obj: any): string | false {
    const isCtorClass = obj.constructor && obj.constructor.toString().substring(0, 5) === 'class';
    if (obj.prototype === undefined) {
      return isCtorClass && obj.constructor.name;
    }
    const isPrototypeCtorClass = obj.prototype.constructor
      && obj.prototype.constructor.toString
      && obj.prototype.constructor.toString().substring(0, 5) === 'class';
    if (!(isCtorClass || isPrototypeCtorClass)) return false
    return obj.prototype.constructor.name;
  }

  static encodeQuery(query: any): string {
    query = _.cloneDeep(query);
    const encodedQuery = JSON.stringify(query, (key, value) => {
      // and not null
      if (typeof value === 'object' && value !== null) {
        const className = QueryEncoder.getClassName(value);
        if(className){
          if(className.toLowerCase() in Sequelize) {
            const sequelizeFunction = `Sequelize.${className.toLowerCase()}`;
            let specialArgs = []
            if(value.args){
              specialArgs = value.args;
              delete value.args;
            }
            const args = this.encodeQuery([...Object.values(value), ...specialArgs]);
            return {[sequelizeFunction]: args};
          }
        }
      } else if (typeof value === 'function') {
        return value.name;
      }
      return value;
    });

    return encodedQuery;
  }
}

export default QueryEncoder;