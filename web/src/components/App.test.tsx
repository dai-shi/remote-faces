import React from "react";
import { render } from "@testing-library/react";
import { App } from "./App";

jest.mock("../utils/crypto");

test("renders App", () => {
  const { getByText } = render(<App />);
  const element = getByText(/Loading|Create a new room/i);
  expect(element).toBeInTheDocument();
});
