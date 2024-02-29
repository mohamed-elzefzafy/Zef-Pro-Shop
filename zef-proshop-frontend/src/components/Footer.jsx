import { Col, Container } from "react-bootstrap";


const Footer = () => {
  const currentYear = new Date().getFullYear();
  return (
    <footer>
      <Container>
        <row>
          <Col  className="py-2 text-center">
            <p>Zef-Proshop &copy; {currentYear}</p>
          </Col>
        </row>
      </Container>
    </footer>
  )
}

export default Footer;