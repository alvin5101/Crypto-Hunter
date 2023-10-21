import axios from "axios";
import React, { useEffect, useState } from "react";
import { CoinList } from "../config/api";
import { CryptoState } from "../CryptoContext";
import {
  Container,
  LinearProgress,
  Pagination,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  ThemeProvider,
  Typography,
  createTheme,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const CoinsTable = () => {
  // const [coins, setCoins] = useState([]);
  // const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const { currency, symbol, coins, loading, fetchCoins } = CryptoState();

  const navigate = useNavigate();

  // const fetchCoins = async () => {
  //   setLoading(true);
  //   const { data } = await axios.get(CoinList(currency));
  //   setCoins(data);
  //   setLoading(false);
  // };

  console.log("coins", coins);

  useEffect(() => {
    fetchCoins();
  }, [currency]);

  const darkTheme = createTheme({
    palette: {
      primary: {
        main: "#fff",
      },
      mode: "dark",
    },
  });

  const handleSearch = () => {
    return coins.filter(
      (coin) =>
        coin.name.toLowerCase().includes(search) ||
        coin.symbol.toLowerCase().includes(search)
    );
  };

  const numberWithCommas = (x) => {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <Container style={{ textAlign: "center" }}>
        <Typography
          style={{ margin: 18, fontFamily: "Montserrat" }}
          variant="h4"
        >
          Cryptocurrency Prices by Maket Cap
        </Typography>
        <TextField
          variant="outlined"
          label="Search for a Crypto currency"
          style={{ width: "100%", marginBottom: 20 }}
          onChange={(e) => setSearch(e.target.value)}
        />

        <TableContainer>
          {loading ? (
            <LinearProgress style={{ backgroundColor: "gold" }} />
          ) : (
            <Table>
              <TableHead style={{ backgroundColor: "#EEBC1D" }}>
                <TableRow>
                  {["Coin", "Price", "24h Change", "Market Cap"].map((head) => (
                    <TableCell
                      style={{ color: "black", fontWeight: 700 }}
                      key={head}
                      align={head === "Coin" ? "" : "right"}
                    >
                      {head}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {handleSearch()
                  .slice((page - 1) * 10, (page - 1) * 10 + 10)
                  .map((row) => {
                    const profit = row.price_change_percentage_24h > 0;

                    return (
                      <TableRow
                        onClick={() => navigate(`/coins/${row.id}`)}
                        key={row.name}
                        className="row"
                      >
                        <TableCell
                          component="th"
                          scope="row"
                          style={{
                            display: "flex",
                            gap: 15,
                          }}
                        >
                          <img
                            src={row?.image}
                            alt={row?.name}
                            height="50"
                            style={{ marginBottom: 10 }}
                          />
                          <div className="tableCell">
                            <span
                              style={{
                                textTransform: "uppercase",
                                fontSize: 20,
                              }}
                            >
                              {row?.symbol}
                            </span>
                            <span style={{ color: "darkgray" }}>
                              {row?.name}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell align="right" style={{ fontSize: 20 }}>
                          {symbol}{" "}
                          {numberWithCommas(row?.current_price.toFixed(2))}
                        </TableCell>
                        <TableCell
                          align="right"
                          style={{
                            fontSize: 20,
                            fontWeight: 500,
                            color: profit > 0 ? "rgb(14,203,129)" : "red",
                          }}
                        >
                          {profit && "+"}{" "}
                          {row?.price_change_percentage_24h.toFixed(2)}%
                        </TableCell>
                        <TableCell align="right" style={{ fontSize: 20 }}>
                          {symbol}
                          {numberWithCommas(
                            row?.market_cap.toString().slice(0, -6)
                          )}{" "}
                          M
                        </TableCell>
                      </TableRow>
                    );
                  })}
              </TableBody>
            </Table>
          )}
        </TableContainer>
        <Pagination
          count={(handleSearch()?.length / 10).toFixed(0)}
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "center",
            padding: 20,
          }}
          color="primary"
          onChange={(_, value) => {
            setPage(value);
            window.scroll(0, 450);
          }}
        />
      </Container>
    </ThemeProvider>
  );
};

export default CoinsTable;
