import { Button, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom"


const SearchComponent = ({keyWordState , setKeyWordState}) => {
  const navigate = useNavigate();

const submitHandler = (e) => {
e.preventDefault();
if (keyWordState.trim()) {
  navigate(`search/${keyWordState}`);
} else {
  navigate("/");

}
}
  return (
    <Form onSubmit={submitHandler} className="d-flex">
<Form.Control 
  type="text"
  name="q"
  value={keyWordState}
  onChange={(e) => setKeyWordState(e.target.value)}
placeholder="search products..."
className="mr-sm-2 ml-sm-5"
/>
<Button type="submit" variant="outline-success" className="p-2 mx-2">Search</Button>
    </Form>
  )
}

export default SearchComponent