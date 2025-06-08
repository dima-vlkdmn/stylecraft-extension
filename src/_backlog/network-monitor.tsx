import React, { useState, useEffect } from 'react';
import { DataTable, DataTableProps } from 'primereact/datatable';
import { Column } from 'primereact/column';
import styled from 'styled-components';

interface NetworkRequest {
  request: {
    method: string;
    url: string;
  };
  response: {
    status: number;
  };
  time: number;
}

const NetworkMonitor: React.FC = () => {
  const [requests, setRequests] = useState<NetworkRequest[]>([]);

  useEffect(() => {
    const handleRequestFinished = (request: NetworkRequest) => {
      setRequests((prevRequests) => [...prevRequests, request]);
    };

    chrome.devtools.network.onRequestFinished.addListener(handleRequestFinished);

    return () => {
      chrome.devtools.network.onRequestFinished.removeListener(handleRequestFinished);
    };
  }, []);

  return (
    <MonitorContainer>
      <h2>Network monitoring</h2>
      <DataTable value={requests} scrollable scrollHeight="400px" paginator rows={10}>
        <Column field="request.method" header="Method" />
        <Column field="request.url" header="URL" />
        <Column field="response.status" header="Status" />
        <Column field="time" header="Time (ms)" body={(rowData: NetworkRequest) => rowData.time.toFixed(2)} />
      </DataTable>
    </MonitorContainer>
  );
};

const MonitorContainer = styled.div`
  color: #000;
  background-color: #fff;
  padding: 10px;
  border-radius: 5px;
  overflow: auto;
  max-height: 100%;
`;

export default NetworkMonitor;