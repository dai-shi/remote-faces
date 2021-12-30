import { render, waitForElementToBeRemoved } from "@testing-library/react";
import { App } from "./App";

jest.mock("../utils/crypto");

test("renders App", async () => {
  const { getByText, getAllByText } = render(<App />);
  await waitForElementToBeRemoved(getByText(/loading/i));
  const elements = getAllByText(/create a new room/i);
  expect(elements.length).toBeGreaterThanOrEqual(1);
});
