const columnsMap = {
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
const tablesMap = {
  'b': 'brands',
  'c': 'cars',
  'p': 'positions',
  's': 'stores',
  'sp': 'salespeople',
  'sl': 'sales'
}

const parseRequest = (req: string) => {
  let command = 'SELECT'
  let tableAbbr = ''
  let columnAbbr = ''
  const tables: string[] = []
  let value = ''
  let lookingForColumn = false
  let lookingForConditionValue = false
  let conditions = ''
  for (const char of req) {
    switch (char) {
      case '(':
        tables.push(tableAbbr)
        lookingForColumn = true
        columnAbbr = ''
        break
      case ')':
        lookingForColumn = false
        lookingForConditionValue = false
        if (columnAbbr) {
          // @ts-ignore
          command += ` ${tablesMap[tableAbbr]}.${columnsMap[tableAbbr][columnAbbr]},`
        }
        tableAbbr = ''
        break
      case ',':
        // @ts-ignore
        command += ` ${tablesMap[tableAbbr]}.${columnsMap[tableAbbr][columnAbbr]},`
        columnAbbr = ''
        lookingForConditionValue = false
        break
      case '>':
      case '<':
      case '=':
        if (conditions) {
          conditions += 'AND'
        }
        // @ts-ignore
        conditions += ` ${tablesMap[tableAbbr]}.${columnsMap[tableAbbr][columnAbbr]} ${char}`
        lookingForConditionValue = true
        break
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
      conditions += ` ${value}`
      value = ''
    }
  }
  // @ts-ignore
  command = command.slice(0, -1) + ' FROM ' + tablesMap[tables[0]]
  const findBaseTable = (tables: string[], currentTable: string, startIndex: number) => {
    for (let i = startIndex - 1; i >= 0; i--) {
      // @ts-ignore
      if (columnsMap[tables[i]].foreignKeys && columnsMap[tables[i]].foreignKeys[currentTable]) {
        return tables[i]
      }
    }
    return null
  }

  tables.slice(1).forEach((table, index) => {
    const baseTable = findBaseTable(tables, table, index + 1)
    if (baseTable) {
      // @ts-ignore
      command += ` JOIN ${tablesMap[table]} ON ${tablesMap[baseTable]}.${columnsMap[baseTable].foreignKeys[table]} = ${tablesMap[table]}.id`
    }
  })
  if (conditions) {
    command += ` WHERE${conditions}`
  }
  return {command}
}

export default parseRequest