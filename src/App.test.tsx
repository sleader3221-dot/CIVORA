import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import App from "./App";

beforeEach(() => {
  localStorage.clear();
});

async function login() {
  render(<App />);
  fireEvent.click(screen.getByRole("button", { name: /access command center/i }));
  await waitFor(
    () => expect(screen.getByText("DEMO DATA")).toBeInTheDocument(),
    { timeout: 3000 }
  );
}

describe("Civora core workflows", () => {
  it("renders the command center with transparent demo labeling", async () => {
    await login();
    expect(screen.getByText("DEMO DATA")).toBeInTheDocument();
    expect(screen.getByText(/Nadia/)).toBeInTheDocument();
    expect(await screen.findByText("Intervention recommended")).toBeInTheDocument();
  });

  it("acknowledges the top alert and updates the interface", async () => {
    await login();
    const dispatch = await screen.findByRole("button", { name: /dispatch response/i });
    fireEvent.click(dispatch);
    await waitFor(() => {
      expect(screen.getByRole("heading", { name: "PPE compliance anomaly" })).toBeInTheDocument();
      expect(screen.queryByRole("heading", { name: "Heat stress threshold exceeded" })).not.toBeInTheDocument();
    });
  });

  it("navigates to the sustainability workspace", async () => {
    await login();
    fireEvent.click(screen.getByRole("button", { name: /carbon & circularity/i }));
    expect(await screen.findByText("Turn sustainability into site economics.")).toBeInTheDocument();
  });
});
