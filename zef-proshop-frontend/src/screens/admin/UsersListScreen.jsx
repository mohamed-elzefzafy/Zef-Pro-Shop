import { Button, Image, Table } from "react-bootstrap";
import Loader from "../../Loader";
import Message from "../../Message";
import { FaTimes, FaTrash } from "react-icons/fa";
import { LinkContainer } from "react-router-bootstrap";
import { useDeleteUserMutation, useGetUsersQuery } from "../../redux/slices/usersApiSlice";
import swal from "sweetalert";
import { toast } from "react-toastify";


const UsersListScreen = () => {

  const {data : users , isLoading , refetch , error} = useGetUsersQuery();
  const [deleteUser] = useDeleteUserMutation();


  const deleteUserHandler = async (id) => {
    try {
      swal({
        title: "Are you sure you want delete this User?",
        // text: "if you delete this products",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      })
      .then(async(willDelete) => {
        if (willDelete) {
        const res =  await deleteUser(id).unwrap();
         refetch();
        if (res.data === "User deleted successfully") {
         toast.success("User deleted successfully");
          }}
      });
      
    } catch (error) {
      toast.error(error?.data?.message || error?.message)
    }
  }
  
  
  return (
    <>
    <h1>Users</h1>
    {isLoading ? <Loader/> : error ? <Message>
    <Message variant="danger">{error.data.message || error.message}</Message>
    </Message>
    : (
      <Table striped bordered hover responsive className="table-sm">
<thead>
<tr>
 <th>NAME</th>
<th>EMAIL</th>
<th>ADMIN</th>
<th>DELETE USER</th>
</tr>
</thead>
<tbody>
{users?.map((user) =>
<tr key={user?._id}>
  <td>{user?.name}  <Image className="ms-2" src={user?.profilePhoto?.url} fluid width="40px" height="40px"/> </td>
  <td>{user?.email}</td>
  <td>{user.isAdmin ? <h6 className="text-success">Admin</h6> : "User"}</td>
  <td>

    {user.isAdmin ?  <h6 className="text-danger">Admin</h6>
     : <FaTrash color="red" fontSize={20} type="button" onClick={() => deleteUserHandler(user._id)}/>}
  

  </td>
</tr>
)}
</tbody>
      </Table>
    )
    }
  </>
  )
}

export default UsersListScreen;