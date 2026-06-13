import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import App from "./App";

beforeEach(() => {
  localStorage.clear();
});

describe("Civora core workflows", () => {
  it("renders the command center with transparent demo labeling", async () => {
    render(<App />);
    expect(screen.getByText("DEMO DATA")).toBeInTheDocument();
    expect(await screen.findByText("Good morning, Nadia.")).toBeInTheDocument();
    expect(screen.getByText("Intervention recommended")).toBeInTheDocument();
  });

  it("acknowledges the top alert and updates the interface", async () => {
    render(<App />);
    const dispatch = await screen.findByRole("button", { name: /dispatch response/i });
    fireEvent.click(dispatch);
    await waitFor(() => {
      expect(screen.getByRole("heading", { name: "PPE compliance anomaly" })).toBeInTheDocument();
      expect(screen.queryByRole("heading", { name: "Heat stress threshold exceeded" })).not.toBeInTheDocument();
    });
  });

  it("navigates to the sustainability workspace", async () => {
    render(<App />);
    fireEvent.click(screen.getByRole("button", { name: /carbon & circularity/i }));
    expect(await screen.findByText("Turn sustainability into site economics.")).toBeInTheDocument();
  });
});
