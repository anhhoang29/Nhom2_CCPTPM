import "./App.css";
import * as React from "react";
import RootRouters from "./components/route-path/RootRoutePath";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.min.js";
import "antd/dist/antd.min.css";
import { SnackbarProvider, useSnackbar } from "notistack";

function App(props) {
  const { enqueueSnackbar } = useSnackbar();

  const handleClick = () => {
    enqueueSnackbar("I love snacks.");
  };

  const handleClickVariant = (variant) => () => {
    // variant could be success, error, warning, info, or default
    enqueueSnackbar("This is a success message!", { variant });
  };

  return (
    <SnackbarProvider
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      maxSnack={12}
      disableWindowBlurListener={true}
      autoHideDuration={5000}
    >
      <div className="App">
        <RootRouters />
      </div>
    </SnackbarProvider>
  );
}

export default App;
