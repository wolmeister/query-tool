import { useState } from 'react';
import { Table, Button, Input, Typography, Alert } from 'antd';
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: '/api',
});

const { TextArea } = Input;
const { Text } = Typography;

export default function () {
  const [sql, setSql] = useState('');
  const [error, setError] = useState(null);
  const [columns, setColumns] = useState([]);
  const [dataSource, setDataSource] = useState([]);
  const [time, setTime] = useState(-1);

  async function executeQuery() {
    try {
      const { data } = await axiosInstance.get('/sql', {
        params: {
          query: sql,
        },
      });
      const resultColumns = data.fields.map(f => ({
        title: f,
        dataIndex: f,
        key: f,
      }));
      setError(null);
      setTime(data.time);
      setColumns(resultColumns);
      setDataSource(
        data.results.map(r => ({
          ...r,
          __reactKey__: Math.random(),
        }))
      );
    } catch (err) {
      setError(err.response.data);
      setColumns([]);
      setDataSource([]);
      setTime(-1);
    }
  }

  return (
    <div style={{ padding: 25 }}>
      <TextArea
        placeholder="Query"
        autoSize={{ minRows: 2 }}
        value={sql}
        onInput={e => setSql(e.target.value)}
      />
      <div style={{ marginTop: 20, marginBottom: 20 }}>
        <Button size="large" type="primary" onClick={executeQuery}>
          Execute
        </Button>
        {time > -1 && (
          <Text style={{ marginLeft: 20 }}>
            Query execution time: {time} ms
          </Text>
        )}
      </div>
      {!!columns.length && (
        <Table
          dataSource={dataSource}
          columns={columns}
          rowKey="__reactKey__"
        />
      )}
      {!!error && <Alert message={error} type="error" showIcon />}
    </div>
  );
}
