import { Col, Container , Row } from "react-bootstrap";


const Footer = () => {
  const currentYear = new Date().getFullYear();
  return (
    <footer>
      <Container>
        <Row>
          <Col  className="py-2 text-center">
            <p>Zef-Proshop &copy; {currentYear}</p>
          </Col>
        </Row>
      </Container>
    </footer>
  )
}

export default Footer;