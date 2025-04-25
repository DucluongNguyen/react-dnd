import { ColumnType } from './types/dnd';
import DnDContainer from './components/DnD/DnDContainer';
import './App.css';
import { Fragment } from 'react/jsx-runtime';
import { useState } from 'react';

const initialColumns: ColumnType[] = [
  {
    id: 'col1',
    title: 'Todo',
    items: [
      {
        id: 'A',
        label: 'A',
        component: <div style={{ width: '100%', padding: 10 }}>Item A</div>,
      },
      {
        id: 'B',
        label: 'B',
        component: <div style={{ width: '100%', padding: 10 }}> Item B </div>,
      },
    ],
  },
  {
    id: 'col2',
    title: 'In Progress',
    items: [],
  },
  {
    id: 'col3',
    title: 'Done',
    items: [],
  },
];

const App = () => {
  // !State
  const [items, setItems] = useState('');
  const [state, setState] = useState<ColumnType[]>(initialColumns);

  const onAddItem = () => {
    setState((prev) => {
      const newState: ColumnType[] = [
        {
          id: 'col1',
          title: 'Todo',
          items: [
            ...prev[0].items,
            {
              id: items,
              label: items,
              component: (
                <div style={{ width: '100%', padding: 10 }}>{items}</div>
              ),
            },
          ],
        },
        {
          id: 'col2',
          title: 'In Progress',
          items: [],
        },
        {
          id: 'col3',
          title: 'Done',
          items: [],
        },
      ];
      return newState;
    });
    setItems('');
  };

  // !Render
  return (
    <Fragment>
      <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
        <label htmlFor=''>Add Todo</label>
        <input
          type='text'
          value={items}
          onChange={(e) => {
            setItems(e.target.value);
          }}
        />
        <button onClick={onAddItem}>Add</button>
      </div>
      <DnDContainer initialColumns={state} />
    </Fragment>
  );
};

export default App;
