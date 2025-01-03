import { Row, Col, Switch } from 'antd';

export default function Maintenance() {
  return (
    <Row gutter={[16, 16]} className="max-w-2xl items-center">
      <Col>
        <p className="text-2xl font-bold">Maintenance Mode</p>
      </Col>
      <Col>
        <div>
          <Switch defaultChecked={false} />
        </div>
      </Col>
    </Row>
  );
}
