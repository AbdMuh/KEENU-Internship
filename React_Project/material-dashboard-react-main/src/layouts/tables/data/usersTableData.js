/* eslint-disable react/prop-types */
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import Icon from "@mui/material/Icon";
import { Grid } from "@mui/material";

export default function usersTableData(users = [], onDelete, onUpdate) {
  return {
    columns: [
      { Header: "ID", accessor: "id", align: "center" },
      { Header: "Name", accessor: "name", align: "left" },
      { Header: "Email", accessor: "email", align: "left" },
      { Header: "Username", accessor: "username", align: "left" },
      { Header: "Password", accessor: "password", align: "left" },
      { Header: "Actions", accessor: "actions", align: "center" },
    ],
    rows: users.map((u) => ({
      id: u.id,
      name: (
        <MDTypography variant="button" fontWeight="medium">
          {u.name}
        </MDTypography>
      ),
      email: (
        <MDTypography variant="caption" color="text">
          {u.email}
        </MDTypography>
      ),
      username: (
        <MDTypography variant="caption" color="text" fontWeight="medium">
          {u.loginUser?.username || "—"}
        </MDTypography>
      ),
      password: (
        <MDTypography variant="caption" color="text">
          {u.loginUser?.password || "—"}
        </MDTypography>
      ),
      actions: (
        <Grid container spacing={1}>
          <Grid item>
            <MDButton
              color="info"
              size="small"
              onClick={() => {
                const confirmUpdate = window.confirm(`Are you sure you want to Update ${u.name}?`);
                if (confirmUpdate && onUpdate) {
                  onUpdate(u.id, {
                    id: u.id,
                    name: u.name,
                    email: u.email,
                    username: u.loginUser?.username || "",
                    password: u.loginUser?.password || "",
                  });
                }
              }}
            >
              <Icon>edit</Icon>&nbsp;Update
            </MDButton>
          </Grid>
          <Grid item>
            <MDButton
              color="error"
              size="small"
              onClick={() => {
                const confirmDelete = window.confirm(
                  `Are you sure you want to Delete User ${u.name}?`
                );
                if (confirmDelete && onDelete) {
                  onDelete(u.id);
                }
              }}
            >
              <Icon>delete</Icon>&nbsp;Delete
            </MDButton>
          </Grid>
        </Grid>
      ),
    })),
  };
}
