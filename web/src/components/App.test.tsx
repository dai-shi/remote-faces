import React from "react";
import { render } from "@testing-library/react";
import App from "./App";

test("renders your name", () => {
  const { getByText } = render(<App />);
  const linkElement = getByText(/your name/i);
  expect(linkElement).toBeInTheDocument();
});
