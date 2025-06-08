import React, { useState } from 'react';
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { InputTextarea } from 'primereact/inputtextarea';
import styled from 'styled-components';

type Method = 'GET' | 'POST' | 'PUT' | 'DELETE';

interface RESTAPITesterProps {}

const RESTAPITester: React.FC<RESTAPITesterProps> = () => {
  const [endpoint, setEndpoint] = useState<string>('');
  const [method, setMethod] = useState<Method>('GET');
  const [body, setBody] = useState<string>('');
  const [headers, setHeaders] = useState<string>('');
  const [response, setResponse] = useState<any>(null);
  const [status, setStatus] = useState<number | null>(null);
  const [responseHeaders, setResponseHeaders] = useState<Record<string, string>>({});

  const methods: { label: string, value: Method }[] = [
    { label: 'GET', value: 'GET' },
    { label: 'POST', value: 'POST' },
    { label: 'PUT', value: 'PUT' },
    { label: 'DELETE', value: 'DELETE' }
  ];

  const parseHeaders = (headersString: string): HeadersInit => {
    const headers: HeadersInit = {};
    headersString.split('\n').forEach(line => {
      const [key, value] = line.split(':').map(part => part.trim());
      if (key && value) {
        headers[key] = value;
      }
    });
    return headers;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`http://localhost:3001${endpoint}`, {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...parseHeaders(headers),
        },
        body: method !== 'GET' ? JSON.stringify(JSON.parse(body)) : null,
      });
      const data = await res.json();
      setResponse(data);
      setStatus(res.status);
      const responseHeadersObj: Record<string, string> = {};
      res.headers.forEach((value, key) => {
        responseHeadersObj[key] = value;
      });
      setResponseHeaders(responseHeadersObj);
    } catch (error: unknown) {
      if (error instanceof Error) {
        setResponse({ error: error.message });
      } else {
        setResponse({ error: 'An unknown error occurred' });
      }
    }
  };

  return (
    <TesterContainer>
      <Title>REST API Tester</Title>
      <Form onSubmit={handleSubmit}>
        <Label>Endpoint</Label>
        <InputText
          value={endpoint}
          onChange={(e) => setEndpoint(e.target.value)}
          placeholder="/posts"
          className="p-inputtext"
        />
        <Label>Method</Label>
        <Dropdown
          value={method}
          options={methods}
          onChange={(e) => setMethod(e.value as Method)}
          placeholder="Select HTTP Method"
          className="p-dropdown"
        />
        {method !== 'GET' && (
          <>
            <Label>Request Body</Label>
            <InputTextarea
              rows={5}
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder='{"key": "value"}'
              className="p-inputtextarea"
            />
          </>
        )}
        <Label>Headers</Label>
        <InputTextarea
          rows={5}
          value={headers}
          onChange={(e) => setHeaders(e.target.value)}
          placeholder="Key: Value"
          className="p-inputtextarea"
        />
        <Button type="submit" label="Send Request" className="p-button" />
      </Form>
      {status && (
        <StatusContainer>
          <Subtitle>Status: {status}</Subtitle>
        </StatusContainer>
      )}
      {Object.keys(responseHeaders).length > 0 && (
        <ResponseContainer>
          <Subtitle>Response Headers</Subtitle>
          <Preformatted>{JSON.stringify(responseHeaders, null, 2)}</Preformatted>
        </ResponseContainer>
      )}
      {response && (
        <ResponseContainer>
          <Subtitle>Response</Subtitle>
          <Preformatted>{JSON.stringify(response, null, 2)}</Preformatted>
        </ResponseContainer>
      )}
    </TesterContainer>
  );
};

const TesterContainer = styled.div`
  color: #000;
  background-color: #fff;
  padding: 20px;
  border-radius: 5px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  max-width: 600px;
  margin: 20px auto;
`;

const Title = styled.h2`
  margin-top: 0;
`;

const Subtitle = styled.h3`
  margin-top: 0;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
`;

const Label = styled.label`
  margin-bottom: 5px;
`;

const StatusContainer = styled.div`
  margin-top: 20px;
  padding: 10px;
  background-color: #f1f1f1;
  border-radius: 5px;
`;

const ResponseContainer = styled.div`
  margin-top: 20px;
  padding: 10px;
  background-color: #f1f1f1;
  border-radius: 5px;
`;

const Preformatted = styled.pre`
  background-color: #eee;
  padding: 10px;
  border-radius: 5px;
  overflow-x: auto;
`;

export default RESTAPITester;