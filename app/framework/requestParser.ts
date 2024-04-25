type stringKeyedObject = {
  [key: string]: string
}

type singleTableColumnMapType = {
  [innerKey: string]: string | stringKeyedObject | undefined;
  foreignKeys?: stringKeyedObject;
};

type ColumnMapType = {
  [key: string]: singleTableColumnMapType
}

const columnsMap: ColumnMapType = {
  b: {
    n: 'name',
    bm: 'bonus_multiplier'
  },
  c: {
    m: 'model',
    y: 'year',
    p: 'price',
    bm: 'bonus_multiplier',
    foreignKeys: {
      b: 'brand_id'
    }
  },
  p: {
    n: 'name',
    bs: 'base_salary'
  },
  s: {
    n: 'name',
    a: 'address',
    c: 'city',
    s: 'state',
    z: 'zip'
  },
  sp: {
    n: 'name',
    foreignKeys: {
      p: 'position_id',
      s: 'store_id'
    }
  },
  sl: {
    sd: 'sale_date',
    foreignKeys: {
      sp: 'salesperson_id',
      c: 'car_id'
    }
  }
}
const tablesMap: stringKeyedObject = {
  'b': 'brands',
  'c': 'cars',
  'p': 'positions',
  's': 'stores',
  'sp': 'salespeople',
  'sl': 'sales'
}
// basically trzeba tutaj dodać obsługę subquery, które będzie używać json_agg i json_build_object
// oraz wartości z parent query do joinów (w tym przypadku where)
// bo to będzie relacja one to many, a nie many to one
// mam już na to test, tylko trzeba się upewnić że entery nic nie psują


class Query {
  command: string
  parent: Query | null
  tables: string[] = []
  conditions: string = ''

  constructor(command: string, parent: Query | null = null) {
    this.command = command
    this.parent = parent
    if (!parent && !command) {
      this.command = 'SELECT'
    } else if (parent && !command) {
      this.command = '(SELECT json_agg(json_build_object('
    }
  }

  addSourcesClause = () => {
    this.command = this.command.slice(0, -1)
    if (this.parent) {
      this.command += ' ))'
    }
    this.command += ' FROM ' + tablesMap[this.tables[0]]
    type baseTableType = {
      tableKey: string,
      foreignKeys: stringKeyedObject
    } | null
    const findParentTableWithForeignKey = (tableList: string[], currentTableKey: string, searchStartIndex: number): baseTableType => {
      if (searchStartIndex === 0) searchStartIndex = tableList.length
      const currentTableData = columnsMap[currentTableKey]
      for (let index = searchStartIndex - 1; index >= 0; index--) {
        const tableKey = tableList[index]
        const tableData = columnsMap[tableKey]
        if ('foreignKeys' in tableData && tableData.foreignKeys && tableData.foreignKeys[currentTableKey]) {
          return {tableKey: tableKey, foreignKeys: tableData.foreignKeys}
        }
        if('foreignKeys' in currentTableData && currentTableData.foreignKeys && currentTableData.foreignKeys[tableKey]){
          return {tableKey: tableKey, foreignKeys: currentTableData.foreignKeys}
        }
      }
      return null
    }
    const tables = this.parent ? this.tables : this.tables.slice(1)

    tables.forEach((table, index) => {
      const baseTable = findParentTableWithForeignKey(this.tables, table, index + 1)
      if (baseTable) {
        const {tableKey, foreignKeys} = baseTable
        this.command += ` JOIN ${tablesMap[table]} ON ${tablesMap[tableKey]}.${foreignKeys[table]} = ${tablesMap[table]}.id`
      } else if (this.parent) {
        const baseTable = findParentTableWithForeignKey(this.parent.tables, table, 0)
        if (baseTable) {
          const {tableKey, foreignKeys} = baseTable
          this.conditions += ` ${tablesMap[table]}.${foreignKeys[tableKey]} = ${tablesMap[tableKey]}.id `
        }
      }
    })
  }

  closeQuery = () => {
    if (this.parent) {
      this.command += ')'
    } else {
      this.command += ';'
    }
  }

  parseRequest = (req: string, buildingSubquery: boolean) => {
    let tableAbbr = ''
    let columnAbbr = ''
    let value = ''
    let lookingForColumn = false
    let lookingForConditionValue = false
    for (let i = 0; i < req.length; i++) {
      const char = req[i]
      switch (char) {
        case '(':
          this.tables.push(tableAbbr)
          lookingForColumn = true
          columnAbbr = ''
          break
        case ')':
          lookingForColumn = false
          lookingForConditionValue = false
          if (columnAbbr) {
            if(this.parent){
              this.command += ` '${columnsMap[tableAbbr][columnAbbr]}',`
            }
            this.command += ` ${tablesMap[tableAbbr]}.${columnsMap[tableAbbr][columnAbbr]},`
          }
          tableAbbr = ''
          break
        case ',':
          this.command += ` ${tablesMap[tableAbbr]}.${columnsMap[tableAbbr][columnAbbr]},`
          columnAbbr = ''
          lookingForConditionValue = false
          break
        case '>':
        case '<':
        case '=':
          if (this.conditions) {
            this.conditions += 'AND'
          }
          this.conditions += ` ${tablesMap[tableAbbr]}.${columnsMap[tableAbbr][columnAbbr]} ${char}`
          lookingForConditionValue = true
          break
        case '{':
          let closingBracketIndex = i
          let openingBracketIndex = i+1
          let openingBracketCount = 1
          while (openingBracketCount > 0) {
            closingBracketIndex = req.indexOf('}', closingBracketIndex + 1)
            openingBracketIndex = req.indexOf('{', openingBracketIndex + 1)
            if (closingBracketIndex < 0) {
              throw new Error('Missing closing bracket')
            }
            if (openingBracketIndex < 0 || closingBracketIndex < openingBracketIndex) {
              openingBracketCount--
            } else {
              openingBracketCount++
            }
          }
          const subquery = new Query('', this)
          this.command += ' '
          this.command += subquery.parseRequest(req.slice(i + 1, closingBracketIndex), true)
          this.command += ','
          i = closingBracketIndex
          break
        case '$':
          if(!lookingForConditionValue){
            this.command = this.command.slice(0, -1)
            this.command += ' as ' + req.slice(i + 1, req.indexOf('$', i + 1)) + ','
            i = req.indexOf('$', i + 1)
            break
          }
        default:
          if (lookingForConditionValue) {
            value += char
          } else if (lookingForColumn) {
            columnAbbr += char
          } else {
            tableAbbr += char
          }
      }
      if (value && !lookingForConditionValue) {
        this.conditions += ` ${value}`
        value = ''
      }
    }
    this.addSourcesClause()
    if (this.conditions) {
      this.command += ` WHERE${this.conditions}`
    }
    this.closeQuery()
    return this.command
  }
}

const parseRequest = (req: string) => {
  const query = new Query('')
  return query.parseRequest(req, false)
}

export default parseRequest