import Table from 'react-bootstrap/Table';

function DataGrid() {
  return (
<Table striped bordered hover>
  <thead>
    <tr>
      <th>#</th>
      <th>Item</th>
      <th>Description</th>
      <th>Location Found</th>
      <th>Date Lost</th>
      <th>Date Found</th>
      <th>Status</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>1</td>
      <td>Wallet</td>
      <td>Brown leather wallet with cards</td>
      <td>Main Lobby</td>
      <td>2024-12-25</td>
      <td>2024-12-27</td>
      <td>Unclaimed</td>
    </tr>
    <tr>
      <td>2</td>
      <td>Phone</td>
      <td>Black iPhone 12 with cracked screen</td>
      <td>Cafeteria</td>
      <td>2024-12-26</td>
      <td>2024-12-28</td>
      <td>Claimed</td>
    </tr>
    <tr>
      <td>3</td>
      <td>Bag</td>
      <td>Blue backpack with laptop</td>
      <td>Library</td>
      <td>2024-12-20</td>
      <td>2024-12-21</td>
      <td>Unclaimed</td>
    </tr>
  </tbody>
</Table>



  );
}

export default DataGrid;