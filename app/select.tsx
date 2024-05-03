'use client'

import * as React from 'react';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import ListItemText from '@mui/material/ListItemText';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Checkbox from '@mui/material/Checkbox';
import {Box} from "@mui/material";
import Chip from "@mui/material/Chip";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};
type Props = {
  fields: string[];
  values: string[];
  checkedValues: string[];
  setCheckedValues: (value: string[]) => void;
}
export default function MultiSelect({fields, values, checkedValues, setCheckedValues}: Props) {

  const handleChange = (event: SelectChangeEvent<typeof checkedValues>) => {
    const {
      target: { value },
    } = event;
    setCheckedValues(
      // On autofill we get a stringified value.
      typeof value === 'string' ? value.split(',') : value,
    );
  };

  return (
    <div>
      <FormControl sx={{ m: 1, width: 300 }}>
        <InputLabel id="demo-multiple-checkbox-label">Tag</InputLabel>
        <Select
          labelId="demo-multiple-checkbox-label"
          id="demo-multiple-checkbox"
          multiple
          value={checkedValues}
          onChange={handleChange}
          input={<OutlinedInput label="Tag" />}
          renderValue={(selected) => (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {selected.map((value) => (
                <Chip key={fields[values.indexOf(value)]} label={fields[values.indexOf(value)]} />
              ))}
            </Box>
          )}
          MenuProps={MenuProps}
        >
          {fields.map((field, index) => (
            <MenuItem key={field} value={values[index]}>
              <Checkbox checked={checkedValues.indexOf(values[index]) > -1} />
              <ListItemText primary={field} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
}
