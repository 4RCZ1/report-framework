import {expect, test, vi} from 'vitest'
import {cleanup, getByRole, getByText, render, screen} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import SelectTables from "@/app/SelectTables"

class Helpers {
  static async selectFromMultiSelect(label: string, values: string[]) {
    const select = screen.getByLabelText(label)
    const selectButton = getByRole(select, 'combobox', {hidden: true})
    await userEvent.click(selectButton)
    const listbox = screen.getByRole('listbox')
    for (const value of values) {
      await userEvent.click(getByText(listbox, value))
    }
    await userEvent.click(screen.getByRole('presentation'))
  }
}


const tablesAndColumns = {
  "Brand": {
    "columns": [
      "id",
      "name",
      "bonus_multiplier",
      "createdAt",
      "updatedAt",
      "Car.id"
    ],
    "humanReadableColumns": [
      "Id",
      "Name",
      "Bonus Multiplier",
      "Created At",
      "Updated At",
      "Data about Car"
    ],
    "associations": {
      "Car": {
        "columns": [
          "id",
          "brand_id",
          "model",
          "year",
          "price",
          "bonus_multiplier",
          "createdAt",
          "updatedAt"
        ],
        "type": "HasMany"
      }
    }
  },
  "Car": {
    "columns": [
      "id",
      "brand_id",
      "model",
      "year",
      "price",
      "bonus_multiplier",
      "createdAt",
      "updatedAt",
      "Brand.id",
      "Brand.name",
      "Brand.bonus_multiplier",
      "Brand.createdAt",
      "Brand.updatedAt",
      "Sale.id"
    ],
    "humanReadableColumns": [
      "Id",
      "Brand Id",
      "Model",
      "Year",
      "Price",
      "Bonus Multiplier",
      "Created At",
      "Updated At",
      "Brand id",
      "Brand name",
      "Brand bonus_multiplier",
      "Brand createdAt",
      "Brand updatedAt",
      "Data about Sale"
    ],
    "associations": {
      "Brand": {
        "columns": [
          "id",
          "name",
          "bonus_multiplier",
          "createdAt",
          "updatedAt"
        ],
        "type": "BelongsTo"
      },
      "Sale": {
        "columns": [
          "id",
          "car_id",
          "salesperson_id",
          "sale_date",
          "createdAt",
          "updatedAt"
        ],
        "type": "HasMany"
      }
    }
  },
  "Salesperson": {
    "columns": [
      "id",
      "name",
      "store_id",
      "position_id",
      "createdAt",
      "updatedAt",
      "Store.id",
      "Store.name",
      "Store.address",
      "Store.city",
      "Store.state",
      "Store.zip",
      "Store.createdAt",
      "Store.updatedAt",
      "Position.id",
      "Position.base_salary",
      "Position.name",
      "Position.createdAt",
      "Position.updatedAt",
      "Sale.id"
    ],
    "humanReadableColumns": [
      "Id",
      "Name",
      "Store Id",
      "Position Id",
      "Created At",
      "Updated At",
      "Store id",
      "Store name",
      "Store address",
      "Store city",
      "Store state",
      "Store zip",
      "Store createdAt",
      "Store updatedAt",
      "Position id",
      "Position base_salary",
      "Position name",
      "Position createdAt",
      "Position updatedAt",
      "Data about Sale"
    ],
    "associations": {
      "Store": {
        "columns": [
          "id",
          "name",
          "address",
          "city",
          "state",
          "zip",
          "createdAt",
          "updatedAt"
        ],
        "type": "BelongsTo"
      },
      "Position": {
        "columns": [
          "id",
          "base_salary",
          "name",
          "createdAt",
          "updatedAt"
        ],
        "type": "BelongsTo"
      },
      "Sale": {
        "columns": [
          "id",
          "car_id",
          "salesperson_id",
          "sale_date",
          "createdAt",
          "updatedAt"
        ],
        "type": "HasMany"
      }
    }
  },
  "Store": {
    "columns": [
      "id",
      "name",
      "address",
      "city",
      "state",
      "zip",
      "createdAt",
      "updatedAt",
      "Salesperson.id"
    ],
    "humanReadableColumns": [
      "Id",
      "Name",
      "Address",
      "City",
      "State",
      "Zip",
      "Created At",
      "Updated At",
      "Data about Salesperson"
    ],
    "associations": {
      "Salesperson": {
        "columns": [
          "id",
          "name",
          "store_id",
          "position_id",
          "createdAt",
          "updatedAt"
        ],
        "type": "HasMany"
      }
    }
  },
  "Position": {
    "columns": [
      "id",
      "base_salary",
      "name",
      "createdAt",
      "updatedAt",
      "Salesperson.id"
    ],
    "humanReadableColumns": [
      "Id",
      "Base Salary",
      "Name",
      "Created At",
      "Updated At",
      "Data about Salesperson"
    ],
    "associations": {
      "Salesperson": {
        "columns": [
          "id",
          "name",
          "store_id",
          "position_id",
          "createdAt",
          "updatedAt"
        ],
        "type": "HasMany"
      }
    }
  },
  "Sale": {
    "columns": [
      "id",
      "car_id",
      "salesperson_id",
      "sale_date",
      "createdAt",
      "updatedAt",
      "Car.id",
      "Car.brand_id",
      "Car.model",
      "Car.year",
      "Car.price",
      "Car.bonus_multiplier",
      "Car.createdAt",
      "Car.updatedAt",
      "Salesperson.id",
      "Salesperson.name",
      "Salesperson.store_id",
      "Salesperson.position_id",
      "Salesperson.createdAt",
      "Salesperson.updatedAt"
    ],
    "humanReadableColumns": [
      "Id",
      "Car Id",
      "Salesperson Id",
      "Sale Date",
      "Created At",
      "Updated At",
      "Car id",
      "Car brand_id",
      "Car model",
      "Car year",
      "Car price",
      "Car bonus_multiplier",
      "Car createdAt",
      "Car updatedAt",
      "Salesperson id",
      "Salesperson name",
      "Salesperson store_id",
      "Salesperson position_id",
      "Salesperson createdAt",
      "Salesperson updatedAt"
    ],
    "associations": {
      "Car": {
        "columns": [
          "id",
          "brand_id",
          "model",
          "year",
          "price",
          "bonus_multiplier",
          "createdAt",
          "updatedAt"
        ],
        "type": "BelongsTo"
      },
      "Salesperson": {
        "columns": [
          "id",
          "name",
          "store_id",
          "position_id",
          "createdAt",
          "updatedAt"
        ],
        "type": "BelongsTo"
      }
    }
  }
}


test('Select a table with relation one to many', async () => {
  const mockExecuteQuery = vi.fn((selectedTable: string, selectedColumns: string[], associations?: {
    [key: string]: string[]
  }): Promise<any> => {
    return Promise.resolve({
      result: ['result']
    })
  })

  render(<SelectTables tablesAndColumns={tablesAndColumns} executeQuery={mockExecuteQuery}/>)
  const mainSelect = screen.getByLabelText('main_select')
  const mainSelectButton = getByRole(mainSelect, 'combobox')
  await userEvent.click(mainSelectButton)

  let listbox = screen.getByRole('listbox')

  await userEvent.click(getByText(listbox, 'Brand'))

  await Helpers.selectFromMultiSelect('Brand_select', ['Data about Car', 'Name'])
  await Helpers.selectFromMultiSelect('Car_select', ['Data about Sale', 'Model'])
  await userEvent.click(screen.getByText('Submit'))
  expect(mockExecuteQuery).toHaveBeenCalledWith(
    'Brand',
    ['Car.id', 'name', 'Car.Sale.id', 'Car.model']
  )
})

test('Select tables deeper than one association', async () => {
  const mockExecuteQuery = vi.fn((selectedTable: string, selectedColumns: string[], associations?: {
    [key: string]: string[]
  }): Promise<any> => {
    return Promise.resolve({
      result: ['result']
    })
  })

  cleanup()
  render(<SelectTables tablesAndColumns={tablesAndColumns} executeQuery={mockExecuteQuery}/>)
  const mainSelect = screen.getByLabelText('main_select')
  const mainSelectButton = getByRole(mainSelect, 'combobox')
  await userEvent.click(mainSelectButton)

  let listbox = screen.getByRole('listbox')

  await userEvent.click(getByText(listbox, 'Store'))

  await Helpers.selectFromMultiSelect('Store_select', ['Data about Salesperson', 'Name'])
  console.log('selecting salesperson data')
  await Helpers.selectFromMultiSelect('Salesperson_select', ['Data about Sale', 'Name'])
  console.log('selecting sale data')
  await Helpers.selectFromMultiSelect('Sale_select', ['Sale Date'])
  await userEvent.click(screen.getByText('Submit'))
  expect(mockExecuteQuery).toHaveBeenCalledWith(
    'Store',
    ['Salesperson.id', 'name', 'Salesperson.Sale.id', 'Salesperson.name', 'Salesperson.Sale.sale_date']
  )
})

