
import React from 'react';
import styled from 'styled-components';

const Entry = styled.div`
  background-color: white;
  margin: 5px;
  padding: 5px;
  border-style: solid;
  border-width: 1px;
  border-color: lightgrey;
  border-radius: 5px;
`;

const Time = styled.div`
  font-size: 8pt;
`

const ColumnContainer = styled.div`
  grid-row: 1;
  margin: 5px;
  padding: 5px;
  border-style: solid;
  border-width: 1px;
  border-color: lightgrey;
  border-radius: 5px;
  display: flex;
  flex-direction: column;
`

const EntryContainer = styled.div`
  flex-grow: 1;
`;

export { Entry, Time, ColumnContainer, EntryContainer };

