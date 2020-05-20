
import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Route, Switch } from "react-router-dom";

import Layout from "./layouts/Layout";

ReactDOM.render(
  <BrowserRouter>
    <Switch>
      <Route path="/" component={Layout} />
    </Switch>
  </BrowserRouter>,
  document.getElementById("root")
);
