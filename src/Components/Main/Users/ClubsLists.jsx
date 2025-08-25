import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { AppContext } from "../../../App";
import { useTranslation } from "react-i18next";
import { FetchAllUsers } from "../../../Api/Main/Users/FetchAllUsers";
import i18n from "../../../i18n";
import SearchIcon from "@mui/icons-material/Search";
import {
  Container,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  Paper,
  TablePagination,
  Button,
  Modal,
  Box,
  useTheme,
  useMediaQuery,
  TextField,
} from "@mui/material";
import { Chip } from "@mui/material";
import { BlockUser } from "../../../Api/Main/Users/BlockUser";
import { useNavigate } from "react-router-dom";
import BlockIcon from "@mui/icons-material/Block";
export default function ClubsLists() {
  const { mainColor, secondColor, hoverColor } = useContext(AppContext);
  const { t } = useTranslation();
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const direction = i18n.dir();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const handleChangePage = useCallback((_event, newPage) => {
    setPage(newPage);
  }, []);
  const handleChangeRowsPerPage = useCallback((event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  }, []);
  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const result = await FetchAllUsers();
        if (result?.data?.Users) {
          const clubUsers = result.data.Users.filter(
            (user) => user.role === "club"
          );
          console.log("club users", clubUsers);
          setRows(clubUsers);
        }
      } catch (error) {
        console.error("Failed to fetch users:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);
  //handle with Block
  const [indexBlock, setIndexBlock] = useState(0);
  const [openBlock, setOpenBlock] = useState(false);
  const [banDate, setBanDate] = useState({
    id: "",
    ban_date: "",
  });
  const handleOpenBlock = (row) => {
    console.log(row.user_id);
    setOpenBlock(true);
    setIndexBlock(row.user_id);
  };
  const handleCloseBlock = () => {
    setOpenBlock(false);
    setBanDate({
      id: "",
      ban_date: "",
    });
  };
  const handleBlock = async () => {
    const result = await BlockUser(banDate);
    if (result) {
      setRows((prev) =>
        prev.map((user) =>
          user.user_id === banDate.id
            ? { ...user, ban_date: banDate.ban_date }
            : user
        )
      );
      console.log("user block successfully!");
      handleCloseBlock();
    } else {
      console.log("Failed to block user.");
      handleCloseBlock();
    }
  };
  const handleChange = async (e) => {
    const { name, value } = e.target;
    setBanDate((prev) => ({
      ...prev,
      [name]: value,
      id: indexBlock,
    }));
    console.log(banDate);
  };
  const columns = useMemo(
    () => [
      {
        field: "name",
        headerName: t("name"),
        minWidth: isMobile ? 120 : 150,
        align: "center",
      },
      {
        field: "email",
        headerName: t("email"),
        minWidth: isMobile ? 120 : 150,
        align: "center",
      },
      {
        field: "role",
        headerName: t("role"),
        minWidth: isMobile ? 120 : 150,
        align: "center",
      },
      {
        field: "phone_number",
        color: "white",
        headerName: t("phone number"),
        minWidth: isMobile ? 120 : 150,
        align: "center",
      },
      {
        field: "ban_date",
        headerName: t("ban date"),
        minWidth: isMobile ? 120 : 150,
        align: "center",
      },
      {
        field: "action",
        headerName: t("action"),
        minWidth: isMobile ? 120 : 150,
        align: "center",
      },
    ],
    [t, isMobile]
  );
  //handle with filter
  const [filterText, setFilterText] = useState("");
  const filteredRows = useMemo(() => {
    if (!filterText.trim()) return rows;

    return rows.filter((row) =>
      Object.values(row).some((value) =>
        String(value).toLowerCase().includes(filterText.toLowerCase())
      )
    );
  }, [rows, filterText]);
  // button style
  const commonButtonStyle = {
    borderRadius: "8px",
    backgroundImage: `linear-gradient(${mainColor}, ${secondColor})`,
    p: { xs: 1, sm: 1.5 },
    fontWeight: "bold",
    "&:hover": { background: hoverColor },
    fontSize: { xs: "16px", sm: "20px" },
    color: "white",
    minWidth: "100px",
  };
  return (
    <Container className="read-item">
      <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
        {" "}
        <TextField
          label={
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <SearchIcon sx={{ fontSize: 18 }} />
              {t("search")}
            </Box>
          }
          variant="outlined"
          size="small"
          sx={{
            my: 2,
            alignSelf: "end",
            "& .MuiInputBase-input": {
              fontSize: isMobile ? "14px" : "16px",
              color: mainColor,
            },
            "& .MuiInputLabel-root": {
              color: mainColor,
            },
            "& .MuiOutlinedInput-root": {
              background: "#F5F5F7",
              borderRadius: "20px",
              "& fieldset": {
                borderColor: "transparent",
              },
              "&:hover fieldset": {
                borderColor: secondColor,
              },
              "&.Mui-focused fieldset": {
                borderColor: secondColor,
              },
            },
          }}
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
        />
      </Box>

      <Paper
        sx={{
          backgroundColor: "transparent",
          width: "100%",
          maxWidth: "100%",
          boxShadow: "0px 4px 10px rgba(0,0,0,0.25)",
          overflowX: "auto",
        }}
      >
        <Table aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.field}
                  align={column.align}
                  style={{
                    color: "white",
                    minWidth: column.minWidth,
                    fontWeight: "bold",
                    fontSize: isMobile ? "14px" : "18px",
                    padding: isMobile ? "8px" : "16px",
                    backgroundImage: `linear-gradient(to bottom, rgb(43, 92, 204),rgb(178, 195, 236))`,
                  }}
                >
                  {column.headerName}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={columns.length} align="center">
                  <Typography sx={{ my: 2, fontSize: "large" }}>
                    {t("Loading...")}
                  </Typography>
                </TableCell>
              </TableRow>
            ) : rows.length > 0 ? (
              filteredRows
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row) => (
                  <TableRow hover key={row.user_id}>
                    <TableCell
                      align="center"
                      sx={{ fontSize: isMobile ? "12px" : "16px" }}
                    >
                      {row.name}
                    </TableCell>
                    <TableCell
                      align="center"
                      sx={{ fontSize: isMobile ? "12px" : "16px" }}
                    >
                      {row.email}
                    </TableCell>
                    <TableCell
                      align="center"
                      sx={{ fontSize: isMobile ? "12px" : "16px" }}
                    >
                      {row.role}
                    </TableCell>
                    <TableCell
                      align="center"
                      sx={{ fontSize: isMobile ? "12px" : "16px" }}
                    >
                      {row.phone_number}
                    </TableCell>
                    <TableCell align="center">
                      {row.ban_date === null ? (
                        <Chip label="Active" color="success" size="small" />
                      ) : (
                        <Chip
                          label={`Banned until ${row.ban_date}`}
                          color="error"
                          size="small"
                        />
                      )}
                    </TableCell>
                    <TableCell align="center">
                      <Button
                        title="block user"
                        onClick={() => handleOpenBlock(row)}
                        sx={{ minWidth: "unset", p: isMobile ? 0.5 : 1 }}
                      >
                        <BlockIcon
                          sx={{
                            color: mainColor,
                            fontSize: isMobile ? 18 : 24,
                          }}
                        />
                      </Button>
                      <Modal
                        open={openBlock}
                        onClose={handleCloseBlock}
                        aria-labelledby="modal-modal-title"
                        aria-describedby="modal-modal-description"
                      >
                        <Box
                          sx={{
                            margin: "100px auto",
                            p: 3,
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: 3,
                            backgroundColor: "rgba(255,255,255,0.8)",
                            backdropFilter: "blur(6px)",
                            boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                            borderRadius: 8,
                            border: `1px solid ${secondColor}`,
                            height: "auto",
                            maxWidth: "600px",
                          }}
                        >
                          <Typography
                            id="modal-modal-title"
                            variant="h6"
                            component="h2"
                          >
                            {t("are you sure you want to block this user??")}
                          </Typography>
                          <TextField
                            fullWidth
                            sx={{
                              borderRadius: "8px",
                              background: "#F5F5F7",
                              "& .MuiOutlinedInput-root": {
                                borderRadius: "8px",
                                background: "#F5F5F7",
                              },
                            }}
                            type="date"
                            name="ban_date"
                            variant="outlined"
                            value={banDate.ban_date}
                            onChange={handleChange}
                          />
                          <Typography
                            id="modal-modal-description"
                            sx={{ mt: 2 }}
                          >
                            <Box
                              sx={{
                                mt: 2,
                                display: "flex",
                                gap: 2,
                                justifyContent: "center",
                              }}
                            >
                              {" "}
                              <Button
                                type="submit"
                                variant="contained"
                                sx={commonButtonStyle}
                                onClick={handleBlock}
                              >
                                Yes
                              </Button>
                              <Button
                                type="button"
                                variant="contained"
                                sx={commonButtonStyle}
                                onClick={handleCloseBlock}
                              >
                                No
                              </Button>
                            </Box>
                          </Typography>
                        </Box>
                      </Modal>
                    </TableCell>
                  </TableRow>
                ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} align="center">
                  <Typography sx={{ my: 2, fontSize: "large" }}>
                    {t("no users found")}
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredRows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </Container>
  );
}
